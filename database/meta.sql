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

ALTER TABLE meta.appconfig_properties OWNER TO web_anon;
ALTER TABLE meta.appconfig_values OWNER TO web_anon;

-- EXPORT FUNCTIONALITY
CREATE OR REPLACE FUNCTION meta.export_appconfig_to_json()
RETURNS json  -- Specify the return type here
LANGUAGE plpgsql
AS $BODY$
DECLARE
    result json;
    av_json json;
    ap_json json;
BEGIN
    SELECT COALESCE(json_agg(row_to_json(av)), '[]')
    INTO av_json
    FROM (
        SELECT id, "table", "column", property, value
        FROM meta.appconfig_values
    ) av;

    SELECT COALESCE(json_agg(row_to_json(ap)), '[]')
    INTO ap_json
    FROM (
        SELECT name, description, value_type, default_value
        FROM meta.appconfig_properties
    ) ap;

    -- Combine av_json and ap_json into a single JSON object
    result = json_build_object(
        'appconfig_values', av_json,
        'appconfig_properties', ap_json
    );

    RETURN result;
END;
$BODY$;

-- IMPORT FUNCTIONALITY
CREATE OR REPLACE FUNCTION meta.import_appconfig_from_json(json)
RETURNS void
LANGUAGE plpgsql
AS $BODY$
DECLARE
    av_data json;
    ap_data json;
    import_data json;
BEGIN
    -- Extract data for appconfig_values and insert into meta.appconfig_values
    DELETE FROM meta.appconfig_values;
    DELETE FROM meta.appconfig_properties;
    import_data = $1;
    av_data = import_data->'appconfig_values';
    INSERT INTO meta.appconfig_values (id, "table", "column", property, value)
    SELECT (av_row->>'id')::int, av_row->>'table', av_row->>'column', av_row->>'property', av_row->>'value'
    FROM json_array_elements(av_data) AS av_row;

    -- Extract data for appconfig_properties and insert into meta.appconfig_properties
    ap_data = import_data->'appconfig_properties';
    INSERT INTO meta.appconfig_properties (name, description, value_type, default_value)
    SELECT ap_row->>'name', ap_row->>'description', ap_row->>'value_type', ap_row->>'default_value'
    FROM json_array_elements(ap_data) AS ap_row;

END;
$BODY$;

GRANT ALL ON FUNCTION meta.export_appconfig_to_json() TO web_anon;
GRANT ALL ON FUNCTION meta.import_appconfig_from_json(json) TO web_anon;
GRANT SELECT ON TABLE meta.appconfig_values TO web_anon;
GRANT SELECT ON TABLE meta.appconfig_properties TO web_anon;
GRANT ALL ON meta.appconfig_properties TO web_anon;
GRANT ALL ON meta.appconfig_values TO web_anon;

NOTIFY pgrst, 'reload schema'
