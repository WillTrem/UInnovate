#!/bin/bash

# Define the PostgREST endpoint
POSTGREST_ENDPOINT="http://localhost:3000"
FUNCTION_ENDPOINT="$POSTGREST_ENDPOINT/rpc/export_appconfig_to_json"

# Make the API request and store the response
response=$(curl -s -X POST "$FUNCTION_ENDPOINT" -H "Content-Profile: meta" -H "Content-Type: application/json")

# Define a basic check - for example, check if the response contains expected keys
if [[ $response == *"appconfig_values"* ]] && [[ $response == *"appconfig_properties"* ]]; then
    echo "Test Passed: The response contains both 'appconfig_values' and 'appconfig_properties'"
else
    echo "Test Failed: The response does not contain the expected keys"
fi
