# Restoring the application data
pg_restore -U ${POSTGRES_USER} -d uinnovate_test_db /dumps/uinnovate-test-db-dump.backup -n application -c --if-exists --no-owner --no-privileges 