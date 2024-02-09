-- SCHEMA:  app_service_support

DROP SCHEMA IF EXISTS  app_service_support CASCADE ;

CREATE SCHEMA IF NOT EXISTS  app_service_support ;

GRANT USAGE ON SCHEMA  app_service_support TO "user";

NOTIFY pgrst, 'reload config';
NOTIFY pgrst, 'reload schema';


--  ticket categories
CREATE TABLE  app_service_support.ticket_categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(50) UNIQUE NOT NULL
);
COMMENT ON COLUMN app_service_support.ticket_categories.category_name IS '{"reqOnCreate": true}';

--  ticket priorities
CREATE TABLE  app_service_support.ticket_priorities (
    priority_id SERIAL PRIMARY KEY,
    priority_name VARCHAR(50) UNIQUE NOT NULL
);
COMMENT ON COLUMN app_service_support.ticket_priorities.priority_name IS '{"reqOnCreate": true}';


--  ticket status
CREATE TABLE  app_service_support.ticket_status (
    status_id SERIAL PRIMARY KEY,
    status_name VARCHAR(50) UNIQUE NOT NULL
);
COMMENT ON COLUMN app_service_support.ticket_status.status_name IS '{"reqOnCreate": true}';



--  issue location
CREATE TABLE  app_service_support.locations (
    location_id SERIAL PRIMARY KEY,
    location_name VARCHAR(50) UNIQUE NOT NULL
);
COMMENT ON COLUMN app_service_support.locations.location_name IS '{"reqOnCreate": true}';


-- service tickets
CREATE TABLE  app_service_support.service_tickets (
    ticket_id SERIAL PRIMARY KEY,
    category_id INT REFERENCES  app_service_support.ticket_categories(category_id) NOT NULL,
    priority_id INT REFERENCES  app_service_support.ticket_priorities(priority_id) NOT NULL,
    status_id INT REFERENCES  app_service_support.ticket_status(status_id) NOT NULL,
    location_id INT REFERENCES  app_service_support.locations(location_id) NOT NULL,
    description TEXT NOT NULL,
    created_by TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ,
    resolved_at TIMESTAMPTZ);
COMMENT ON COLUMN app_service_support.service_tickets.category_id IS '{"reqOnCreate": true, "refTable": "app_service_support.ticket_categories"}';
COMMENT ON COLUMN app_service_support.service_tickets.priority_id IS '{"reqOnCreate": true, "refTable": "app_service_support.ticket_priorities"}';
COMMENT ON COLUMN app_service_support.service_tickets.status_id IS '{"reqOnCreate": true, "refTable": "app_service_support.ticket_status"}';
COMMENT ON COLUMN app_service_support.service_tickets.location_id IS '{"reqOnCreate": true, "refTable": "app_service_support.locations"}';
COMMENT ON COLUMN app_service_support.service_tickets.description IS '{"reqOnCreate": true}';
COMMENT ON COLUMN app_service_support.service_tickets.created_by IS '{"reqOnCreate": true}';
COMMENT ON COLUMN app_service_support.service_tickets.created_at IS '{"reqOnCreate": true}';
COMMENT ON COLUMN app_service_support.service_tickets.updated_at IS '{"reqOnCreate": true}';
COMMENT ON COLUMN app_service_support.service_tickets.resolved_at IS '{"reqOnCreate": true}';

--  ticket comments
CREATE TABLE  app_service_support.ticket_comments (
    comment_id SERIAL PRIMARY KEY,
    ticket_id INT REFERENCES  app_service_support.service_tickets(ticket_id) NOT NULL,
    user_id TEXT NOT NULL,
    comment_TEXT TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);
COMMENT ON COLUMN app_service_support.ticket_comments.ticket_id IS '{"reqOnCreate": true, "refTable": "app_service_support.service_tickets"}';
COMMENT ON COLUMN app_service_support.ticket_comments.user_id IS '{"reqOnCreate": true}';
COMMENT ON COLUMN app_service_support.ticket_comments.comment_TEXT IS '{"reqOnCreate": true}';
COMMENT ON COLUMN app_service_support.ticket_comments.created_at IS '{"reqOnCreate": true}';

--  ticket assignments
CREATE TABLE  app_service_support.ticket_assignments (
    assignment_id SERIAL PRIMARY KEY,
    ticket_id INT REFERENCES  app_service_support.service_tickets(ticket_id) NOT NULL,
    assigned_user_id TEXT NOT NULL,
    assigned_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);
COMMENT ON COLUMN app_service_support.ticket_assignments.ticket_id IS '{"reqOnCreate": true, "refTable": "app_service_support.service_tickets"}';
COMMENT ON COLUMN app_service_support.ticket_assignments.assigned_user_id IS '{"reqOnCreate": true}';
COMMENT ON COLUMN app_service_support.ticket_assignments.assigned_at IS '{"reqOnCreate": true}';

--  system logs
CREATE TABLE  app_service_support.system_logs (
    log_id SERIAL PRIMARY KEY,
    user_id TEXT,
    action_performed VARCHAR(100) NOT NULL,
    action_timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Table to store ticket tags
CREATE TABLE  app_service_support.tags (
    tag_id SERIAL PRIMARY KEY,
    tag_name VARCHAR(50) UNIQUE NOT NULL
);
COMMENT ON COLUMN app_service_support.tags.tag_name IS '{"reqOnCreate": true}';

-- many-to-many relationship between service_tickets and ticket_tags
CREATE TABLE  app_service_support.ticket_tags (
    ticket_id INT REFERENCES  app_service_support.service_tickets(ticket_id) NOT NULL,
    tag_id INT REFERENCES  app_service_support.tags(tag_id) NOT NULL,
    PRIMARY KEY (ticket_id, tag_id)
);

GRANT ALL ON  app_service_support.ticket_categories TO "user";
GRANT ALL ON  app_service_support.ticket_priorities TO "user";
GRANT ALL ON  app_service_support.ticket_status TO "user";
GRANT ALL ON  app_service_support.locations TO "user";
GRANT ALL ON  app_service_support.service_tickets TO "user";
GRANT ALL ON  app_service_support.ticket_comments TO "user";
GRANT ALL ON  app_service_support.ticket_assignments TO "user";
GRANT ALL ON  app_service_support.system_logs TO "user";
GRANT ALL ON  app_service_support.tags TO "user";
GRANT ALL ON  app_service_support.ticket_tags TO "user";

-- Grant necessary permissions on the sequence to the user
GRANT USAGE, SELECT ON SEQUENCE app_service_support.ticket_assignments_assignment_id_seq TO "user";
GRANT USAGE, SELECT ON SEQUENCE app_service_support.ticket_comments_comment_id_seq TO "user";
GRANT USAGE ON SEQUENCE app_service_support.system_logs_log_id_seq TO "user";
GRANT USAGE ON SEQUENCE app_service_support.tags_tag_id_seq TO "user";
