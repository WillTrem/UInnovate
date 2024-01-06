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
RETURNS TEXT AS
$$
BEGIN
    -- Check if the ticket exists
    IF EXISTS (
        SELECT 1
        FROM app_service_support.service_tickets
        WHERE ticket_id = p_ticket_id
    ) THEN
        -- If the ticket exists, insert the comment
        INSERT INTO app_service_support.ticket_comments(ticket_id, user_id, comment_text)
        VALUES (p_ticket_id, p_user_id, p_comment_text);

        -- Return a success message
        RETURN format('Comment added to ticket %s by user %s successfully.', p_ticket_id, p_user_id);
    ELSE
        -- If the ticket does not exist, raise an exception and return an error message
        RAISE EXCEPTION 'Ticket % does not exist. Cannot add comment.', p_ticket_id;
    END IF;
END;
$$
LANGUAGE plpgsql;


-- Function to assign a service ticket to a user
CREATE OR REPLACE FUNCTION app_service_support.assign_ticket(
    p_ticket_id INT,
    p_assigned_user_id TEXT
)
RETURNS TEXT AS
$$
BEGIN
    -- Check if the ticket has not been assigned before
    IF NOT EXISTS (
        SELECT 1
        FROM app_service_support.ticket_assignments
        WHERE ticket_id = p_ticket_id
    ) THEN
        -- Insert the assignment
        INSERT INTO app_service_support.ticket_assignments(ticket_id, assigned_user_id)
        VALUES (p_ticket_id, p_assigned_user_id);

        -- Return a success message
        RETURN format('Ticket %s assigned to user %s successfully.', p_ticket_id, p_assigned_user_id);
    ELSE
        -- Raise an exception and return an error message
        RAISE EXCEPTION 'Ticket % is already assigned to another user.', p_ticket_id;
    END IF;
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
    SELECT tc.comment_id, tc.user_id, tc.comment_text, tc.created_at
    FROM app_service_support.ticket_comments tc
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
    SELECT st.*
    FROM app_service_support.service_tickets st
    WHERE st.ticket_id IN (
        SELECT ta.ticket_id
        FROM app_service_support.ticket_assignments ta
        WHERE assigned_user_id = p_assigned_user_id
    );
END;
$$
LANGUAGE plpgsql;
