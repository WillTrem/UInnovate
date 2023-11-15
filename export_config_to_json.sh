####TODO: invoke the procedure in meta.sql through a PostgREST API call

#!/bin/bash

POSTGREST_ENDPOINT="http://localhost:3000"
FUNCTION_ENDPOINT="$POSTGREST_ENDPOINT/rpc/export_appconfig_to_json"
# specifgy accept profile header tn endpoint

# output file
OUTPUT_FILE="appconfig_values.json"

# make the API request and write the response to a file
curl -s "$FUNCTION_ENDPOINT" \
 -X POST -H "Content-Profile: meta" -H "Content-Type: application/json" > "$OUTPUT_FILE"
echo "Export completed. The configuration is saved in $OUTPUT_FILE"
