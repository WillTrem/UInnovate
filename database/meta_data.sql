-- Insert the basic config properties into the appconfig_properties table
INSERT INTO meta.appconfig_properties (name, description, value_type, default_value)
VALUES
    ('table_view', 'Default layout shown when selecting a table from the object menu.', 'string', 'list'),
    ('visible', 'Visibility state of a table/column.', 'boolean', 'true'),
    ('editable', 'Makes a column editable', 'boolean', 'false'),
    ('display_column_as_currency', 'Displays a column as currency type.', 'boolean', 'false'),
    ('column_display_type', 'How to display a column', 'string', 'text'),
    ('metadata_view', 'Default view when showing the metadata information of a table/column', 'boolean', 'false' ),
    ('details_view', 'Visibility state of the details view for a table', 'boolean', 'true'),
    ('stand_alone_details_view', 'Visibility state of the stand alone details view for a table', 'boolean', 'false'),
    ('lookup_tables', 'List of tables that are used as lookup tables', 'string', 'null'),
    ('lookup_counter', 'Counter for the amount of tables displayed for lookup tables', 'string', '0');
    -- ADD ANY NEW CONFIG PROPERTIES HERE

-- Insert the default column display typess for each  app_service_support column
INSERT INTO meta.appconfig_values (property, value, "table", "column")
SELECT
    CFP.name, default_value, C.table, C.column
FROM meta.columns as C, meta.appconfig_properties as CFP
WHERE schema = ' app_service_support' AND (CFP.name != 'table_view' AND CFP.name != 'details_view' AND CFP.name != 'stand_alone_details_view' AND CFP.name != 'lookup_tables' AND CFP.name != 'lookup_counter');


-- Insert the default column display typess for each  app_service_support table
INSERT INTO meta.appconfig_values (property, value, "table")
SELECT
    CFP.name, default_value, T.table
FROM meta.tables as T, meta.appconfig_properties as CFP
WHERE schema = ' app_service_support' AND CFP.name = 'table_view'
OR CFP.name = 'visible' OR CFP.name = 'metadata_view' OR CFP.name = 'details_view' OR CFP.name = 'stand_alone_details_view' OR CFP.name = 'lookup_tables' OR CFP.name = 'lookup_counter';

-- Insert a default script for the scripts table
INSERT INTO meta.scripts (name, description, content, table_name)
VALUES
    ('default_script', 'Simple script to print something on the console.', 'console.log("Hello World");', 'scripts');

-- Inser the new column to visually flag the default values
ALTER TABLE meta.i18n_keys
ADD COLUMN is_default BOOLEAN DEFAULT false;

-- Insert the tables names, columns names, schema tables into the i18n_keys table
-- Insert unique column names into i18n_keys
INSERT INTO meta.i18n_keys (key_code, is_default)
SELECT DISTINCT column, true
FROM meta.columns;

-- Insert unique table names into i18n_keys
INSERT INTO meta.i18n_keys (key_code, is_default)
SELECT DISTINCT "table", true
FROM meta.tables;

-- Insert unique schema names into i18n_keys
INSERT INTO meta.i18n_keys (key_code, is_default)
SELECT DISTINCT "schema", true
FROM meta.schemas;






NOTIFY pgrst, 'reload schema'