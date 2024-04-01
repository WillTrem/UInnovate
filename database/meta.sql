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

DROP VIEW IF EXISTS meta.columns;
-- Creating the columns view
CREATE OR REPLACE VIEW meta.columns ("schema", "table", "column", "references_table", "references_by", "is_editable","is_serial", "referenced_table", "referenced_by" ) AS 
(
  
   (
    SELECT DISTINCT ON (c.table_schema, c.table_name, c.column_name)
    c.table_schema, 
    c.table_name, 
    c.column_name,  
    STRING_AGG(DISTINCT rc.referenced_table::text, ', '),
    STRING_AGG(DISTINCT rc.referenced_column::text, ', ') AS references_by, 
    CASE WHEN c.column_name = pk.table_pkey THEN false ELSE true END AS is_editable,
    ( SELECT pg_catalog.pg_get_serial_sequence(c.table_schema || '.' || c.table_name, c.column_name) IS NOT NULL) AS is_serial,
    STRING_AGG(DISTINCT ref.referee_table::text, ', '), 
    STRING_AGG(DISTINCT ref.referee_column::text, ', ') AS referenced_by
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
ON c.column_name = rc.referee_column AND c.table_name = rc.referee_table
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
) AS ref
ON c.table_name = ref.referenced_table AND c.column_name = ref.referenced_column
WHERE c.table_name IN 
(
    SELECT "table" FROM meta.tables
)
GROUP BY c.table_schema, c.table_name, c.column_name, pk.table_pkey
ORDER BY c.table_schema, c.table_name, c.column_name
)
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

-- Creating the user logs table

CREATE TABLE IF NOT EXISTS meta.user_logs (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    action VARCHAR(255) NOT NULL,
    details TEXT,
    schema_name VARCHAR(255) NOT NULL,
    table_name VARCHAR(255) NOT NULL
);

-- Creating the audit trails table

