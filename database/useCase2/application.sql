-- SCHEMA: application

DROP SCHEMA IF EXISTS application CASCADE ;

CREATE SCHEMA IF NOT EXISTS application ;

GRANT USAGE ON SCHEMA application TO web_anon;

--  user information
CREATE TABLE application.users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL
);

--  ticket categories
CREATE TABLE application.ticket_categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(50) UNIQUE NOT NULL
);

--  ticket priorities
CREATE TABLE application.ticket_priorities (
    priority_id SERIAL PRIMARY KEY,
    priority_name VARCHAR(20) UNIQUE NOT NULL
);

--  service tickets
CREATE TABLE application.service_tickets (
    ticket_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES application.users(user_id) NOT NULL,
    category_id INT REFERENCES application.ticket_categories(category_id) NOT NULL,
    priority_id INT REFERENCES application.ticket_priorities(priority_id) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'Open' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ,
    resolved_at TIMESTAMPTZ,
    ticket_tags Text
);

--  ticket comments
CREATE TABLE application.ticket_comments (
    comment_id SERIAL PRIMARY KEY,
    ticket_id INT REFERENCES application.service_tickets(ticket_id) NOT NULL,
    user_id INT REFERENCES application.users(user_id) NOT NULL,
    comment_text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

--  ticket assignments
CREATE TABLE application.ticket_assignments (
    assignment_id SERIAL PRIMARY KEY,
    ticket_id INT REFERENCES application.service_tickets(ticket_id) NOT NULL,
    assigned_user_id INT REFERENCES application.users(user_id) NOT NULL,
    assigned_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

--  system logs
CREATE TABLE application.system_logs (
    log_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES application.users(user_id),
    action_performed VARCHAR(100) NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);


GRANT ALL ON application.users TO web_anon;
GRANT ALL ON application.ticket_categories TO web_anon;
GRANT ALL ON application.ticket_priorities TO web_anon;
GRANT ALL ON application.service_tickets TO web_anon;
GRANT ALL ON application.ticket_comments TO web_anon;
GRANT ALL ON application.ticket_assignments TO web_anon;
GRANT ALL ON application.system_logs TO web_anon;