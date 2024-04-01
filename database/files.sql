DROP SCHEMA IF EXISTS filemanager CASCADE ;
CREATE SCHEMA IF NOT EXISTS filemanager ;

DROP SEQUENCE IF EXISTS file_seq CASCADE;
CREATE SEQUENCE file_seq START WITH 1;


CREATE TABLE IF NOT EXISTS filemanager.filestorage (
	id TEXT NOT NULL DEFAULT 'file_'||nextval('file_seq'::regclass) PRIMARY KEY,
	filename TEXT NOT NULL,
	extension TEXT NOT NULL,
	filesize BIGINT NOT NULL,
	blob TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS filemanager.filegroup (
	id SERIAL PRIMARY KEY,
	fileid TEXT [] NOT NULL --Reference maybe the file storage (at ur own risk)
);

CREATE VIEW filemanager.filestorage_view AS (
	SELECT filemanager.filestorage.id, filename, extension, filesize, filegroup.id AS groupid
	FROM filemanager.filestorage LEFT JOIN filemanager.filegroup ON filemanager.filestorage.id = ANY(filemanager.filegroup.fileid) 
);

CREATE VIEW filemanager.filegroup_view AS (
	SELECT filemanager.filegroup.id, SUM(filesize), COUNT(fileid)
	FROM filemanager.filegroup LEFT JOIN filemanager.filestorage ON filemanager.filestorage.id = ANY(filemanager.filegroup.fileid)
	GROUP BY filemanager.filegroup.id
);

CREATE OR REPLACE FUNCTION filemanager.add_file_to_group(in_filegroupid INT, in_filename TEXT, in_extension TEXT, in_blob TEXT)
RETURNS TABLE(id TEXT, filename TEXT, extension TEXT, filesize BIGINT, groupid INT)
LANGUAGE plpgsql
AS $$
DECLARE
	group_id INT;
	row_id TEXT;
BEGIN
	INSERT INTO filemanager.filestorage (filename, extension, filesize, blob)
	VALUES (in_filename, in_extension, LENGTH(in_blob), in_blob)
	RETURNING filemanager.filestorage.id INTO row_id;

	IF in_filegroupid IS NULL THEN
		INSERT INTO filemanager.filegroup (fileid)
		VALUES (ARRAY[row_id])
		RETURNING filemanager.filegroup.id INTO group_id;
	ELSE
		UPDATE filemanager.filegroup
		SET fileid = fileid || row_id
		WHERE filemanager.filegroup.id = in_filegroupid
		RETURNING filemanager.filegroup.id INTO group_id;
	END IF;
	RETURN QUERY SELECT * FROM filemanager.filestorage_view WHERE filemanager.filestorage_view.id = row_id AND filemanager.filestorage_view.groupid = group_id;
END;
$$;

CREATE OR REPLACE FUNCTION filemanager.remove_file_from_group(in_filegroupid INT, in_fileid TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
	group_removed BOOLEAN;
BEGIN
	group_removed := FALSE;
	UPDATE filemanager.filegroup
	SET fileid = array_remove(fileid, in_fileid)
	WHERE filemanager.filegroup.id = in_filegroupid;

	DELETE FROM filemanager.filestorage
	WHERE filemanager.filestorage.id = in_fileid;

	IF (SELECT cardinality(fileid) FROM filemanager.filegroup WHERE filemanager.filegroup.id = in_filegroupid) = 0 THEN
		DELETE FROM filemanager.filegroup
		WHERE filemanager.filegroup.id = in_filegroupid;

		group_removed := TRUE;
	END IF;

	RETURN group_removed;
END;
$$;


GRANT ALL ON SEQUENCE file_seq TO "user";
GRANT ALL ON SCHEMA filemanager TO "user";
GRANT ALL ON filemanager.filestorage TO "user";
GRANT ALL ON filemanager.filegroup TO "user";
GRANT ALL ON filemanager.filestorage_view TO "user";
GRANT ALL ON filemanager.filegroup_view TO "user";
GRANT USAGE, SELECT ON SEQUENCE file_seq, filemanager.filegroup_id_seq TO "user";
GRANT ALL ON FUNCTION filemanager.add_file_to_group(INT, TEXT, TEXT, TEXT) TO "user";
GRANT ALL ON FUNCTION filemanager.remove_file_from_group(INT, TEXT) TO "user";

NOTIFY pgrst, 'reload schema'

