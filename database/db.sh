#!/bin/bash
cd "$(dirname "$(readlink -f "$0")")"

r_flag=false
while [ $# -gt 0 ]; do
  case $1 in
    -r)
      r_flag=true
      /bin/bash ../refresh_database.sh
      ;;
    -c)
      if [ "$r_flag" != true ]; then
        echo "Error: -c must be used after -r."
        exit 1
      fi
      /bin/bash ./import_config_from_json.sh -i $2
      ;;
    -n | --newProject)
      /bin/bash ./refresh_database.sh
      /bin/bash ./export_config_to_json.sh -o $2
      ;;
    -i | --importConfigs)
      /bin/bash ./import_config_from_json.sh -i $2
      ;;
    -e | --exportConfigs)
      /bin/bash ./export_config_to_json.sh -o $2
      ;;
    \?)
      echo "Invalid option: -$2" >&2
      exit 1
      ;;
  esac
  shift
done

echo "Closing terminal in 5 seconds.."

sleep 5
