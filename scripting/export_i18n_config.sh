#!/bin/bash
source ../.env

# Define the output JSON file
output_file="i18n_configurations.json"

# Define the endpoint and the function to call
POSTGREST_ENDPOINT="http://localhost:3000"
FUNCTION_ENDPOINT="$POSTGREST_ENDPOINT/rpc/export_i18n_to_json"

# Call the function directly
curl -s "$FUNCTION_ENDPOINT" \
    -X POST -H "Content-Profile: meta" -H "Content-Type: application/json" > "$output_file"

echo "i18n configurations have been exported to $output_file"