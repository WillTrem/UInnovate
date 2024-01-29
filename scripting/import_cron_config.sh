#!/bin/bash
source ../.env

# Define the input JSON file
input_file="cron_configurations.json"

DB_CONTAINER="db"
DB_USER=$POSTGRES_USER
DB_PASS=$POSTGRES_PASSWORD
DB_NAME=$POSTGRES_DB_NAME

# Read the JSON file content
json_data=$(<"$input_file")

docker exec -i $DB_CONTAINER psql -tA -U "$DB_USER" -d "$DB_NAME" -c "SELECT cron.import_cronconfig_from_json('$json_data')"

echo "Cron configurations have been imported from $input_file"