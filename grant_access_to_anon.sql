-- Grants access to the applicaton tables to the web_anon role for PostgREST usage
GRANT SELECT ON application.tools TO web_anon;
GRANT SELECT ON application.customers TO web_anon;
GRANT SELECT ON application.rentals TO web_anon;

-- Note that this is a temporary solution, and will be replace by proper authentication later on