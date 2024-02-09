-- SCHEMA AND TABLES CREATION
CREATE SCHEMA IF NOT EXISTS authentication;

CREATE TABLE IF NOT EXISTS authentication.users (
	email text PRIMARY KEY CHECK (email ~* '^.+@.+\..+$'),
	first_name text,
	last_name text,
	role name NOT NULL CHECK (length(role) < 512),
	PASSWORD text CHECK (length(PASSWORD) < 512),
	is_active bool NOT NULL, 
	schema_access text[] DEFAULT '{}'
);

-- CREATE TABLE IF NOT EXISTS meta.user_schema_access (
-- 	email text REFERENCES authentication.users,
-- 	schema text -- Add trigger to verify if schema exists in schema view
-- );

-- Creates a VIEW that gives the users information (except the passwords)
CREATE OR REPLACE VIEW meta.user_info AS (
		SELECT email,
			first_name,
			last_name,
			role,
			is_active,
			schema_access
		FROM authentication.users
	);
-- TRIGGER to ensure the role from the authentication.users table is an actual database role
CREATE OR REPLACE FUNCTION authentication.check_role_exists() RETURNS TRIGGER AS $$ BEGIN IF NOT EXISTS(
		SELECT 1
		FROM pg_roles AS r
		WHERE r.rolname = new.role
	) THEN raise foreign_key_violation USING message = 'invalid database role: ' || new.role;
RETURN NULL;
END IF;
RETURN new;
END $$ language plpgsql;

DROP TRIGGER IF EXISTS ensure_user_role_exists ON authentication.users;
CREATE CONSTRAINT TRIGGER ensure_user_role_exists
AFTER
INSERT
	OR
UPDATE ON authentication.users FOR each ROW EXECUTE PROCEDURE authentication.check_role_exists();

-- -- TRIGGER to ensure the schemas from user_schema_access are existing schemas
-- CREATE OR REPLACE FUNCTION meta.check_schema_exists() RETURNS TRIGGER AS $$ BEGIN IF NOT EXISTS(
-- 		SELECT 1
-- 		FROM meta.schemas AS s
-- 		WHERE s.schema = new.schema
-- 	) THEN raise foreign_key_violation USING message = 'invalid schema : ' || new.role;
-- RETURN NULL;
-- END IF;
-- RETURN new;
-- END $$ language plpgsql;

-- DROP TRIGGER IF EXISTS ensure_schema_exists ON meta.user_schema_access;
-- CREATE CONSTRAINT TRIGGER ensure_schema_exists
-- AFTER
-- INSERT
-- 	OR
-- UPDATE ON meta.user_schema_access FOR each ROW EXECUTE PROCEDURE meta.check_schema_exists();

-- TRIGGER to keep the passwords encrypted with pgcrypto
CREATE extension IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION authentication.encrypt_password() RETURNS TRIGGER AS $$ BEGIN IF tg_op = 'INSERT'
	OR new.password <> old.password
	OR old.password IS NULL THEN new.password = crypt(new.password, gen_salt('bf'));
END IF;
RETURN new;
END $$ language plpgsql;

DROP TRIGGER IF EXISTS encrypt_password ON authentication.users;
CREATE TRIGGER encrypt_password before
INSERT
	OR
UPDATE ON authentication.users FOR each ROW EXECUTE PROCEDURE authentication.encrypt_password();

-- FUNCTION that returns the database role for a user if email and passwords match
CREATE OR REPLACE FUNCTION authentication.user_role(email text, PASSWORD text) RETURNS name language plpgsql AS $$ BEGIN RETURN (
		SELECT role
		FROM authentication.users
		WHERE users.email = user_role.email
			AND users.password = crypt(user_role.password, users.password)
	);
END;
$$;

-- JWT TOKENS
-- Generating JWT token using pgjwt
CREATE extension IF NOT EXISTS pgjwt;

CREATE TYPE authentication.jwt_token AS (token text);

-- FUNCTION to test the generation of jwt tokens
CREATE OR REPLACE FUNCTION meta.jwt_test() RETURNS authentication.jwt_token AS $$
SELECT sign(
		row_to_json(r),
		current_setting('custom.jwt_secret')
	) AS token
FROM (
		SELECT 'test_role'::text AS role,
			-- sets the role
			extract(
				epoch
				FROM NOW()
			)::integer + 300 AS exp -- sets the expiration of the token in 5 min
	) r;
$$ language SQL SECURITY DEFINER;

-- FUNCTION LOGIN, in the meta schema to be accessible to any user
DROP TYPE IF EXISTS authentication.jwt_token CASCADE;
CREATE TYPE authentication.jwt_token AS (token text);

CREATE OR REPLACE FUNCTION meta.login(email text, PASSWORD text) RETURNS authentication.jwt_token AS $$
DECLARE _role name;
_schema_access text[];
result authentication.jwt_token;
refresh_token authentication.jwt_token;
BEGIN -- check email & password
SELECT authentication.user_role(email, PASSWORD) INTO _role;
IF _role IS NULL THEN raise invalid_password USING message = 'invalid email or password';
END IF;
-- Obtains the schema access list of the user 
SELECT schema_access FROM authentication.users WHERE users.email = login.email INTO _schema_access;
-- signs the jwt access token
SELECT sign(
		row_to_json(r),
		current_setting('custom.jwt_secret')
	) AS token
