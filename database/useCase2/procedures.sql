
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

-- Function to add a new record to ticket_tags
CREATE OR REPLACE FUNCTION app_service_support.add_ticket_tag(
    p_ticket_id INT,
    p_tag_name VARCHAR(50)
)
RETURNS TEXT AS
$$
DECLARE v_tag_id INT;
BEGIN
    -- Check if the tag already exists
    IF NOT EXISTS (
        SELECT 1
        FROM app_service_support.tags
        WHERE tag_name = p_tag_name
    ) THEN
        -- If the tag doesn't exist, insert it
        INSERT INTO app_service_support.tags(tag_name)
        VALUES (p_tag_name);
    END IF;

    -- Get the tag_id for the given tag_name
    SELECT tag_id INTO v_tag_id
    FROM app_service_support.tags
    WHERE tag_name = p_tag_name;

   -- Check if the tag is already associated with the ticket
    IF NOT EXISTS (
        SELECT 1
        FROM app_service_support.ticket_tags
        WHERE ticket_id = p_ticket_id AND tag_id = v_tag_id
    ) THEN
        -- If the tag is not associated, insert the association
        INSERT INTO app_service_support.ticket_tags(ticket_id, tag_id)
        VALUES (p_ticket_id, v_tag_id);

        -- Return a success message
        RETURN format('Tag %s added to ticket %s successfully.', p_tag_name, p_ticket_id);
    ELSE
        -- Return a message if the tag is already associated
        RETURN format('Tag %s is already associated with ticket %s.', p_tag_name, p_ticket_id);
    END IF;
END;
$$
LANGUAGE plpgsql;

-- Function to remove a tag from a ticket and delete it if not used
CREATE OR REPLACE FUNCTION app_service_support.remove_ticket_tag(
    p_ticket_id INT,
    p_tag_name VARCHAR(50)
)
RETURNS TEXT AS
$$
DECLARE v_tag_id INT;
BEGIN
    -- Get the tag_id for the given tag_name
    SELECT tag_id INTO v_tag_id
    FROM app_service_support.tags
    WHERE tag_name = p_tag_name;

    -- Check if the tag is associated with the ticket
    IF EXISTS (
        SELECT 1
        FROM app_service_support.ticket_tags
        WHERE ticket_id = p_ticket_id AND tag_id = v_tag_id
    ) THEN
        -- If the tag is associated, remove the association
        DELETE FROM app_service_support.ticket_tags
        WHERE ticket_id = p_ticket_id AND tag_id = v_tag_id;

        -- Check if the tag is not used by any other ticket
        IF NOT EXISTS (
            SELECT 1
            FROM app_service_support.ticket_tags
            WHERE tag_id = v_tag_id
        ) THEN
            -- If the tag is not used, delete it
            DELETE FROM app_service_support.tags
            WHERE tag_id = v_tag_id;

            -- Return a success message
            RETURN format('Tag %s removed from ticket %s and deleted successfully.', p_tag_name, p_ticket_id);
        ELSE
            -- Return a success message without tag deletion
            RETURN format('Tag %s removed from ticket %s successfully.', p_tag_name, p_ticket_id);
        END IF;
    ELSE
        -- Return a message if the tag is not associated
        RETURN format('Tag %s is not associated with ticket %s.', p_tag_name, p_ticket_id);
    END IF;
END;
$$
LANGUAGE plpgsql;


-- Trigger to call the email notification function when something in the ticket changed
CREATE OR REPLACE FUNCTION app_service_support.notify_ticket_change()
RETURNS TRIGGER AS
$$
DECLARE
    log_message TEXT;
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- New ticket added
        log_message := 'New ticket added with ID ' || NEW.ticket_id || ' by user ' || NEW.created_by || '.';
    ELSE
        -- Existing ticket updated
        log_message := 'Ticket ID ' || NEW.ticket_id || ' updated:';

        IF OLD.created_by IS DISTINCT FROM NEW.created_by THEN
            log_message := log_message || ' created_by changed from ' || OLD.created_by || ' to ' || NEW.created_by || ';';
        END IF;

        IF OLD.category_id IS DISTINCT FROM NEW.category_id THEN
            log_message := log_message || ' category_id changed from ' || OLD.category_id || ' to ' || NEW.category_id || ';';
        END IF;

        IF OLD.priority_id IS DISTINCT FROM NEW.priority_id THEN
            log_message := log_message || ' priority_id changed from ' || OLD.priority_id || ' to ' || NEW.priority_id || ';';
        END IF;

        IF OLD.status_id IS DISTINCT FROM NEW.status_id THEN
            log_message := log_message || ' status_id changed from ' || OLD.status_id || ' to ' || NEW.status_id || ';';
        END IF;

        IF OLD.location_id IS DISTINCT FROM NEW.location_id THEN
            log_message := log_message || ' location_id changed from ' || OLD.location_id || ' to ' || NEW.location_id || ';';
        END IF;

        IF OLD.description IS DISTINCT FROM NEW.description THEN
            log_message := log_message || ' description changed;';
        END IF;

        IF OLD.resolved_at IS DISTINCT FROM NEW.resolved_at THEN
            log_message := log_message || ' resolved_at changed;';
        END IF;
    END IF;

    -- Insert log entry into system_logs table
    INSERT INTO app_service_support.system_logs(user_id, action_performed, action_timestamp)
    VALUES (CURRENT_USER, log_message, CURRENT_TIMESTAMP);

    -- Update the updated_at field to the current timestamp
    NEW.updated_at := CURRENT_TIMESTAMP;

    RETURN NEW;
END;
$$
LANGUAGE plpgsql;

-- Create the ticket trigger
DROP TRIGGER IF EXISTS ticket_change_trigger ON app_service_support.service_tickets;
CREATE TRIGGER ticket_change_trigger
AFTER INSERT OR UPDATE ON app_service_support.service_tickets
FOR EACH ROW
EXECUTE PROCEDURE app_service_support.notify_ticket_change();


-- Function to log changes to ticket_comments
CREATE OR REPLACE FUNCTION app_service_support.notify_comment_change()
RETURNS TRIGGER AS
$$
DECLARE
    log_message TEXT;
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Comment added
        log_message := 'Comment added to ticket ' || NEW.ticket_id || ' by user ' || NEW.user_id || '.';
    ELSIF TG_OP = 'UPDATE' THEN
        -- Comment updated
        log_message := 'Comment updated for ticket ' || NEW.ticket_id || ' by user ' || NEW.user_id || '.';
    ELSIF TG_OP = 'DELETE' THEN
        -- Comment deleted
        log_message := 'Comment deleted from ticket ' || OLD.ticket_id || ' by user ' || OLD.user_id || '.';
    END IF;

    -- Insert log entry into system_logs table
    INSERT INTO app_service_support.system_logs(user_id, action_performed, action_timestamp)
    VALUES (CURRENT_USER, log_message, CURRENT_TIMESTAMP);

    RETURN NULL;
END;
$$
LANGUAGE plpgsql;

-- Create the comment trigger
DROP TRIGGER IF EXISTS comment_change_trigger ON app_service_support.ticket_comments;
CREATE TRIGGER comment_change_trigger
AFTER INSERT OR UPDATE OR DELETE ON app_service_support.ticket_comments
FOR EACH ROW
EXECUTE PROCEDURE app_service_support.notify_comment_change();
