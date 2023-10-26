# Creating the application_config schema and tables
psql -U ${POSTGRES_USER} -d ${POSTGRES_DB} -a -f /SQL/create_app_config.sql
# Restoring the application data
pg_restore -U ${POSTGRES_USER} -d ${POSTGRES_DB} /dumps/uinnovate-test-db-dump.backup -n application -c --if-exists --no-owner --no-privileges 