FROM (
		SELECT _role AS role,
			login.email AS email,
			_schema_access as schema_access,
			extract(
				epoch
				FROM NOW()
			)::integer + 60 * 60 AS exp -- 1 hr,
	) AS r INTO result;
SELECT sign(
		row_to_json(rt),
		current_setting('custom.jwt_secret')
	) AS token
FROM (
		SELECT _role AS role,
			login.email AS email,
			extract(
				epoch
				FROM NOW()
			)::integer + 60 * 60 * 8 AS exp -- 8 hrs 
	) AS rt INTO refresh_token;
PERFORM set_config(
	'response.headers',
	format(
		'[{"Set-Cookie": "token=%s; SameSite=None; HttpOnly; Secure; Max-Age=28800;"}]', refresh_token.token),TRUE
);
RETURN result;
END;
$$ language plpgsql SECURITY DEFINER;


-- FUNCTION CREATE USER, for administrators to create the users in the database before they can sign up 
CREATE OR REPLACE FUNCTION meta.create_user(email text, role name, schema_access text[]) RETURNS SETOF integer AS $$ BEGIN
INSERT INTO authentication.users(email, role, is_active, schema_access)
VALUES (email, role, TRUE, create_user.schema_access);
RETURN;
END;
$$ language plpgsql SECURITY DEFINER;
REVOKE EXECUTE ON FUNCTION meta.create_user(TEXT, NAME)
FROM public;


-- FUNCTION for users to SIGNUP given an administrator previously created a user in the database for them
CREATE OR REPLACE FUNCTION meta.signup(
		email text,
		"password" text,
		first_name text,
		last_name text
	) RETURNS setof integer AS $$ BEGIN -- 	Verify if the user has been created by an administrator prior
	IF NOT EXISTS (
		SELECT users.email
		FROM authentication.users
		WHERE users.email = signup.email
	) THEN raise exception USING message = format(
		'User %L was not found. Please ensure an administrator has created a corresponding user in the system before trying to sign up.',
		signup.email
	);
ELSE -- 		Verify if the user has a password (i.e. if it already signed up)
IF EXISTS (
	SELECT users.email
	FROM authentication.users
	WHERE users.email = signup.email
		AND users.password IS NOT NULL
) THEN raise exception USING message = format(
	'User %L has already been signed up.',
	signup.email
);
ELSE
UPDATE authentication.users
SET PASSWORD = signup.password,
	first_name = signup.first_name,
	last_name = signup.last_name
WHERE users.email = signup.email;
END IF;
END IF;
RETURN;
END $$ language plpgsql SECURITY DEFINER;

-- FUNCTION to verify whether a user already signed up or not
CREATE OR REPLACE FUNCTION meta.verify_signup(email TEXT) RETURNS TEXT AS $$ BEGIN -- If the user hasn't been created yet, raise an exception with code 42704 
	IF NOT EXISTS (
		SELECT *
		FROM authentication.users
		WHERE users.email = verify_signup.email
	) THEN raise exception 'User not found' USING ERRCODE = '42704',
	DETAIL = format(
		'User %L could not be found in the system.',
		verify_signup.email
	);

	-- If the user has been created but never signed up, raise an exception with code 01000
ELSIF NOT EXISTS (
	SELECT *
	FROM authentication.users
	WHERE users.email = verify_signup.email
		AND users.password IS NOT NULL
) THEN raise exception 'User did not sign up.' USING ERRCODE = '01000',
DETAIL = format('User %L never signed up.', verify_signup.email);
-- If the user exists and already signed up, return its address email.
ELSE RETURN verify_signup.email;
END IF;
END $$ language plpgsql SECURITY DEFINER;

-- FUNCTION to refresh the access token using the refresh token from cookies
CREATE OR REPLACE FUNCTION meta.token_refresh() RETURNS authentication.jwt_token AS $$
DECLARE token_cookie text;
header json;
payload json;
valid boolean;
token_email text;
_role name;
result authentication.jwt_token;
BEGIN -- if the token cookie exists, take its value and set the authorization header with the token
SELECT current_setting('request.cookies', TRUE)::JSON->>'token' INTO token_cookie;
IF token_cookie <> '' THEN
SELECT * INTO header,
	payload,
	valid
FROM verify(
		token_cookie,
		current_setting('custom.jwt_secret')
	);
IF payload IS NULL THEN RAISE EXCEPTION 'Invalid refresh token';
ELSE token_email := payload->>'email';
-- 	Obtains the user's role
SELECT role
FROM authentication.users
WHERE users.email = token_email INTO _role;
-- 	Signs and returns the new access token
SELECT sign(
		row_to_json(r),
		current_setting('custom.jwt_secret')
	) AS token
FROM (
		SELECT _role AS role,
			token_email AS email,
			extract(
				epoch
				FROM NOW()
			)::integer + 60 * 60 AS exp
	) AS r INTO result;
