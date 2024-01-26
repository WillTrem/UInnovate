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
CREATE OR REPLACE VIEW meta.columns ("schema", "table", "column", "references_table", "references_by", "is_editable") AS 
(
   SELECT DISTINCT ON (c.table_schema, c.table_name, c.column_name)
    c.table_schema, 
    c.table_name, 
    c.column_name,  
    rc.referenced_table,
    rc.referenced_column AS references_by, -- Added this line
    CASE WHEN c.column_name = pk.table_pkey THEN false ELSE true END AS is_editable
FROM information_schema.columns AS c
LEFT JOIN 
(
    SELECT DISTINCT ON (cl.relname, att.attname)
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
ORDER BY c.table_schema, c.table_name, c.column_name
);




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
    language_code VARCHAR(10) UNIQUE NOT NULL,
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

-- Creating the translation view (combines the languages, keys and values tables)
CREATE OR REPLACE VIEW meta.i18n_translations AS
SELECT
    k.id AS translation_id,
    l.language_code,
    k.key_code,
    COALESCE(v.value, '') AS value
FROM
    meta.i18n_languages l
CROSS JOIN
    meta.i18n_keys k
LEFT JOIN
    meta.i18n_values v ON l.id = v.language_id AND k.id = v.key_id
UNION
SELECT
    k.id AS translation_id,
    NULL AS language_code,
    k.key_code,
    '' AS value
FROM
    meta.i18n_keys k
WHERE
    NOT EXISTS (
        SELECT 1
        FROM meta.i18n_languages l
        JOIN meta.i18n_values v ON l.id = v.language_id AND k.id = v.key_id
    );

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

-- GRANT ROLE PERMISSIONS --

-- Schemas
GRANT ALL ON FUNCTION meta.export_appconfig_to_json() TO configurator;
GRANT ALL ON FUNCTION meta.import_appconfig_from_json(json) TO configurator;
GRANT USAGE ON SCHEMA information_schema TO "user";
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA information_schema TO "user";
GRANT SELECT ON information_schema.referential_constraints TO "user";
GRANT SELECT ON information_schema.constraint_column_usage TO "user";

GRANT USAGE ON SCHEMA meta TO "user";
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA meta TO "user";

-- Tables
GRANT SELECT ON meta.appconfig_properties TO "user";
GRANT SELECT ON meta.appconfig_values TO "user";
GRANT SELECT ON meta.scripts TO "user";
GRANT SELECT ON meta.i18n_languages TO "user";
GRANT SELECT ON meta.i18n_keys TO "user";
GRANT SELECT ON meta.i18n_values TO "user";
GRANT ALL ON meta.appconfig_properties TO configurator;
GRANT ALL ON meta.appconfig_values TO configurator;
GRANT ALL ON meta.scripts TO configurator;
GRANT ALL ON meta.i18n_languages TO configurator;
GRANT ALL ON meta.i18n_keys TO configurator;
GRANT ALL ON meta.i18n_values TO configurator;

-- Views (Only SELECT necessary)
GRANT SELECT ON meta.schemas TO "user"; 
GRANT SELECT ON meta.tables TO "user";
GRANT SELECT ON meta.columns TO "user";
GRANT SELECT ON meta.constraints TO "user";
GRANT SELECT ON meta.views TO "user";
GRANT SELECT ON meta.i18n_translations TO "user";

-- -- web_anon related (necessary on vmd load)
GRANT USAGE ON SCHEMA meta TO web_anon;
GRANT SELECT ON meta.appconfig_values TO web_anon;
GRANT SELECT ON meta.columns TO web_anon;
GRANT SELECT ON meta.views TO web_anon;

NOTIFY pgrst, 'reload schema'
