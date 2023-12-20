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
authentication.user_schema_access (
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
authentication.check_schema_exists() returns trigger as $$
begin
	if not exists(select 1 from meta.schemas as s where s.schema = new.schema) then
		raise foreign_key_violation using message = 
			'invalid schema : ' || new.role;
		return null;
	end if;
	return new;
end
$$ language plpgsql;

drop trigger if exists ensure_schema_exists on authentication.user_schema_access; 
create constraint trigger ensure_schema_exists
	after insert or update on authentication.user_schema_access
	for each row
	execute procedure authentication.check_schema_exists();

-- TRIGGER to keep the passwords encrypted with pgcrypto
create extension if not exists pgcrypto;

create or replace function
authentication.encrypt_password() returns trigger as $$
begin
	if tg_op = 'INSERT' or new.password <> old.password then
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
DROP ROLE IF EXISTS authenticator;

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


create role configurator;
grant "user" to configurator;

GRANT ALL ON SCHEMA meta TO "user";
GRANT ALL ON TABLE meta.appconfig_properties to "user";
GRANT ALL ON TABLE meta.appconfig_values to "user";
GRANT ALL ON TABLE meta.scripts to "user";
GRANT ALL ON TABLE meta.schemas to "user";
GRANT ALL ON TABLE meta.tables to "user";
GRANT ALL ON TABLE meta.columns to "user";
GRANT ALL ON TABLE meta.constraints to "user";

create role administrator; 
grant configurator to administrator;
-- ADD user management-related capabilities HERE

create role authenticator LOGIN NOINHERIT NOCREATEDB NOCREATEROLE NOSUPERUSER;
grant "user" to authenticator;
grant configurator to authenticator;
grant administrator to authenticator;
grant web_anon to authenticator;

-- JWT TOKENS

-- Generating a random 32 characters long database secret for jwt 
DO
$$
DECLARE
   secret text;
BEGIN
   SELECT encode(gen_random_bytes(16), 'hex') INTO secret;
   EXECUTE format('ALTER DATABASE uinnovate_test_db SET "app.jwt_secret" TO %L', secret);
END
$$;

-- Generating JWT token using pgjwt
create extension if not exists pgjwt;

create TYPE authentication.jwt_token AS (
	token text
);

-- Function to test the generation of jwt tokens
create or replace function meta.jwt_test() RETURNS authentication.jwt_token AS $$
	select sign(
		row_to_json(r), current_setting('app.jwt_secret')
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
		row_to_json(r), current_setting('app.jwt_secret')
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


-- TO REMOVE AT SOME POINT - Creates a test administrator account for dev purposes
insert into authentication.users(email, first_name, last_name, password, is_active, role)
values ('test@test.com', 'test', 'admin', 'test123', true, 'administrator');