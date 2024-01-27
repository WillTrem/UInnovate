

-- Load the pgTAP extension if not already loaded
CREATE EXTENSION IF NOT EXISTS pgtap;

-- Plan the tests
SELECT plan(12);

-- Test Case 1: Add a comment to a service ticket

-- Call the function
SELECT  app_service_support.add_ticket_comment(1, 'user123', 'This is a comment');

-- Check if the comment is added successfully
SELECT results_eq(
    'SELECT ticket_id, user_id, comment_text
	FROM app_service_support.ticket_comments WHERE ticket_id = 1 AND user_id = ''user123'' ',
    $$VALUES (1, 'user123', 'This is a comment')$$,
    'add_ticket_comment() should insert a new comment'
);


-- Test Case 2: Try to add a comment to a non-existing service ticket

-- Check if the function raises an exception about the non-existing ticket
SELECT throws_ok('Select app_service_support.add_ticket_comment(999, ''user123'', ''This comment should fail.'')',
    'Ticket 999 does not exist. Cannot add comment.'
);

-- Test Case 3: Assign a service ticket to a user

SELECT is( app_service_support.assign_ticket(6, 'user456') , 'Ticket 6 assigned to user user456 successfully.', 'Already assigned Ticket assigned successfully');

-- Test Case 4: Try to assign a ticket that is already assigned

-- Check if the ticket is assigned successfully
SELECT throws_ok( 'SELECT app_service_support.assign_ticket(1, ''user456'')' , 'Ticket 1 is already assigned to another user.', 'Already assigned Ticket failed successfully');

-- Test Case 5: Retrieve all comments for a specific service ticket
SELECT results_eq('SELECT (COUNT(*))::INTEGER FROM app_service_support.get_ticket_comments(1)',
    $$VALUES (2)$$,
    'Retrieved correct number of comments.');


-- Test Case 6: Retrieve all service tickets assigned to a specific user

    -- Check if the number of retrieved tickets matches the expected count
SELECT results_eq('SELECT (COUNT(*))::INTEGER FROM app_service_support.get_assigned_tickets(''user456'')',
    $$VALUES (1)$$,
    'Retrieved correct number of assigned tickets.');

-- Test Case 7: Add a new tag to a ticket

-- Call the function
SELECT is(app_service_support.add_ticket_tag(1, 'NewTag'),
'Tag NewTag added to ticket 1 successfully.',
'Added new tag');

-- Test Case 8: Try to add an existing tag to a ticket

-- Call the function
SELECT is(app_service_support.add_ticket_tag(1, 'NewTag'),
'Tag NewTag is already associated with ticket 1.',
'Tag is already associated');

-- Test Case 9: Remove a tag from a ticket and delete it if not used
-- Call the function
SELECT is( app_service_support.remove_ticket_tag(1, 'NewTag'),
'Tag NewTag removed from ticket 1 and deleted successfully.',
'Tag removed and deleted successfully.'
);

-- Test Case 10: Try to remove a non-existing tag from a ticket
-- Call the function
SELECT is(app_service_support.remove_ticket_tag(1, 'NonExistingTag'),
'Tag NonExistingTag is not associated with ticket 1.',
'Try to remove a non existing tag');

-- Test Case 11: Trigger: Check if the notify_ticket_change trigger is working
-- UPDATE a new ticket to trigger the notify_ticket_change function
UPDATE app_service_support.service_tickets
SET category_id = 3
WHERE ticket_id = 1;

-- Check if the trigger log entry is added successfully
SELECT results_eq(
'SELECT action_performed::TEXT FROM app_service_support.system_logs WHERE action_performed like ''Ticket ID 1 updated%''',
$$VALUES('Ticket ID 1 updated: category_id changed from 1 to 3;')$$,
'System log entry added on ticket change');

-- Test Case 12: Trigger: Check if the notify_comment_change trigger is working
-- Insert a new comment to trigger the notify_comment_change function
INSERT INTO app_service_support.ticket_comments(ticket_id, user_id, comment_text, created_at)
VALUES (1, 'trigger_user', 'Triggered', NOW());

SELECT results_eq(
'SELECT action_performed::TEXT FROM app_service_support.system_logs WHERE action_performed like ''%ticket 1 by user trigger_user%''',
$$VALUES('Comment added to ticket 1 by user trigger_user.')$$,
'System log entry added on comment change');

SELECT * FROM finish();