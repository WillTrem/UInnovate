-- Table to store service tickets
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
    ticket_tags TEXT -- Corrected the type to TEXT
);

-- Table to store ticket comments
CREATE TABLE application.ticket_comments (
    comment_id SERIAL PRIMARY KEY,
    ticket_id INT REFERENCES application.service_tickets(ticket_id) NOT NULL,
    user_id INT REFERENCES application.users(user_id) NOT NULL,
    comment_text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Table to store ticket assignments
CREATE TABLE application.ticket_assignments (
    assignment_id SERIAL PRIMARY KEY,
    ticket_id INT REFERENCES application.service_tickets(ticket_id) NOT NULL,
    assigned_user_id INT REFERENCES application.users(user_id) NOT NULL,
    assigned_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Table to store system logs
CREATE TABLE application.system_logs (
    log_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES application.users(user_id),
    action_performed VARCHAR(100) NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);
