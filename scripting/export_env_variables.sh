#!/bin/bash
source ../.env

# Define the output JSON file
output_file="db_env_variables.json"

DB_CONTAINER="db"
DB_USER=$POSTGRES_USER
DB_PASS=$POSTGRES_PASSWORD
DB_NAME=$POSTGRES_DB_NAME
docker exec -i $DB_CONTAINER psql -tA -U "$DB_USER" -d "$DB_NAME" -c "SELECT meta.export_env_vars_to_json();" > "$output_file"

echo "Cron configurations have been exported to $output_file"