###NOTE: We do not need to connect to the db using psycopg2, we can use PostgREST:
####TODO: invoke the procedure in meta.sql through a PostgREST API call
### make a new GET request to the appropriate endpoint to get the JSON file 

import requests
import json

# TODO: change this url for the actual PostgREST endpoint
url = "http://localhost:30000/export_appconfig_to_json" ##not the right url yet

response = requests.get(url)
data = response.json()

# Write the result to a JSON file
with open('appconfig_values.json', 'w') as json_file:
    json.dump(data, json_file)
