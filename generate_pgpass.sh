#!/bin/sh
# This script uses the POSTGRES_USER, POSTGRES_PASSWORD, and POSTGRES_DB_NAME
# environment variables defined in your .env file that Docker Compose uses and generates 
# the pgpass file content + sets the right permissions for it

# Generate the pgpass file content using the .env variables
echo "db:5432:db:${POSTGRES_USER}:${PGADMIN_DEFAULT_PASSWORD}" > /tmp/.pgpass

chmod 0600 /tmp/pgpass
