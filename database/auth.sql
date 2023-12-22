-- SCHEMA AND TABLES CREATION
CREATE SCHEMA IF NOT EXISTS authentication;

CREATE TABLE IF NOT EXISTS 
authentication.users (
	email text primary key check (email ~* '^.+@.+\..+$'),
	first_name text,
	last_name text,
	role name not null check (length(role)<512),
	password text check (length(password) < 512),
	is_active bool not null
);

CREATE TABLE IF NOT EXISTS 
meta.user_schema_access (
	email text REFERENCES authentication.users,
	schema text -- Add trigger to verify if schema exists in schema view
);

-- TRIGGER to ensure the role from the authentication.users table is an actual database role
CREATE OR REPLACE FUNCTION 
authentication.check_role_exists() returns trigger as $$
begin
	if not exists(select 1 from pg_roles as r where r.rolname = new.role) then
		raise foreign_key_violation using message = 
			'invalid database role: ' || new.role;
		return null;
	end if;
	return new;
end
$$ language plpgsql;

drop trigger if exists ensure_user_role_exists on authentication.users;
create constraint trigger ensure_user_role_exists
	after insert or update on authentication.users
	for each row
	execute procedure authentication.check_role_exists();

-- TRIGGER to ensure the schemas from user_schema_access are existing schemas

CREATE OR REPLACE FUNCTION 
meta.check_schema_exists() returns trigger as $$
begin
	if not exists(select 1 from meta.schemas as s where s.schema = new.schema) then
		raise foreign_key_violation using message = 
			'invalid schema : ' || new.role;
		return null;
	end if;
	return new;
end
$$ language plpgsql;

drop trigger if exists ensure_schema_exists on meta.user_schema_access; 
create constraint trigger ensure_schema_exists
	after insert or update on meta.user_schema_access
	for each row
	execute procedure meta.check_schema_exists();

-- TRIGGER to keep the passwords encrypted with pgcrypto
create extension if not exists pgcrypto;

create or replace function
authentication.encrypt_password() returns trigger as $$
begin
	if tg_op = 'INSERT' or new.password <> old.password or old.password IS NULL then
		new.password = crypt(new.password, gen_salt('bf'));
	end if;
	return new;
end
$$ language plpgsql;

drop trigger if exists encrypt_password on authentication.users;
create trigger encrypt_password
	before insert or update on authentication.users
	for each row
	execute procedure authentication.encrypt_password();

-- FUNCTION that returns the database role for a user if email and passwords match
create or replace function
authentication.user_role(email text, password text) returns name
	language plpgsql
	as $$
begin
	return (
		select role from authentication.users
		where users.email = user_role.email
			and users.password = crypt(user_role.password, users.password)
	);
end;
$$;

-- ROLES

DROP ROLE IF EXISTS administrator;
DROP ROLE IF EXISTS configurator;
DROP ROLE IF EXISTS "user";

create role "user" noinherit;

-- Granting all on application schemas and tables to user role
DO
$$
DECLARE
   schema_name text;
   table_record record;
BEGIN
   FOR schema_name IN (
       SELECT "schema" 
       FROM meta.schemas
       WHERE "schema" LIKE 'app%'
   )
   LOOP
      EXECUTE format('GRANT ALL ON SCHEMA %I TO "user";', schema_name);
	   FOR table_record IN (
		   SELECT "table" 
		   FROM meta.tables 
		   WHERE meta.tables.schema = schema_name  -- replace with your schema name
	   )
	   LOOP
		  EXECUTE format('GRANT ALL ON TABLE %I.%I TO "user";', schema_name, table_record.table);
	   END LOOP;
   END LOOP;
END
$$ LANGUAGE plpgsql;

GRANT USAGE ON SCHEMA meta TO "user";
GRANT SELECT ON TABLE meta.appconfig_properties to "user";
GRANT SELECT ON TABLE meta.appconfig_values to "user";
GRANT SELECT ON TABLE meta.scripts to "user";
GRANT SELECT ON TABLE meta.schemas to "user";
GRANT SELECT ON TABLE meta.tables to "user";
GRANT SELECT ON TABLE meta.columns to "user";
GRANT SELECT ON TABLE meta.constraints to "user";
GRANT SELECT ON TABLE meta.user_schema_access to "user";


create role configurator;
grant "user" to configurator;

