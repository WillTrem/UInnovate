#!/bin/bash

# Database connection details
DB_USER=$POSTGRES_USER
DB_PASS=$POSTGRES_PASSWORD
DB_NAME=$POSTGRES_DB_NAME
DB_HOST="db"
# Import cron schedules
echo "Importing cron schedules..."
docker exec -i db psql -U $DB_USER -d $DB_NAME -c "TRUNCATE cron.cron_job; COPY cron.cron_job FROM STDIN;" < cron_schedules.txt

echo "Cron schedules imported successfully"