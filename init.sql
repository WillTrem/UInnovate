-- Creating role web_anon
CREATE ROLE web_anon nologin;

-- GRANT USAGE ON SCHEMA application TO web_anon;
-- GRANT USAGE ON SCHEMA meta TO web_anon;
-- GRANT SELECT ON meta.schemas TO web_anon;
-- GRANT SELECT ON meta.tables TO web_anon;
-- GRANT SELECT ON meta.columns TO web_anon;

--dynamically set schema names
create or replace function postgrest.pre_config()
returns void as $$
  select
    set_config('pgrst.db_schemas', string_agg(nspname, ','), true)
  from pg_namespace
  where nspname like 'app_%';
$$ language sql;