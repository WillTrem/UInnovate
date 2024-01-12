#!/bin/bash

# Creates the authenticator and anonymous roles so that postgrest can be used
psql -U ${POSTGRES_USER} -d ${POSTGRES_DB}  <<-END
	CREATE ROLE web_anon nologin;
	DO \$\$
    BEGIN
        EXECUTE format('CREATE ROLE authenticator LOGIN PASSWORD %L NOINHERIT NOCREATEDB NOCREATEROLE NOSUPERUSER;', current_setting('custom.jwt_secret'));
    END;
    \$\$ LANGUAGE plpgsql;
END