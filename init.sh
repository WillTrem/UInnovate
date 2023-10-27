# Imports the properties from the csv file
psql -U ${POSTGRES_USER} -d ${POSTGRES_DB} -a -f /database/import_app_config_properties.sql

# Restoring the application data
pg_restore -U ${POSTGRES_USER} -d ${POSTGRES_DB} /dumps/uinnovate-test-db-dump.backup -n application -c --if-exists --no-owner --no-privileges 