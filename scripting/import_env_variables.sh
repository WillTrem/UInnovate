#!/bin/bash
source ../.env

# Define the input JSON file
input_file="db_env_variables.json"

# Define the endpoint and the function to call
POSTGREST_ENDPOINT="http://localhost:3000"
FUNCTION_ENDPOINT="$POSTGREST_ENDPOINT/rpc/import_env_vars_from_json"

# Call the function directly
curl -s "$FUNCTION_ENDPOINT" \
    -X POST -H "Content-Profile: meta" -H "Content-Type: application/json" \
    -d @"$input_file"

echo "Import completed from $input_file. The environment variables have been inserted in the database"