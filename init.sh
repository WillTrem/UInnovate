pg_restore -U ${POSTGRES_USER} -d uinnovate_test_db /dumps/uinnovate-test-db-dump.backup -c --if-exists --no-owner --no-privileges 