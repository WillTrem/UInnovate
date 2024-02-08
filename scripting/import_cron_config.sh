#!/bin/bash
source ../.env

# Define the input JSON file
input_file="cron_configurations.json"

# Define the endpoint and the function to call
POSTGREST_ENDPOINT="http://localhost:3000"
FUNCTION_ENDPOINT="$POSTGREST_ENDPOINT/rpc/import_cronconfig_from_json"

# Call the function directly
curl -s "$FUNCTION_ENDPOINT" \
    -X POST -H "Content-Profile: cron" -H "Content-Type: application/json" \
    -d @"$input_file"

echo "Cron configurations have been imported from $input_file"
read -p "Press enter to continue"
```