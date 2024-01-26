-- VIEWS
-- Creating the custom schema holding the views
DROP SCHEMA IF EXISTS app_filemanager CASCADE ;
CREATE SCHEMA IF NOT EXISTS app_filemanager ;

CREATE SEQUENCE file_seq START WITH 1;

CREATE TABLE IF NOT EXISTS app_filemanager.app_filestorage (
	id TEXT NOT NULL DEFAULT 'file_'||nextval('file_seq'::regclass) PRIMARY KEY,
	file_name TEXT NOT NULL,
	extension TEXT NOT NULL,
	blob bytea NOT NULL
);
-- Creating the application config values table

GRANT ALL ON SEQUENCE file_seq TO web_anon;
GRANT ALL ON SCHEMA app_filemanager TO web_anon;
GRANT ALL ON app_filemanager.app_filestorage TO web_anon;
GRANT USAGE, SELECT ON SEQUENCE app_filemanager.app_filestorage_id_seq TO web_anon;
