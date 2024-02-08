#!/bin/bash
source ../.env

POSTGREST_ENDPOINT="http://localhost:3000"
FUNCTION_ENDPOINT="$POSTGREST_ENDPOINT/rpc/export_env_vars_to_json"

# Define the output JSON file
output_file="db_env_variables.json"

curl -s "$FUNCTION_ENDPOINT" \
    -X POST -H "Content-Profile: meta" -H "Content-Type: application/json" > "$output_file"

echo "Environment Variables have been exported to $output_file"