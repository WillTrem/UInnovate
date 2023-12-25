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
CREATE OR REPLACE VIEW meta.columns ("schema", "table", "column", "references_table") AS 
(
    SELECT c.table_schema, c.table_name, c.column_name,  rc.referenced_table
    FROM information_schema.columns AS c
    LEFT JOIN 
    (
        SELECT cl.relname as referee_table,  att.attname as referee_column, cl2.relname as referenced_table, att2.attname as referenced_column FROM pg_catalog.pg_constraint as co
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

-- USAGE 
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
