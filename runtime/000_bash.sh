#!/usr/bin/env bash

# use same db as the one from env
dbname="uinnovate_test_db"

cd .. 
# include custom config from main config
conf=/data/postgres/postgresql.conf
found=$(grep "cron.database_name = 'uinnovate_test_db'" $conf)
echo "shared_preload_libraries = 'pg_cron'" >> $conf
echo "cron.database_name = 'uinnovate_test_db'" >> $conf
