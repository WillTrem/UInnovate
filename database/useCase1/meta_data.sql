-- Insert the basic config properties into the appconfig_properties table
INSERT INTO meta.appconfig_properties (name, description, value_type, default_value)
VALUES
    ('table_view', 'Default layout shown when selecting a table from the object menu.', 'string', 'list'),
    ('visible', 'Visibility state of a table/column.', 'boolean', 'true'),
    ('editable', 'Makes a column editable', 'boolean', 'false'),
    ('display_column_as_currency', 'Displays a column as currency type.', 'boolean', 'false'),
    ('column_display_type', 'How to display a column', 'string', 'text'),
    ('metadata_view', 'Default view when showing the metadata information of a table/column', 'boolean', 'false' );
    -- ADD ANY NEW CONFIG PROPERTIES HERE

-- Insert the default column display typess for each application column
INSERT INTO meta.appconfig_values (property, value, "table", "column")
SELECT
    CFP.name, default_value, C.table, C.column
FROM meta.columns as C, meta.appconfig_properties as CFP
WHERE schema = 'app_rentals' AND CFP.name != 'table_view';


-- Insert the default column display typess for each application table
INSERT INTO meta.appconfig_values (property, value, "table")
SELECT
    CFP.name, default_value, T.table
FROM meta.tables as T, meta.appconfig_properties as CFP
WHERE schema = 'app_rentals' AND CFP.name = 'table_view'
OR CFP.name = 'visible' OR CFP.name = 'metadata_view';

-- Insert a default script for the scripts table
INSERT INTO meta.scripts (name, description, content, table_name)
VALUES
    ('default_script', 'Simple script to print something on the console.', 'console.log("Hello World");', 'scripts');

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

GRANT ALL ON FUNCTION meta.export_appconfig_to_json() TO web_anon;
GRANT ALL ON FUNCTION meta.import_appconfig_from_json(json) TO web_anon;

NOTIFY pgrst, 'reload schema'