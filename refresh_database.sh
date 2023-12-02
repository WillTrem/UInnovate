#!/bin/bash
cd "$(dirname "$(readlink -f "$0")")"
# Load environment variables from .env file
source .env

USECASE_FOLDER="/useCase1"
# Parse command-line arguments
while [[ $# -gt 0 ]]; do
    case "$1" in
        -f|--folder)
            USECASE_FOLDER="$2"
            shift 2
            echo "Using use case folder: $USECASE_FOLDER"
            ;;
        *)
            echo "defaulting to option: $USECASE_FOLDER usecase folder"
            break
            ;;
    esac
done

# Set database credentials and file paths
DB_USER=$POSTGRES_USER
DB_PASS=$POSTGRES_PASSWORD
DB_NAME=$POSTGRES_DB_NAME
DB_HOST="db"
META_FILE="./database/meta.sql"
# temporary until we refactor the names of all the databases
if USECASE_FOLDER == "/useCase1"; then
    SCHEMA_FILE="./database$USECASE_FOLDER/structure.sql"
    DATA_FILE="./database$USECASE_FOLDER/sampledata.sql"
else 
    SCHEMA_FILE="./database$USECASE_FOLDER/application.sql"
    DATA_FILE="./database$USECASE_FOLDER/data.sql"
fi
META_DATA_FILE="./database$USECASE_FOLDER/meta_data.sql"
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
for SQL_FILE in $META_FILE $SCHEMA_FILE $DATA_FILE $META_DATA_FILE; do
    echo "Executing $SQL_FILE..." | tee -a $LOG_FILE
    docker exec -i db psql -U $DB_USER -d $DB_NAME -a -f - < $SQL_FILE 2>&1 | tee -a $LOG_FILE
done

# Log completion time
echo "Database refresh completed at $(date)" | tee -a $LOG_FILE
