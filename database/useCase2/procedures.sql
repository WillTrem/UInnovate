-- Function to create a new service ticket
CREATE OR REPLACE FUNCTION app_service_support.create_service_ticket(
    p_user_id TEXT,
    p_category_id INT,
    p_priority_id INT,
    p_status_id INT,
    p_location_id INT,
    p_description TEXT
)
RETURNS VOID AS
$$
BEGIN
    INSERT INTO app_service_support.service_tickets(
        user_id, category_id, priority_id, status_id, location_id, description
    )
    VALUES (p_user_id, p_category_id, p_priority_id, p_status_id, p_location_id, p_description);
END;
$$
LANGUAGE plpgsql;

-- Function to add a comment to a service ticket
CREATE OR REPLACE FUNCTION app_service_support.add_ticket_comment(
    p_ticket_id INT,
    p_user_id TEXT,
    p_comment_text TEXT
)
RETURNS VOID AS
$$
BEGIN
    INSERT INTO app_service_support.ticket_comments(ticket_id, user_id, comment_text)
    VALUES (p_ticket_id, p_user_id, p_comment_text);
END;
$$
LANGUAGE plpgsql;

-- Function to assign a service ticket to a user
CREATE OR REPLACE FUNCTION app_service_support.assign_ticket(
    p_ticket_id INT,
    p_assigned_user_id TEXT
)
RETURNS VOID AS
$$
BEGIN
    INSERT INTO app_service_support.ticket_assignments(ticket_id, assigned_user_id)
    VALUES (p_ticket_id, p_assigned_user_id);
END;
$$
LANGUAGE plpgsql;

-- Function to retrieve all comments for a specific service ticket
CREATE OR REPLACE FUNCTION app_service_support.get_ticket_comments(
    p_ticket_id INT
)
RETURNS TABLE (
    comment_id INT,
    user_id TEXT,
    comment_text TEXT,
    created_at TIMESTAMPTZ
) AS
$$
BEGIN
    RETURN QUERY
    SELECT comment_id, user_id, comment_text, created_at
    FROM app_service_support.ticket_comments
    WHERE ticket_id = p_ticket_id;
END;
$$
LANGUAGE plpgsql;

-- Function to retrieve all service tickets assigned to a specific user
CREATE OR REPLACE FUNCTION app_service_support.get_assigned_tickets(
    p_assigned_user_id TEXT
)
RETURNS TABLE (
    ticket_id INT,
    user_id TEXT,
    category_id INT,
    priority_id INT,
    status_id INT,
    location_id INT,
    description TEXT,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    resolved_at TIMESTAMPTZ
) AS
$$
BEGIN
    RETURN QUERY
    SELECT *
    FROM app_service_support.service_tickets
    WHERE ticket_id IN (
        SELECT ticket_id
        FROM app_service_support.ticket_assignments
        WHERE assigned_user_id = p_assigned_user_id
    );
END;
$$
LANGUAGE plpgsql;
