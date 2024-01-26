-- Grants administrator privileges to the web_anon role
GRANT administrator to web_anon;

NOTIFY pgrst,
'reload schema';