RETURN result;
END IF;
END IF;
RAISE EXCEPTION 'No refresh token found';
END;
$$ language plpgsql SECURITY DEFINER;


-- FUNCTION logout to clear cookies containing refresh tokens
CREATE OR REPLACE FUNCTION meta.logout() 
RETURNS VOID AS
$$ BEGIN
  -- Set the "Set-Cookie" header to clear the cookie
  PERFORM set_config('response.headers', '[{"Set-Cookie": "token=; Max-Age=0;"}]', true);
  END;
$$language plpgsql SECURITY DEFINER;

-- TYPE of user data, used in meta.update_user_data
CREATE TYPE user_data AS (
	email text,
	first_name text,
	last_name text,
	role name,
	is_active bool, 
	schema_access text[]

);

-- FUNCTION Updates the user's data in bulk from an array of new user data
CREATE OR REPLACE FUNCTION meta.update_user_data(users json)
RETURNS VOID AS $$
BEGIN 
	UPDATE authentication.users AS oldud
	SET 
		first_name = newud.first_name,
		last_name = newud.last_name,
		role = newud.role,
		is_active = newud.is_active,
		schema_access = newud.schema_access
	FROM (SELECT * FROM json_populate_recordset(null::user_data, users)) as newud
	WHERE oldud.email = newud.email;

END;
$$ language plpgsql SECURITY DEFINER;


-- ROLES ----------------------------------------------------------------

-- User role
-- Granting all on application schemas and tables to user role
DO $$
DECLARE schema_name text;
table_record record;
BEGIN FOR schema_name IN (
	SELECT "schema"
	FROM meta.schemas
	WHERE "schema" LIKE 'app%'
) LOOP EXECUTE format('GRANT ALL ON SCHEMA %I TO "user";', schema_name);
FOR table_record IN (
	SELECT "table"
	FROM meta.tables
	WHERE meta.tables.schema = schema_name -- replace with your schema name
) LOOP EXECUTE format(
	'GRANT ALL ON TABLE %I.%I TO "user";',
	schema_name,
	table_record.table
);
END LOOP;
END LOOP;
END $$ LANGUAGE plpgsql;

-- GRANT USAGE ON SCHEMA meta TO "user";
-- GRANT SELECT ON ALL SEQUENCES IN SCHEMA meta TO "user";
-- GRANT SELECT ON TABLE meta.appconfig_properties TO "user";
-- GRANT SELECT ON TABLE meta.appconfig_values TO "user";
-- GRANT SELECT ON TABLE meta.scripts TO "user";
-- GRANT SELECT ON TABLE meta.schemas TO "user";
-- GRANT SELECT ON TABLE meta.tables TO "user";
-- GRANT SELECT ON TABLE meta.columns TO "user";
-- GRANT SELECT ON TABLE meta.constraints TO "user";
-- GRANT SELECT ON TABLE meta.user_schema_access TO "user";
GRANT EXECUTE ON FUNCTION meta.logout() TO "user";

-- Configurator role

-- GRANT ALL ON SCHEMA meta TO configurator;
-- GRANT USAGE ON ALL SEQUENCES IN SCHEMA meta TO configurator;
-- GRANT ALL ON TABLE meta.appconfig_properties TO configurator;
-- GRANT ALL ON TABLE meta.appconfig_values TO configurator;
-- GRANT ALL ON TABLE meta.scripts TO configurator;
-- GRANT ALL ON TABLE meta.schemas TO configurator;
-- GRANT ALL ON TABLE meta.tables TO configurator;
-- GRANT ALL ON TABLE meta.columns TO configurator;
-- GRANT ALL ON TABLE meta.constraints TO configurator;
-- GRANT ALL ON TABLE meta.user_schema_access TO configurator;

-- Administrator role

GRANT EXECUTE ON FUNCTION meta.create_user(text, name) TO administrator;
GRANT SELECT ON TABLE meta.user_info TO administrator;

GRANT EXECUTE ON FUNCTION meta.login(text, text) TO web_anon;
GRANT EXECUTE ON FUNCTION meta.signup TO web_anon;
GRANT EXECUTE ON FUNCTION meta.verify_signup(text) TO web_anon;
GRANT EXECUTE ON FUNCTION meta.token_refresh() TO web_anon;


-- TO REMOVE AT SOME POINT - Creates test users with all 3 roles for dev purposes
INSERT INTO authentication.users(
		email,
		first_name,
		last_name,
		PASSWORD,
		is_active,
		role, 
		schemas
	)
VALUES (
		'admin@test.com',
		'test',
		'admin',
		'admin123',
		TRUE,
		'administrator', 
		'{app_rentals, app_service_support}'
	),
	(
		'config@test.com',
		'test',
		'admin',
		'config123',
		TRUE,
		'configurator',
		'{app_rentals, app_service_support}'
	),
	(
		'user@test.com',
		'test',
		'admin',
		'user123',
		TRUE,
		'user',
		'{app_rentals, app_service_support}'
	) ON CONFLICT (email) DO NOTHING;
-- If you change anything here after they've been created once in the database, it won't have any effect. You need to remove them first from the database.
NOTIFY pgrst,
'reload schema';