#!/bin/bash

POSTGREST_ENDPOINT="http://localhost:3000"
FUNCTION_ENDPOINT="$POSTGREST_ENDPOINT/rpc/import_appconfig_from_json"

# File from which to take new configs
NEW_CONFIG=``

mandatory_flag=false

while getopts "i:" opt; do
  case $opt in
    i)
      NEW_CONFIG=`cat D:/SOEN490/UInnovate/database/$OPTARG/appconfig_values.json`
      mandatory_flag=true
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

# Make call to RPC
curl -s "$FUNCTION_ENDPOINT" \
 -X POST \
 --header 'Content-Profile: meta' \
 --header 'Content-Type: application/json' \
 --data-raw "$NEW_CONFIG"
echo "Import completed. The configuration is saved in the database"

$SHELL

