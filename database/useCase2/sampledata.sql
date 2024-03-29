
-- ticket categories
INSERT INTO  app_service_support.ticket_categories (category_name) VALUES
    ('UI'),
    ('Frontend'),
    ('Backend'),
    ('Database'),
    ('Production');

-- ticket priorities
INSERT INTO  app_service_support.ticket_priorities (priority_name) VALUES
    ('High'),
    ('Medium'),
    ('Low');

-- ticket statuses
INSERT INTO  app_service_support.ticket_status (status_name) VALUES
    ('Open'),
    ('InProgress'),
    ('AwaitingResponse'),
    ('Closed'),
    ('Reopened');

-- locations
INSERT INTO  app_service_support.locations (location_name) VALUES
    ('Default'),  -- Default location
    ('Location1'),
    ('Location2'),
    ('Location3');

-- service tickets
INSERT INTO  app_service_support.service_tickets (category_id, priority_id, status_id, location_id, description, created_by, created_at, updated_at, resolved_at) VALUES
    ( 1, 1, 1, 1, 'UI issue in the dashboard', 'jane@test.xyz', '2023-01-01 12:00:00', NULL, '2023-01-01 13:00:00'),
    ( 3, 2, 1, 1, 'Backend server error', 'john@test.xyz', '2023-01-02 10:30:00', NULL, '2023-01-02 11:45:00'),
    ( 2, 3, 1, 2, 'Trouble with database connection', 'jane@test.xyz', '2023-01-03 15:45:00', NULL, '2023-01-03 16:30:00'),
    ( 1, 1, 1, 3, 'Cannot access user settings', 'john@test.xyz', '2023-01-04 08:20:00', NULL, '2023-01-04 09:50:00'),
    ( 4, 3, 1, 4, 'Production server down', 'jane@test.xyz', '2023-01-05 14:00:00', NULL, '2023-01-05 15:45:00'),
    ( 2, 2, 1, 1, 'Frontend styling issue', 'john@test.xyz', '2023-01-06 11:00:00', NULL, '2023-01-06 11:30:00'),
    ( 4, 1, 1, 1, 'Database query optimization', 'jane@test.xyz', '2023-01-07 13:30:00', NULL, '2023-01-07 13:45:00'),
    ( 3, 2, 1, 2, 'Server performance degradation', 'john@test.xyz', '2023-01-08 09:45:00', NULL, '2023-01-08 10:30:00'),
    ( 2, 3, 1, 3, 'UI responsiveness problem', 'jane@test.xyz', '2023-01-09 16:15:00', NULL, '2023-01-09 17:00:00'),
    ( 1, 1, 1, 4, 'Error in production deployment', 'john@test.xyz', '2023-01-10 07:30:00', NULL, '2023-01-10 08:15:00');


-- ticket comments
INSERT INTO  app_service_support.ticket_comments (ticket_id, user_id, comment_text, created_at) VALUES
    (1, 'user2@test.com', 'Investigating the UI issue.', '2023-01-01 13:30:00'),
    (2, 'user3@test.com', 'Looking into the backend server error.', '2023-01-02 11:45:00'),
    (3, 'user4@test.com', 'Checking the database connection issue.', '2023-01-03 16:30:00'),
    (4, 'user5@test.com', 'Trying to resolve the user settings problem.', '2023-01-04 09:50:00'),
    (5, 'user@test.com', 'Addressing the production server downtime.', '2023-01-05 15:45:00');

-- ticket assignments
INSERT INTO  app_service_support.ticket_assignments (ticket_id, assigned_user_id, assigned_at) VALUES
    (1, 'user2@test.com', '2023-01-01 14:00:00'),
    (2, 'user3@test.com', '2023-01-02 12:15:00'),
    (3, 'user4@test.com', '2023-01-03 17:00:00'),
    (4, 'user5@test.com', '2023-01-04 10:20:00'),
    (5, 'user@test.com', '2023-01-05 16:30:00');

-- system logs
INSERT INTO  app_service_support.system_logs (user_id, action_performed, action_timestamp) VALUES
    (2, 'Logged in', '2023-01-01 14:30:00'),
    (3, 'Changed ticket status', '2023-01-02 13:00:00'),
    (4, 'Updated user settings', '2023-01-03 18:00:00'),
    (5, 'Deployed  app_service_support update', '2023-01-04 11:30:00'),
    (1, 'Logged out', '2023-01-05 17:45:00');

-- Insert fake ticket tags
INSERT INTO  app_service_support.tags (tag_name) VALUES
    ('UI'),
    ('Frontend'),
    ('Backend'),
    ('Database'),
    ('Production'),
    ('Bug'),
    ('Feature'),
    ('Critical'),
    ('High Priority'),
    ('Low Priority');

-- Insert fake service ticket tags
INSERT INTO  app_service_support.ticket_tags (ticket_id, tag_id) VALUES
    (1, 1),
    (1, 2),
    (2, 3),
    (2, 5),
    (3, 4),
    (3, 8),
    (4, 1),
    (4, 2),
    (5, 5),
    (5, 9),
    (6, 2),
    (6, 6),
    (7, 3),
    (7, 7),
    (8, 4),
    (8, 8),
    (9, 2),
    (9, 9),
    (10, 5),
    (10, 10);
