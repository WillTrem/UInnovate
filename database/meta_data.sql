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
WHERE schema = 'application' AND CFP.name != 'table_view';


-- Insert the default column display typess for each application table
INSERT INTO meta.appconfig_values (property, value, "table")
SELECT
    CFP.name, default_value, T.table
FROM meta.tables as T, meta.appconfig_properties as CFP
WHERE schema = 'application' AND CFP.name = 'table_view'
OR CFP.name = 'visible' OR CFP.name = 'metadata_view';