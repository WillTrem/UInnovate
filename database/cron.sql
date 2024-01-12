CREATE EXTENSION IF NOT EXISTS pg_cron;
GRANT USAGE ON SCHEMA cron TO web_anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA cron TO web_anon;
GRANT SELECT, UPDATE, INSERT ON cron.job TO web_anon;
GRANT SELECT, UPDATE, INSERT ON cron.job_run_details TO web_anon;
ALTER POLICY cron_job_run_details_policy ON cron.job_run_details 
USING (username = current_user OR current_user = 'web_anon');
ALTER POLICY cron_job_policy ON cron.job 
USING (username = current_user OR current_user = 'web_anon');

-- EXPORT CRON CONFIGURATIONS FUNCTION
CREATE OR REPLACE FUNCTION cron.export_cronconfig_to_json()
RETURNS json
LANGUAGE plpgsql
AS $BODY$
DECLARE
    cron_json json;
BEGIN
    SELECT COALESCE(json_agg(row_to_json(c)), '[]') INTO cron_json
    FROM (
        SELECT jobid, schedule, command, nodename, nodeport, database, username, active, jobname
        FROM cron.job
    ) c;

    RETURN cron_json;
END;
$BODY$;

-- IMPORT FUNCTIONALITY FOR CRON JOBS
CREATE OR REPLACE FUNCTION cron.import_cronconfig_from_json(json)
RETURNS void
LANGUAGE plpgsql
AS $BODY$
DECLARE
    cron_data json;  -- Variable to hold the JSON array of cron jobs
    cron_row json;   -- Variable to hold each cron job row data
BEGIN
    cron_data := $1; -- Assign the passed JSON to cron_data

    -- Assuming you want to clear the existing cron jobs and replace with new ones
    DELETE FROM cron.job;

    -- Iterate through each element in the JSON array
    FOR cron_row IN SELECT * FROM json_array_elements(cron_data)
    LOOP
        -- Insert each cron job into the cron_jobs table
        INSERT INTO cron.job (jobid, schedule, command, nodename, nodeport, database, username, active, jobname)
        VALUES ((cron_row->>'jobid')::int, 
                cron_row->>'schedule', 
                cron_row->>'command', 
                cron_row->>'nodename', 
                (cron_row->>'nodeport')::int, 
                cron_row->>'database', 
                cron_row->>'username', 
                (cron_row->>'active')::boolean, 
                cron_row->>'jobname');
    END LOOP;

CREATE OR REPLACE FUNCTION cron.schedule_job_by_name(stored_procedure varchar, cron_schedule varchar)
RETURNS varchar
LANGUAGE plpgsql
AS $BODY$
BEGIN
    EXECUTE format('SELECT cron.schedule(%L, %L, %L)', stored_procedure, cron_schedule, 'CALL ' || quote_ident(stored_procedure) || '()');
    RETURN format('Successfully scheduled job %s', stored_procedure);
END;
$BODY$;


CREATE OR REPLACE FUNCTION cron.unschedule_job_by_name(stored_procedure varchar)
RETURNS varchar
LANGUAGE plpgsql
AS $BODY$
BEGIN
    EXECUTE format('SELECT cron.unschedule(%L)', stored_procedure);
    RETURN format('Successfully unscheduled job %s', stored_procedure);
END;
$BODY$;
