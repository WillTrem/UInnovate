#!/bin/bash

# Load environment variables from .env file
source .env

# Set database credentials and file paths
DB_USER=$POSTGRES_USER
DB_PASS=$POSTGRES_PASSWORD
DB_NAME=$POSTGRES_DB_NAME
DB_HOST="db"
META_FILE="./database/meta.sql"
SCHEMA_FILE="./database/application.sql"
DATA_FILE="./database/data.sql"
CRON_FILE="./database/cron.sql"
META_DATA_FILE="./database/meta_data.sql"
LOG_FILE="./database/refresh_log.txt"
APPCONFIG_PROPERTIES_FILE="./dataFiles/appconfig_properties.csv"

# method to check existence of files
check_file_existence() {
    if [[ ! -f $1 ]]; then
        echo "File $1 does not exist. Exiting..." | tee -a $LOG_FILE
        exit 1
    fi
}

# check if files exist
check_file_existence $META_FILE
check_file_existence $SCHEMA_FILE
check_file_existence $DATA_FILE

# Log  start time
echo "Database refresh started at $(date)" | tee -a $LOG_FILE

# Recreate meta tables and views, schema (drop and create tables), and data (insert new data)
for SQL_FILE in $META_FILE $SCHEMA_FILE $DATA_FILE $META_DATA_FILE $CRON_FILE; do
    echo "Executing $SQL_FILE..." | tee -a $LOG_FILE
    docker exec -i db psql -U $DB_USER -d $DB_NAME -a -f - < $SQL_FILE 2>&1 | tee -a $LOG_FILE
done

# Log completion time
echo "Database refresh completed at $(date)" | tee -a $LOG_FILE