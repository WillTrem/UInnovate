-- users
INSERT INTO application.users (username, password_hash, role) VALUES
    ('user1', 'hashed_password1', 'Admin'),
    ('user2', 'hashed_password2', 'Support'),
    ('user3', 'hashed_password3', 'Support'),
    ('user4', 'hashed_password4', 'User'),
    ('user5', 'hashed_password5', 'User');

-- ticket categories
INSERT INTO application.ticket_categories (category_name) VALUES
    ('UI'),
    ('Frontend'),
    ('Backend'),
    ('Database'),
    ('Production');

-- ticket priorities
INSERT INTO application.ticket_priorities (priority_name) VALUES
    ('High'),
    ('Medium'),
    ('Low');

-- service tickets
INSERT INTO application.service_tickets (user_id, category_id, priority_id, description, status, created_at, updated_at, resolved_at, ticket_tags) VALUES
    (1, 1, 1, 'UI issue in the dashboard', 'Open', '2023-01-01 12:00:00', NULL, NULL, '["ui", "frontend"]'),
    (2, 3, 2, 'Backend server error', 'Open', '2023-01-02 10:30:00', NULL, NULL, '["backend", "production"]'),
    (3, 2, 3, 'Trouble with database connection', 'Open', '2023-01-03 15:45:00', NULL, NULL, '["database"]'),
    (4, 1, 1, 'Cannot access user settings', 'Open', '2023-01-04 08:20:00', NULL, NULL, '["ui", "frontend"]'),
    (5, 4, 3, 'Production server down', 'Open', '2023-01-05 14:00:00', NULL, NULL, '["production"]'),
    (1, 2, 2, 'Frontend styling issue', 'Open', '2023-01-06 11:00:00', NULL, NULL, '["frontend"]'),
    (2, 4, 1, 'Database query optimization', 'Open', '2023-01-07 13:30:00', NULL, NULL, '["database"]'),
    (3, 3, 2, 'Server performance degradation', 'Open', '2023-01-08 09:45:00', NULL, NULL, '["backend", "production"]'),
    (4, 2, 3, 'UI responsiveness problem', 'Open', '2023-01-09 16:15:00', NULL, NULL, '["ui", "frontend"]'),
    (5, 1, 1, 'Error in production deployment', 'Open', '2023-01-10 07:30:00', NULL, NULL, '["production"]');

-- ticket comments
INSERT INTO application.ticket_comments (ticket_id, user_id, comment_text, created_at) VALUES
    (1, 2, 'Investigating the UI issue.', '2023-01-01 13:30:00'),
    (2, 3, 'Looking into the backend server error.', '2023-01-02 11:45:00'),
    (3, 4, 'Checking the database connection issue.', '2023-01-03 16:30:00'),
    (4, 5, 'Trying to resolve the user settings problem.', '2023-01-04 09:50:00'),
    (5, 1, 'Addressing the production server downtime.', '2023-01-05 15:45:00');

-- ticket assignments
INSERT INTO application.ticket_assignments (ticket_id, assigned_user_id, assigned_at) VALUES
    (1, 2, '2023-01-01 14:00:00'),
    (2, 3, '2023-01-02 12:15:00'),
    (3, 4, '2023-01-03 17:00:00'),
    (4, 5, '2023-01-04 10:20:00'),
    (5, 1, '2023-01-05 16:30:00');

-- system logs
INSERT INTO application.system_logs (user_id, action_performed, timestamp) VALUES
    (2, 'Logged in', '2023-01-01 14:30:00'),
    (3, 'Changed ticket status', '2023-01-02 13:00:00'),
    (4, 'Updated user settings', '2023-01-03 18:00:00'),
    (5, 'Deployed application update', '2023-01-04 11:30:00'),
    (1, 'Logged out', '2023-01-05 17:45:00');