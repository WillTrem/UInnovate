###NOTE: We do not need to connect to the db using psycopg2, we can use PostgREST:
####TODO: invoke the procedure in meta.sql through a PostgREST API call
### make a new GET request to the appropriate endpoint to get the JSON file 

import psycopg2 ##change this to PostgREST instead
import json

# Connect to your PostgreSQL database
conn = psycopg2.connect("dbname=db user=zanaalex password=turtle")
cur = conn.cursor()

# Call the SQL function
cur.execute("SELECT export_appconfig_to_json()")
result = cur.fetchone()[0]

# Write the result to a JSON file
with open('appconfig_values.json', 'w') as json_file:
    json.dump(result, json_file)

# Close the connection
cur.close()
conn.close()
