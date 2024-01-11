CREATE EXTENSION IF NOT EXISTS pg_cron;
GRANT USAGE ON SCHEMA cron TO web_anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA cron TO web_anon;
GRANT SELECT, UPDATE, INSERT ON cron.job TO web_anon;
GRANT SELECT, UPDATE, INSERT ON cron.job_run_details TO web_anon;
ALTER POLICY cron_job_run_details_policy ON cron.job_run_details 
USING (username = current_user OR current_user = 'web_anon');
ALTER POLICY cron_job_policy ON cron.job 
USING (username = current_user OR current_user = 'web_anon');

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
