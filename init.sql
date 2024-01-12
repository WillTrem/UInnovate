-- https://postgrest.org/en/stable/references/api/schemas.html
-- create a dedicated schema, hidden from the API
DROP SCHEMA IF EXISTS postgrest CASCADE;
create schema postgrest;
-- grant usage on this schema to the web_anon
grant usage on schema postgrest to web_anon;
grant usage on schema postgrest to authenticator;

-- the function can configure postgREST by using set_config
create or replace function postgrest.pre_config()
--dynamically set schema names

returns void as $$
  select
    set_config('pgrst.db_schemas', string_agg(nspname, ','), true)
  from pg_namespace
  where nspname = 'meta' or nspname like 'app_%';
$$ language sql;