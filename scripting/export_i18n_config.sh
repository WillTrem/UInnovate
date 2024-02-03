#!/bin/bash
source ../.env

# Define the output JSON file
output_file="i18n_configurations.json"

DB_CONTAINER_NAME="db"
DB_USER=$POSTGRES_USER
DB_PASS=$POSTGRES_PASSWORD
DB_NAME=$POSTGRES_DB_NAME

# 1st way not working
# psql -h $DB_CONTAINER_NAME -U "$DB_USER" -d "$DB_NAME" -c "SELECT meta.export_i18n_to_json();" -t -o "$output_file"

# 2nd way not working
# docker exec -i $DB_CONTAINER psql -tA -U "$DB_USER" -d "$DB_NAME" -c "SELECT meta.export_i18n_to_json();" > "$output_file"

# 3rd way not working 
# psql -U $DB_USER -d $DB_NAME -t -c "SELECT meta.export_i18n_to_json();" > $output_file

echo "i18n configurations have been exported to $output_file"


