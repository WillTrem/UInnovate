#!/bin/bash

# Database connection details
DB_USER=$POSTGRES_USER
DB_PASS=$POSTGRES_PASSWORD
DB_NAME=$POSTGRES_DB_NAME
DB_HOST="db"
# Export cron schedules
echo "Exporting cron schedules..."
docker exec -i db psql -U $DB_USER -d $DB_NAME -c "COPY cron.cron_job TO STDOUT;" > cron_schedules.txt

echo "Cron schedules exported to cron_schedules.txt"