CREATE TABLE IF NOT EXISTS meta.audit_trails (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    action VARCHAR(255) NOT NULL,
    details TEXT,
    schema_name VARCHAR(255) NOT NULL,
    table_name VARCHAR(255) NOT NULL
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

-- Creating the fucntion mapping table

CREATE TABLE IF NOT EXISTS meta.function_map (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    schema TEXT NOT NULL DEFAULT 'meta',
    procedure TEXT NOT NULL,
    table_name TEXT DEFAULT 'function_map',
    btn_name TEXT DEFAULT 'Do a magic trick!',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Creating the envronment variables table
CREATE TABLE IF NOT EXISTS meta.env_vars (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
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
    key_code VARCHAR(255) UNIQUE NOT NULL,
    is_default BOOLEAN DEFAULT false  -- Add the is_default column here
);
-- Creating the values table
CREATE TABLE IF NOT EXISTS meta.i18n_values (
    id SERIAL PRIMARY KEY,
    language_id INT REFERENCES meta.i18n_languages(id),
    key_id INT REFERENCES meta.i18n_keys(id),
    value TEXT NOT NULL,
    CONSTRAINT unique_translation UNIQUE (language_id, key_id)
);

-- Creating the translation view (combines the languages, keys, and values tables)
CREATE OR REPLACE VIEW meta.i18n_translations AS
SELECT
    k.id AS translation_id,
    l.language_code,
    k.key_code,
    COALESCE(v.value, '') AS value,
    k.is_default  -- Adding the is_default attribute
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
    '' AS value,
    k.is_default  -- Adding the is_default attribute
FROM
    meta.i18n_keys k
WHERE
    NOT EXISTS (
        SELECT 1
        FROM meta.i18n_languages l
        JOIN meta.i18n_values v ON l.id = v.language_id AND k.id = v.key_id
    );

-- Creating the environment variables table
CREATE TABLE IF NOT EXISTS meta.env_vars (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Creating the  view type table
CREATE TABLE IF NOT EXISTS meta.view_type(
  id SERIAL PRIMARY KEY,
  name VARCHAR(255)
);
-- Creating the additional view setting table
CREATE TABLE IF NOT EXISTS meta.additional_view_settings (
  id SERIAL PRIMARY KEY,
  schemaName VARCHAR(255),
  tableName VARCHAR(255),
  viewName VARCHAR(255),
  viewType INT,
  FOREIGN KEY (viewType) REFERENCES meta.view_type(id)
);

-- Creating the custom view template table
CREATE TABLE IF NOT EXISTS meta.custom_view_templates(
  id SERIAL PRIMARY KEY,
  settingId INT,
  template TEXT,
  FOREIGN KEY (settingId) REFERENCES meta.additional_view_settings(id)
);

-- Inserting default view types
INSERT INTO meta.view_type(name) VALUES
('calendar'),
('timeline'),
('treeview'),
('custom');

-- CUSTOM VIEW INSERT
CREATE OR REPLACE FUNCTION meta.insert_custom_view(
    p_schema_name VARCHAR(255),
    p_table_name VARCHAR(255),
    p_view_name VARCHAR(255),
    p_view_type_id INT,
    p_template TEXT
) RETURNS INT AS $$
DECLARE
    v_setting_id INT;
BEGIN
    -- If the view type doesn't exist, you might want to handle this case appropriately.
    IF NOT EXISTS (SELECT 1 FROM meta.view_type WHERE id = p_view_type_id) THEN
        RAISE EXCEPTION 'View type not found: %', p_view_type_id;
    END IF;

    -- Insert into additional_view_settings table
    INSERT INTO meta.additional_view_settings (schemaName, tableName, viewName, viewType)
    VALUES (p_schema_name, p_table_name, p_view_name, p_view_type_id)
    RETURNING id INTO v_setting_id;

    -- Insert into custom_view_templates table
    INSERT INTO meta.custom_view_templates (settingId, template)
    VALUES (v_setting_id, p_template);

    -- Return the setting ID for reference
    RETURN v_setting_id;
END;
$$ LANGUAGE plpgsql;


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

-- EXPORT FUNCTIONALITY FOR i18n Configurations such as languages, keys, and values
CREATE OR REPLACE FUNCTION meta.export_i18n_to_json()
RETURNS json
LANGUAGE plpgsql
AS $BODY$
DECLARE
    i18n_languages_json json;
    i18n_keys_json json;
    i18n_values_json json;
BEGIN
    SELECT COALESCE(json_agg(row_to_json(lang)), '[]') INTO i18n_languages_json
    FROM (
        SELECT id, language_code, language_name
        FROM meta.i18n_languages
    ) lang;

    SELECT COALESCE(json_agg(row_to_json(keys)), '[]') INTO i18n_keys_json
    FROM (
        SELECT id, key_code, is_default
        FROM meta.i18n_keys
    ) keys;

    SELECT COALESCE(json_agg(row_to_json(values)), '[]') INTO i18n_values_json
    FROM (
        SELECT id, language_id, key_id, value
        FROM meta.i18n_values
    ) values;

    RETURN json_build_object(
        'languages', i18n_languages_json,
        'keys', i18n_keys_json,
        'values', i18n_values_json
    );
END;
$BODY$;

-- EXPORT FUNCTIONALITY FOR scripts
CREATE OR REPLACE FUNCTION meta.export_scripts_to_json()
RETURNS json
LANGUAGE plpgsql
AS $BODY$
DECLARE
    scripts_json json;
BEGIN
    SELECT COALESCE(json_agg(row_to_json(s)), '[]') INTO scripts_json
    FROM (
        SELECT id, name, description, content, table_name, btn_name, created_at
        FROM meta.scripts
    ) s;

    RETURN scripts_json;
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

-- IMPORT FUNCTIONALITY FOR i18n configurations such as languages, keys, and values
CREATE OR REPLACE FUNCTION meta.import_i18n_from_json(json)
RETURNS void
LANGUAGE plpgsql
AS $BODY$
DECLARE
    i18n_data json;
    i18n_languages_data json;
    i18n_keys_data json;
    i18n_values_data json;
BEGIN
    -- Extract data for i18n_languages and insert into meta.i18n_languages
    i18n_data = $1;
    i18n_languages_data = i18n_data->'languages';
    i18n_keys_data = i18n_data->'keys';
    i18n_values_data = i18n_data->'values';
    DELETE FROM meta.i18n_languages;
    INSERT INTO meta.i18n_languages (id, language_code, language_name)
    SELECT (lang_row->>'id')::int, lang_row->>'language_code', lang_row->>'language_name'
    FROM json_array_elements(i18n_languages_data) AS lang_row;
    DELETE FROM meta.i18n_keys;
    INSERT INTO meta.i18n_keys (id, key_code, is_default)
    SELECT (key_row->>'id')::int, key_row->>'key_code', (key_row->>'is_default')::boolean
    FROM json_array_elements(i18n_keys_data) AS key_row;
    DELETE FROM meta.i18n_values;
    INSERT INTO meta.i18n_values (id, language_id, key_id, value)
    SELECT (val_row->>'id')::int, (val_row->>'language_id')::int, (val_row->>'key_id')::int, val_row->>'value'
    FROM json_array_elements(i18n_values_data) AS val_row;
END;
$BODY$;

-- Import for scripts

CREATE OR REPLACE FUNCTION meta.import_scripts_from_json(json)
RETURNS void
LANGUAGE plpgsql
AS $BODY$
DECLARE
    scripts_data json; 
    scripts_row json;
BEGIN
    scripts_data := $1; -- Assign the passed JSON to scripts_data

    -- Clearing the existing scripts and replace with new ones
    DELETE FROM meta.scripts;

    -- Iterate through each element in the JSON array
    FOR scripts_row IN SELECT * FROM json_array_elements(scripts_data)
    LOOP
        -- Insert each script into the scripts table
        INSERT INTO meta.scripts (id, name, description, content, table_name, btn_name, created_at)
        VALUES ((scripts_row->>'id')::int, 
                scripts_row->>'name', 
                scripts_row->>'description', 
                scripts_row->>'content', 
                scripts_row->>'table_name', 
                scripts_row->>'btn_name', 
                (scripts_row->>'created_at')::timestamp );
    END LOOP;
END;
$BODY$;
-- Env Variables --

-- Export for environment variables
CREATE OR REPLACE FUNCTION meta.export_env_vars_to_json()
RETURNS json
LANGUAGE plpgsql
AS $BODY$
DECLARE
    env_vars_json json;
BEGIN
    SELECT COALESCE(json_agg(row_to_json(c)), '[]') INTO env_vars_json
    FROM (
        SELECT id, name, value
        FROM meta.env_vars
    ) c;

    RETURN env_vars_json;
END;
$BODY$;

-- Import for environment variables
CREATE OR REPLACE FUNCTION meta.import_env_vars_from_json(json)
RETURNS void
LANGUAGE plpgsql
AS $BODY$
DECLARE
    env_vars_data json; 
    env_vars_row json;   
BEGIN
    env_vars_data := $1; -- Assign the passed JSON to env_vars_data

    -- Assuming you want to clear the existing cron jobs and replace with new ones
    DELETE FROM meta.env_vars;

    -- Iterate through each element in the JSON array
    FOR env_vars_row IN SELECT * FROM json_array_elements(env_vars_data)
    LOOP
        -- Insert each cron job into the cron_jobs table
        INSERT INTO meta.env_vars (id, name, value)
        VALUES ((env_vars_row->>'id')::int, 
                env_vars_row->>'name', 
                env_vars_row->>'value' );
    END LOOP;
END;
$BODY$;

-- Fetch Functions Source Code

CREATE OR REPLACE FUNCTION meta.get_function_source_code_and_arg_count(p_schema_name text, p_function_name text)
RETURNS TABLE(arg_count integer, source_code text) AS $$
BEGIN
    RETURN QUERY
    SELECT pronargs::integer, prosrc
    FROM pg_proc
    INNER JOIN pg_namespace ns ON pg_proc.pronamespace = ns.oid
    WHERE ns.nspname = p_schema_name
    AND pg_proc.proname = p_function_name;
END;
$$ LANGUAGE plpgsql STABLE;
-- GRANT ROLE PERMISSIONS --

-- Schemas
GRANT ALL ON FUNCTION meta.insert_custom_view() TO configurator;
GRANT ALL ON FUNCTION meta.export_appconfig_to_json() TO configurator;
GRANT ALL ON FUNCTION meta.import_appconfig_from_json(json) TO configurator;
GRANT ALL ON FUNCTION meta.export_i18n_to_json() TO configurator;
GRANT ALL ON FUNCTION meta.import_i18n_from_json(json) TO configurator;
GRANT ALL ON FUNCTION meta.export_env_vars_to_json() TO configurator;
GRANT ALL ON FUNCTION meta.import_env_vars_from_json(json) TO configurator;
GRANT ALL ON FUNCTION meta.export_scripts_to_json() TO configurator;
GRANT ALL ON FUNCTION meta.import_scripts_from_json(json) TO configurator;
GRANT USAGE ON SCHEMA information_schema TO "user";
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA information_schema TO "user";
GRANT USAGE ON SCHEMA meta.user_logs TO "user";
GRANT USAGE ON SCHEMA meta.audit_trails TO "user";
GRANT SELECT ON information_schema.referential_constraints TO "user";
GRANT SELECT ON information_schema.constraint_column_usage TO "user";

GRANT USAGE ON SCHEMA meta TO "user";
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA meta TO "user";

-- Tables
GRANT SELECT ON meta.appconfig_properties TO "user";
GRANT SELECT ON meta.appconfig_values TO "user";
GRANT SELECT ON meta.scripts TO "user";
GRANT SELECT ON meta.function_map TO "user";
GRANT SELECT ON meta.user_logs TO "user";
GRANT SELECT ON meta.audit_trails TO "user";
GRANT SELECT ON meta.i18n_languages TO "user";
GRANT SELECT ON meta.i18n_keys TO "user";
GRANT SELECT ON meta.i18n_values TO "user";
GRANT SELECT ON meta.view_type TO "user";
GRANT SELECT ON meta.additional_view_settings TO "user";
GRANT SELECT ON meta.custom_view_templates TO "user";
GRANT ALL ON meta.appconfig_properties TO configurator;
GRANT ALL ON meta.appconfig_values TO configurator;
GRANT ALL ON meta.scripts TO configurator;
GRANT ALL ON meta.function_map TO configurator;  
GRANT ALL ON meta.i18n_languages TO configurator;
GRANT ALL ON meta.user_logs TO "user";
GRANT ALL ON meta.audit_trails TO "user";
GRANT ALL ON meta.i18n_keys TO configurator;
GRANT ALL ON meta.i18n_values TO configurator;
GRANT ALL ON meta.view_type TO configurator;
GRANT ALL ON meta.additional_view_settings TO configurator;
GRANT ALL ON meta.custom_view_templates TO configurator;

-- Grant INSERT permission on the user_logs table to the user role
GRANT INSERT ON meta.user_logs TO "user";
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