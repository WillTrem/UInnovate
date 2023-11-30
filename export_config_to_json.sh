#!/bin/bash

POSTGREST_ENDPOINT="http://localhost:3000"
FUNCTION_ENDPOINT="$POSTGREST_ENDPOINT/rpc/export_appconfig_to_json"
# specifgy accept profile header tn endpoint

# output file
OUTPUT_FILE="appconfig_values.json"

mandatory_flag=false

while getopts "o:" opt; do
  case $opt in
    o)
      OUTPUT_FILE="./database/$OPTARG/appconfig_values.json"
      mandatory_flag=true
      mkdir -p ./database/$OPTARG
      touch ./database/$OPTARG/appconfig_values.json
      ;;
    :)
      echo "Option -$OPTARG requires an argument." >&2
      exit 1
      ;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      exit 1
      ;;
  esac
done

if ! $mandatory_flag; then
  echo "Error: -i is a mandatory option."
  exit 1
fi

# make the API request and write the response to a file
curl -s "$FUNCTION_ENDPOINT" \
 -X POST -H "Content-Profile: meta" -H "Content-Type: application/json" > "$OUTPUT_FILE"
echo "Export completed. The configuration is saved in $OUTPUT_FILE"

echo "Closing terminal in 5 seconds.."

sleep 5