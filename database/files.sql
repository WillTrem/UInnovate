-- VIEWS
-- Creating the custom schema holding the views
DROP SCHEMA IF EXISTS app_filemanager CASCADE ;
CREATE SCHEMA IF NOT EXISTS app_filemanager ;

    
CREATE TABLE IF NOT EXISTS app_filemanager.app_filestorage (
	id serial PRIMARY KEY,
	file_name TEXT NOT NULL,
	extension TEXT NOT NULL,
	blob bytea NOT NULL
);
-- Creating the application config values table

GRANT ALL ON SCHEMA app_filemanager TO web_anon;
GRANT ALL ON app_filemanager.app_filestorage TO web_anon;
GRANT USAGE, SELECT ON SEQUENCE app_filemanager.app_filestorage_id_seq TO web_anon;
