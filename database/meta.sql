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

-- Creating the constraints view
CREATE OR REPLACE VIEW meta.constraints ("schema_name", "table_name", "column_name", "constraint_name") AS 
(
    SELECT ccu.table_schema, ccu.table_name, ccu.column_name, rc.constraint_name
        FROM information_schema.referential_constraints AS rc
        INNER JOIN  information_schema.constraint_column_usage AS ccu
        USING (constraint_name)
);


-- Creating the columns view
CREATE OR REPLACE VIEW meta.columns ("schema", "table", "column", "references_table", "is_editable") AS 
(
     
     SELECT 
        c.table_schema, 
        c.table_name, 
        c.column_name,  
        rc.referenced_table,
        CASE WHEN c.column_name = pk.table_pkey THEN false ELSE true END AS is_editable
    FROM information_schema.columns AS c
    LEFT JOIN 
    (
        SELECT 
            cl.relname as referee_table,  
            att.attname as referee_column, 
            cl2.relname as referenced_table, 
            att2.attname as referenced_column 
        FROM pg_catalog.pg_constraint as co
        LEFT JOIN pg_catalog.pg_class as cl
        ON co.conrelid = cl.oid
        LEFT JOIN pg_catalog.pg_class as cl2
        ON co.confrelid = cl2.oid
        LEFT JOIN pg_catalog.pg_attribute as att
        ON cl.oid = att.attrelid AND ARRAY[att.attnum] = co.conkey
        LEFT JOIN pg_catalog.pg_attribute as att2
        ON cl2.oid = att2.attrelid AND ARRAY[att2.attnum] = co.confkey
        WHERE contype = 'f'
    ) AS rc
    ON c.column_name = rc.referee_column AND c.table_name != rc.referenced_table
    -- New LEFT JOIN for primary key references
    LEFT JOIN 
    (
        SELECT 
            cl.relname as table_name,  
            att.attname as table_pkey
        FROM pg_catalog.pg_constraint as co
        LEFT JOIN pg_catalog.pg_class as cl
        ON co.conrelid = cl.oid
        LEFT JOIN pg_catalog.pg_attribute as att
        ON cl.oid = att.attrelid AND ARRAY[att.attnum] = co.conkey
        WHERE contype = 'p'
    ) AS pk
    ON c.table_name = pk.table_name
    
    WHERE c.table_name IN 
    (
        SELECT "table" FROM meta.tables
    )
    ORDER BY c.table_schema, c.table_name
	
	 
) ;

-- Creates a VIEW that shows all the views of the database
CREATE OR REPLACE VIEW meta.views AS (
        SELECT pg_views.schemaname AS "schema",
            pg_views.viewname AS "view"
        FROM pg_catalog.pg_views
        WHERE pg_views.schemaname IN (
                SELECT *
                FROM meta.schemas
            )
    );
GRANT SELECT ON TABLE meta.views TO web_anon;


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
-- Creating the scripts table

CREATE TABLE IF NOT EXISTS meta.scripts (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    content TEXT NOT NULL,
    table_name TEXT DEFAULT 'scripts',
    btn_name TEXT DEFAULT 'Do a magic trick!',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Creating the languages table
CREATE TABLE IF NOT EXISTS meta.i18n_languages (
    id SERIAL PRIMARY KEY,
    language_code VARCHAR(2) UNIQUE NOT NULL,
    language_name VARCHAR(100) NOT NULL
);

-- Creating the keys table
CREATE TABLE IF NOT EXISTS meta.i18n_keys (
    id SERIAL PRIMARY KEY,
    key_code VARCHAR(255) UNIQUE NOT NULL
);

-- Creating the values table
CREATE TABLE IF NOT EXISTS meta.i18n_values (
    id SERIAL PRIMARY KEY,
    language_id INT REFERENCES meta.i18n_languages(id),
    key_id INT REFERENCES meta.i18n_keys(id),
    value TEXT NOT NULL,
    CONSTRAINT unique_translation UNIQUE (language_id, key_id)
);

-- Creating the translation view
CREATE OR REPLACE VIEW meta.i18n_translation AS
SELECT
    v.id AS translation_id,
    l.language_code,
    k.key_code,
    v.value
FROM
    meta.i18n_values v
JOIN
    meta.i18n_languages l ON v.language_id = l.id
JOIN
    meta.i18n_keys k ON v.key_id = k.id;

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
    import_data = $1;
    av_data = import_data->'appconfig_values';
    ap_data = import_data->'appconfig_properties';
    DELETE FROM meta.appconfig_properties;
    INSERT INTO meta.appconfig_properties (name, description, value_type, default_value)
    SELECT ap_row->>'name', ap_row->>'description', ap_row->>'value_type', ap_row->>'default_value'
    FROM json_array_elements(ap_data) AS ap_row;
    DELETE FROM meta.appconfig_values;
    INSERT INTO meta.appconfig_values (id, "table", "column", property, value)
    SELECT (av_row->>'id')::int, av_row->>'table', av_row->>'column', av_row->>'property', av_row->>'value'
    FROM json_array_elements(av_data) AS av_row;

    -- Extract data for appconfig_properties and insert into meta.appconfig_properties

END;
$BODY$;

-- USAGE 
GRANT ALL ON FUNCTION meta.export_appconfig_to_json() TO web_anon;
GRANT ALL ON FUNCTION meta.import_appconfig_from_json(json) TO web_anon;
GRANT USAGE ON SCHEMA information_schema TO web_anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA information_schema TO web_anon;
GRANT SELECT ON information_schema.referential_constraints TO web_anon;
GRANT SELECT ON information_schema.constraint_column_usage TO web_anon;

GRANT USAGE ON SCHEMA meta TO web_anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA meta TO web_anon;
GRANT SELECT, UPDATE, INSERT ON meta.schemas TO web_anon;
GRANT SELECT, UPDATE, INSERT ON meta.tables TO web_anon;
GRANT SELECT, UPDATE, INSERT ON meta.columns TO web_anon;
GRANT SELECT, UPDATE, INSERT ON meta.constraints TO web_anon;
GRANT SELECT, UPDATE, INSERT ON meta.appconfig_properties TO web_anon;
GRANT SELECT, UPDATE, INSERT ON meta.appconfig_values TO web_anon;
GRANT SELECT, UPDATE, INSERT ON meta.scripts TO web_anon;
GRANT ALL ON meta.appconfig_properties TO web_anon;
GRANT ALL ON meta.appconfig_values TO web_anon;
GRANT ALL on meta.scripts TO web_anon;

NOTIFY pgrst, 'reload schema'
