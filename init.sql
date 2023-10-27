-- TODO: Remove this file when we incorporate refresh_database.sh into the compose file

-- VIEWS
-- Creating the custom schema holding the views
CREATE SCHEMA IF NOT EXISTS meta ;

-- Creating the application schema, holding the actual application data
CREATE SCHEMA IF NOT EXISTS application ;

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
	id serial PRIMARY KEY,
	name VARCHAR(255) UNIQUE NOT NULL,
	description TEXT,
	value_type VARCHAR(50) NOT NULL,
	default_value VARCHAR(100) NOT NULL
);
-- Creating the application config values table
CREATE TABLE IF NOT EXISTS meta.appconfig_values (
	property_id INT NOT NULL,
	id serial PRIMARY KEY,
	value VARCHAR(100) NOT NULL,
	"table" VARCHAR(255),
	"column" VARCHAR(255),
	FOREIGN KEY (property_id) 
	REFERENCES meta.appconfig_properties(id)
	ON DELETE CASCADE 
	ON UPDATE CASCADE
);

-- Creating role web_anon
CREATE ROLE web_anon nologin;

GRANT USAGE ON SCHEMA application TO web_anon;
GRANT USAGE ON SCHEMA meta TO web_anon;
GRANT SELECT ON meta.schemas TO web_anon;
GRANT SELECT ON meta.tables TO web_anon;
GRANT SELECT ON meta.columns TO web_anon;