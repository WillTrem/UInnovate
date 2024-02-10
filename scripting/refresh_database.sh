#!/bin/bash
cd "$(dirname "$(readlink -f "$0")")"
# Load environment variables from .env file
source ../.env
if [[ -f ../UInnovateApp/.env.development ]]; then
    echo "Loading environment variables from ../UInnovateApp/.env.development" | tee -a $LOG_FILE
    source ../UInnovateApp/.env.development
fi


USECASE_FOLDER="/useCase1"
RUNTEST="false"
# Parse command-line arguments
while [[ $# -gt 0 ]]; do
    case "$1" in
        -f|--folder)
            USECASE_FOLDER="$2"
            shift 2
            echo "Using use case folder: $USECASE_FOLDER"
            ;;
        -rt|--runTest)
            RUNTEST="$2"
            shift 2
            ;;
        *)
            echo "defaulting to option: $USECASE_FOLDER usecase folder"
            break
            ;;
    esac
done

# Set database credentials and file paths
INIT_SQL="../init.sql"
DB_USER=$POSTGRES_USER
DB_PASS=$POSTGRES_PASSWORD
DB_NAME=$POSTGRES_DB_NAME
DB_HOST="db"
META_FILE=".././database/meta.sql"
SCHEMA_FILE=".././database$USECASE_FOLDER/structure.sql"
DATA_FILE=".././database$USECASE_FOLDER/sampledata.sql"
PROCEDURES_FILE=".././database$USECASE_FOLDER/procedures.sql"
TEST_FILE=".././database$USECASE_FOLDER/unittest.sql"
META_DATA_FILE=".././database/meta_data.sql"
LOG_FILE=".././database/refresh_log.txt"
FILE_STORAGE=".././database/files.sql"
CRON_FILE=".././database/cron.sql"
APPCONFIG_PROPERTIES_FILE=".././dataFiles/appconfig_properties.csv"
AUTH_FILE=".././database/auth.sql"
ROLES_FILE=".././database/roles.sql"
LOGIN_BYPASS_FILE=".././database/login_bypass.sql"

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
for SQL_FILE in $INIT_SQL $ROLES_FILE $META_FILE $FILE_STORAGE $SCHEMA_FILE $DATA_FILE $PROCEDURES_FILE $META_DATA_FILE $CRON_FILE $AUTH_FILE; do
    echo "Executing $SQL_FILE..." | tee -a $LOG_FILE
    docker exec -i db psql -U $DB_USER -d $DB_NAME -a -f - < $SQL_FILE 2>&1 | tee -a $LOG_FILE
done

if [[ "$(echo $VITE_LOGIN_BYPASS | tr '[A-Z]' '[a-z]')" = "true" ]]; then
    echo "LOGIN_BYPASS set to true, executing $LOGIN_BYPASS_FILE..." | tee -a $LOG_FILE
    docker exec -i db psql -U $DB_USER -d $DB_NAME -a -f - < $LOGIN_BYPASS_FILE 2>&1 | tee -a $LOG_FILE
fi

# Log completion time
echo "Database refresh completed at $(date)" | tee -a $LOG_FILE

if [ "$RUNTEST" == true ]; then
    echo "Executing $TEST_FILE..." | tee -a $LOG_FILE
    docker exec -i db psql -U $DB_USER -d $DB_NAME -a -f - < $TEST_FILE 2>&1 | tee -a $LOG_FILE
fi
