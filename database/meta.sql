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
	property TEXT,
	value TEXT NOT NULL,
	"table" TEXT,
	"column" TEXT,
    PRIMARY KEY (property, "table", "column"),
	FOREIGN KEY (property) 
	REFERENCES meta.appconfig_properties(name)
	ON DELETE CASCADE 
	ON UPDATE CASCADE
);

-- Copying the properties from the csv file into the proper table
COPY meta.appconfig_properties("name", description, value_type, default_value)
FROM '/dataFiles/appconfig_properties.csv'
DELIMITER ','
CSV HEADER;

-- USAGE 
GRANT USAGE ON SCHEMA meta TO web_anon;

GRANT SELECT ON meta.schemas TO web_anon;
GRANT SELECT ON meta.tables TO web_anon;
GRANT SELECT ON meta.columns TO web_anon;
GRANT SELECT ON meta.appconfig_properties TO web_anon;
GRANT SELECT ON meta.appconfig_values TO web_anon;

