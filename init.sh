# Restoring the application data
pg_restore -U ${POSTGRES_USER} -d ${POSTGRES_DB} /dumps/uinnovate-test-db-dump.backup -n application -c --if-exists --no-owner --no-privileges 