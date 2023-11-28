####TODO: invoke the procedure in meta.sql through a PostgREST API call

#!/bin/bash

POSTGREST_ENDPOINT="http://localhost:3000"
FUNCTION_ENDPOINT="$POSTGREST_ENDPOINT/rpc/import_appconfig_from_json"
# specifgy accept profile header tn endpoint

# output file
INPUT_FILE=`cat appconfig_values.json`

echo "$INPUT_FILE"
# make the API request and write the response to a file
curl -s "$FUNCTION_ENDPOINT" \
 -X POST \
 --header 'Content-Profile: meta' \
 --header 'Content-Type: application/json' \
 --data-raw "$INPUT_FILE"
echo "Export completed. The configuration is saved"

$SHELL

