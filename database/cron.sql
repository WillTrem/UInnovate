CREATE EXTENSION IF NOT EXISTS pg_cron;
GRANT USAGE ON SCHEMA cron TO web_anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA cron TO web_anon;
GRANT SELECT, UPDATE, INSERT ON cron.job TO web_anon;
GRANT SELECT, UPDATE, INSERT ON cron.job_run_details TO web_anon;
ALTER POLICY cron_job_run_details_policy ON cron.job_run_details 
USING (username = current_user OR current_user = 'web_anon');
ALTER POLICY cron_job_policy ON cron.job 
USING (username = current_user OR current_user = 'web_anon');