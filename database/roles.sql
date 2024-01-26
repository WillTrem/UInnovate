-- Defines the database roles excepting the administrator and web_anon roles
CREATE role "user" noinherit;

CREATE role configurator;
GRANT "user" TO configurator;

CREATE role administrator;
GRANT configurator TO administrator;

GRANT "user" TO authenticator;
GRANT configurator TO authenticator;
GRANT administrator TO authenticator;
GRANT web_anon TO authenticator;

-- Revoking the administrator privileges from the web_anon role in case it was granted with login bypass 
REVOKE administrator FROM web_anon;



NOTIFY pgrst, 'reload schema';