GRANT ALL ON SCHEMA meta TO configurator;
GRANT ALL ON TABLE meta.appconfig_properties to configurator;
GRANT ALL ON TABLE meta.appconfig_values to configurator;
GRANT ALL ON TABLE meta.scripts to configurator;
GRANT ALL ON TABLE meta.schemas to configurator;
GRANT ALL ON TABLE meta.tables to configurator;
GRANT ALL ON TABLE meta.columns to configurator;
GRANT ALL ON TABLE meta.constraints to configurator;
GRANT ALL ON TABLE meta.user_schema_access to configurator;


create role administrator; 
grant configurator to administrator;
-- ADD user management-related capabilities HERE

grant "user" to authenticator;
grant configurator to authenticator;
grant administrator to authenticator;
grant web_anon to authenticator;

-- JWT TOKENS


-- Generating JWT token using pgjwt
create extension if not exists pgjwt;

create TYPE authentication.jwt_token AS (
	token text
);

-- Function to test the generation of jwt tokens
create or replace function meta.jwt_test() RETURNS authentication.jwt_token AS $$
	select sign(
		row_to_json(r), current_setting('custom.jwt_secret')
	) as token
	from (
		select
		'test_role'::text as role, -- sets the role
		extract(epoch from now())::integer + 300 as exp -- sets the expiration of the token in 5 min
	)r;
$$ language sql security definer;

-- FUNCTION login, in the meta schema to be accessible to any user
drop type if exists authentication.jwt_token cascade;
create type authentication.jwt_token as (
	token text
);

create or replace function 
meta.login(email text, password text) returns authentication.jwt_token as $$
declare 
	_role name;
	result authentication.jwt_token;
begin
	-- check email & password
	select authentication.user_role(email, password) into _role;
	if _role is null then
		raise invalid_password using message = 'invalid email or password';
	end if;
	
	-- signs the jwt token
	select sign(
		row_to_json(r), current_setting('custom.jwt_secret')
	) as token
	from (
		select _role as role, login.email as email,
		extract(epoch from now())::integer + 60*60 as exp 
	) as r
	into result;
	
	return result;
end;
$$  language plpgsql security definer;

grant execute on function meta.login(text, text) to web_anon;

-- FUNCTION CREATE USER, for administrators to create the users in the database before they can sign up 
create or replace function 
meta.create_user(email text, role name) 
returns SETOF integer as $$
begin
	INSERT INTO authentication.users(email, role, is_active) VALUES
	(email, role, true);
	RETURN;
end;
$$ language plpgsql security definer;
REVOKE EXECUTE ON FUNCTION meta.create_user(TEXT, NAME) FROM public;
grant execute on function meta.create_user(text, name) to administrator;

-- FUNCTION for users to SIGNUP given an administrator previously created a user in the database for them
create or replace function meta.signup(email text, password text, first_name text, last_name text)
returns setof integer as $$
begin
-- 	Verify if the user has been created by an administrator prior
	if NOT EXISTS (SELECT users.email FROM authentication.users WHERE users.email = signup.email ) then
		raise exception using message = format('User %L was not found. Please ensure an administrator has created a corresponding user in the system before trying to sign up.', signup.email);
	else
-- 		Verify if the user has a password (i.e. if it already signed up)
		if EXISTS (SELECT users.email FROM authentication.users WHERE users.email = signup.email and users.password IS NOT NULL ) then
			raise exception using message = format('User %L has already been signed up.', signup.email);
			UPDATE authentication.users
			SET password = signup.password, first_name = signup.first_name, last_name = signup.last_name
			WHERE users.email = signup.email;
		end if;
	
	end if;
	RETURN;
end
$$ language plpgsql security definer;

grant execute on function meta.signup to web_anon;

-- TO REMOVE AT SOME POINT - Creates a test administrator account for dev purposes
insert into authentication.users(email, first_name, last_name, password, is_active, role)
values ('admin@test.com', 'test', 'admin', 'admin123', true, 'administrator'),
('config@test.com', 'test', 'admin', 'config123', true, 'configurator'),
('user@test.com', 'test', 'admin', 'user123', true, 'user')
ON CONFLICT (email) DO NOTHING; -- If you change anything here after they've been created once in the database, it won't have any effect. You need to remove them first from the database.

NOTIFY pgrst, 'reload schema';

