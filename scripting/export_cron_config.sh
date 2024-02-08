#!/bin/bash
source ../.env

# Define the output JSON file
output_file="cron_configurations.json"

POSTGREST_ENDPOINT="http://localhost:3000"
FUNCTION_ENDPOINT="$POSTGREST_ENDPOINT/rpc/export_cronconfig_to_json"

# Call the function directly
curl -s "$FUNCTION_ENDPOINT" \
    -X POST -H "Content-Profile: cron" -H "Content-Type: application/json" \
    -d @"$input_file"

echo "Cron configurations have been exported to $output_file"
read -p "Press enter to continue"
