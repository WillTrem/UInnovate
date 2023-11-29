mandatory_flag=false
r_flag=false
c_flag=false
export_config_flag=false
import_config_flag=false
new_project_flag=false
while getopts "rc:-:" opt; do
  case $opt in
    r)
      r_flag=true
      /bin/bash ./refresh_database.sh
      ;;
    c)
      if [ "$r_flag" != true ]; then
        echo "Error: -c must be used after -r."
        exit 1
      fi
      /bin/bash ./import_config_from_json.sh -i $OPTARG
      ;;
    -)
      case "${OPTARG}" in
        newProject)
          /bin/bash ./refresh_database.sh
          /bin/bash ./export_config_to_json.sh -o $OPTARG
          ;;
        exportConfigs)
          /bin/bash ./export_config_to_json.sh -o $OPTARG
          ;;
        importConfigs)
          /bin/bash ./import_config_from_json.sh -o $OPTARG
          ;;
        *)
          echo "Invalid option: --${OPTARG}" >&2
          exit 1
          ;;
        esac
        ;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      exit 1
      ;;
  esac
done

$SHELL
