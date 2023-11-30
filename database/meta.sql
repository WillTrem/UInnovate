-- VIEWS
-- Creating the custom schema holding the views
DROP SCHEMA IF EXISTS meta CASCADE ;
CREATE SCHEMA IF NOT EXISTS meta ;

-- Creating the schema view
CREATE OR REPLACE VIEW meta.schemas ("schema") AS 
(
    SELECT nspname
    FROM pg_catalog.pg_namespace
    WHERE nspname NOT LIKE 'pg_%' -- Filtering out postgres default schemas
    AND nspname NOT LIKE 'information_schema' -- ^
) ;
    
-- Creating the table view
CREATE OR REPLACE VIEW meta.tables ( "schema", "table" ) AS
(
    SELECT table_schema, table_name
    FROM information_schema.tables
    WHERE table_schema IN (SELECT * FROM meta.schemas)
    AND table_type = 'BASE TABLE'
  ORDER BY table_schema
) ;

-- Creating the columns view
CREATE OR REPLACE VIEW meta.columns ("schema", "table", "column", "references_table") AS 
(
    SELECT c.table_schema, c.table_name, c.column_name,  rc.table_name
    FROM information_schema.columns AS c
    LEFT JOIN 
    (
        SELECT * FROM information_schema.referential_constraints
        INNER JOIN  information_schema.constraint_column_usage AS ccu
        USING (constraint_name)
    ) AS rc
    ON c.column_name = rc.column_name AND rc.constraint_name LIKE c.table_name || '%'
    WHERE c.table_name IN 
    (
        SELECT "table" FROM meta.tables
    )
    ORDER BY c.table_schema, c.table_name
) ;

-- TABLES
-- Creating the application config properties table
CREATE TABLE IF NOT EXISTS meta.appconfig_properties (
	name TEXT PRIMARY KEY,
	description TEXT,
	value_type TEXT NOT NULL,
	default_value TEXT NOT NULL
);
-- Creating the application config values table
CREATE TABLE IF NOT EXISTS meta.appconfig_values (
	id SERIAL PRIMARY KEY,
	"table" TEXT,
	"column" TEXT,
    property TEXT,
	value TEXT NOT NULL,
	FOREIGN KEY (property) 
	REFERENCES meta.appconfig_properties(name)
	ON DELETE CASCADE 
	ON UPDATE CASCADE,
    UNIQUE NULLS NOT DISTINCT (property, "table", "column")
);

-- USAGE 
GRANT USAGE ON SCHEMA meta TO web_anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA meta TO web_anon;

GRANT SELECT, UPDATE, INSERT ON meta.schemas TO web_anon;
GRANT SELECT, UPDATE, INSERT ON meta.tables TO web_anon;
GRANT SELECT, UPDATE, INSERT ON meta.columns TO web_anon;
GRANT SELECT, UPDATE, INSERT ON meta.appconfig_properties TO web_anon;
GRANT SELECT, UPDATE, INSERT ON meta.appconfig_values TO web_anon;
GRANT SELECT, UPDATE, INSERT ON TABLE information_schema.constraint_column_usage TO web_anon;
GRANT SELECT, UPDATE, INSERT ON TABLE information_schema.columns TO web_anon;
GRANT SELECT, UPDATE, INSERT ON TABLE information_schema.referential_constraints TO web_anon;
GRANT SELECT, UPDATE, INSERT ON TABLE information_schema.constraint_column_usage TO web_anon;
GRANT SELECT, UPDATE, INSERT ON TABLE meta.tables TO web_anon;
GRANT SELECT, UPDATE, INSERT ON TABLE meta.columns TO web_anon;

GRANT DELETE ON meta.appconfig_values TO web_anon;
GRANT EXECUTE ON FUNCTION meta.export_appconfig_to_json() TO web_anon;
GRANT SELECT ON meta.columns TO web_anon;
GRANT INSERT, UPDATE, DELETE ON meta.columns TO web_anon;

-- EXPORT FUNCTIONALITY
CREATE OR REPLACE FUNCTION meta.export_appconfig_to_json()
RETURNS json  -- Specify the return type here
LANGUAGE plpgsql
AS $BODY$
DECLARE
    result json;
BEGIN
    SELECT json_build_object(
        'appconfig_values', COALESCE(json_agg(row_to_json(av)), '[]'),
        'appconfig_properties', COALESCE(json_agg(row_to_json(ap)), '[]')
    )
    INTO result
    FROM (
        SELECT id, "table", "column", property, value
        FROM meta.appconfig_values
    ) av
    FULL OUTER JOIN LATERAL (
        SELECT name, description, value_type, default_value
        FROM meta.appconfig_properties
    ) ap ON TRUE;

    RETURN result;
END;
$BODY$;

GRANT EXPORT ON meta.export_appconfig_to_json TO web_anon;
GRANT SELECT ON TABLE meta.appconfig_values TO web_anon;
GRANT SELECT ON TABLE meta.appconfig_properties TO web_anon;
GRANT ALL ON meta.appconfig_properties TO web_anon;
GRANT ALL ON meta.appconfig_values TO web_anon;
GRANT ALL ON meta.columns TO web_anon;
