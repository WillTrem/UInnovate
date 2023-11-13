####TODO: invoke the procedure in meta.sql through a PostgREST API call

#!/bin/bash

## make a new PostgREST endpoint for the procedure
###NOTE: the endpoint url is not actually the right one; needs modification (expose the procedure as an API endpoint)
ENDPOINT="http://localhost:3000/export_appconfig_to_json"

# output file
OUTPUT_FILE="appconfig_values.json"

# make the API request and write the response to a file
curl -s "$ENDPOINT" > "$OUTPUT_FILE"

echo "Configuration exported to $OUTPUT_FILE"

##TODO: Run chmod command to make this .sh script executable
