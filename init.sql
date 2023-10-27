-- Creating role web_anon
CREATE ROLE web_anon nologin;

-- GRANT USAGE ON SCHEMA application TO web_anon;
-- GRANT USAGE ON SCHEMA meta TO web_anon;
-- GRANT SELECT ON meta.schemas TO web_anon;
-- GRANT SELECT ON meta.tables TO web_anon;
-- GRANT SELECT ON meta.columns TO web_anon;