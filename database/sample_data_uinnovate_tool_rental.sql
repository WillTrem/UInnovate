-- Sample data for tool_type table
INSERT INTO tool_type (type_name, type_category) VALUES
    ('Drill', 'Power Tools'),
    ('Hammer', 'Hand Tools'),
    ('Saw', 'Power Tools'),
    ('Wrench', 'Hand Tools'),
    ('Screwdriver', 'Hand Tools'),
    ('Power Washer', 'Power Tools'),
    ('Pliers', 'Hand Tools'),
    ('Circular Saw', 'Power Tools'),
    ('Chisel', 'Hand Tools'),
    ('Jigsaw', 'Power Tools'),
    ('Tape Measure', 'Hand Tools'),
    ('Angle Grinder', 'Power Tools'),
    ('Screw Gun', 'Power Tools'),
    ('Ratchet', 'Hand Tools'),
    ('Impact Driver', 'Power Tools'),
    ('Utility Knife', 'Hand Tools'),
    ('Reciprocating Saw', 'Power Tools'),
    ('Hand Saw', 'Hand Tools'),
    ('Bolt Cutter', 'Hand Tools'),
    ('Table Saw', 'Power Tools');

-- Sample data for tool table
INSERT INTO tool (tool_type, tool_name, tool_price, tool_description, tool_qty_available) VALUES
    (1, 'Cordless Drill', 99.99, 'Powerful cordless drill for various applications', 15),
    (2, 'Claw Hammer', 12.99, 'Sturdy hammer for carpentry work', 20),
    (3, 'Circular Saw', 149.99, 'High-performance circular saw with laser guide', 10),
    (4, 'Adjustable Wrench', 8.99, 'Versatile adjustable wrench for various tasks', 18),
    (5, 'Phillips Screwdriver', 4.99, 'Durable Phillips screwdriver for screwing tasks', 25),
    (6, 'Power Washer', 199.99, 'Heavy-duty power washer for cleaning tasks', 12),
    (7, 'Pliers', 6.99, 'Multi-functional pliers for gripping and cutting', 22),
    (8, 'Chisel', 5.99, 'Sharp chisel for woodworking', 15),
    (9, 'Jigsaw', 129.99, 'Precision jigsaw for intricate cutting', 8),
    (10, 'Tape Measure', 7.99, 'Retractable tape measure for accurate measurements', 30),
    (11, 'Angle Grinder', 79.99, 'Versatile angle grinder for cutting and grinding', 10),
    (12, 'Screw Gun', 49.99, 'Automatic screw gun for efficient screwing', 18),
    (13, 'Ratchet', 14.99, 'Handheld ratchet for tightening and loosening bolts', 20),
    (14, 'Impact Driver', 89.99, 'High-torque impact driver for heavy-duty tasks', 12),
    (15, 'Utility Knife', 3.99, 'Compact utility knife for cutting various materials', 25),
    (16, 'Reciprocating Saw', 119.99, 'Reciprocating saw for cutting through tough materials', 10),
    (17, 'Hand Saw', 9.99, 'Traditional hand saw for woodworking', 15),
    (18, 'Bolt Cutter', 17.99, 'Heavy-duty bolt cutter for cutting bolts and chains', 8),
    (19, 'Table Saw', 199.99, 'Large table saw for precise woodworking', 5),
    (20, 'Sledgehammer', 24.99, 'Powerful sledgehammer for heavy demolition work', 7);

-- Sample data for unit table
INSERT INTO unit (tool_id, tool_type, unit_serial_number, unit_weight, unit_height, unit_condition, unit_available, unit_last_exited_date, unit_last_returned_date, last_calibration_certificate_id) VALUES
    (1, 1, 'SN123456', 10.0, 15.0, 'Good', true, '2023-11-01', '2023-11-01', NULL),
    (2, 2, 'SN789012', 5.0, 10.0, 'Excellent', true, '2023-11-02', '2023-11-02', NULL),
    (3, 3, 'SN345678', 7.0, 12.0, 'Fair', true, '2023-11-03', '2023-11-03', NULL),
    (4, 4, 'SN567890', 3.0, 8.0, 'Good', true, '2023-11-04', '2023-11-04', NULL),
    (5, 5, 'SN234567', 12.0, 18.0, 'Excellent', true, '2023-11-05', '2023-11-05', NULL),
    (6, 6, 'SN890123', 15.0, 20.0, 'Fair', true, '2023-11-06', '2023-11-06', NULL),
    (7, 7, 'SN456789', 8.0, 16.0, 'Good', true, '2023-11-07', '2023-11-07', NULL),
    (8, 8, 'SN678901', 6.0, 14.0, 'Excellent', true, '2023-11-08', '2023-11-08', NULL),
    (9, 9, 'SN345678', 2.0, 6.0, 'Good', true, '2023-11-09', '2023-11-09', NULL),
    (10, 10, 'SN567890', 20.0, 25.0, 'Fair', true, '2023-11-10', '2023-11-10', NULL),
    (11, 11, 'SN234567', 18.0, 22.0, 'Good', true, '2023-11-11', '2023-11-11', NULL),
    (12, 12, 'SN890123', 4.0, 10.0, 'Excellent', true, '2023-11-12', '2023-11-12', NULL),
    (13, 13, 'SN456789', 10.0, 14.0, 'Fair', true, '2023-11-13', '2023-11-13', NULL),
    (14, 14, 'SN678901', 3.0, 7.0, 'Good', true, '2023-11-14', '2023-11-14', NULL),
    (15, 15, 'SN345678', 5.0, 11.0, 'Excellent', true, '2023-11-15', '2023-11-15', NULL),
    (16, 16, 'SN567890', 16.0, 24.0, 'Fair', true, '2023-11-16', '2023-11-16', NULL),
    (17, 17, 'SN234567', 14.0, 20.0, 'Good', true, '2023-11-17', '2023-11-17', NULL),
    (18, 18, 'SN890123', 8.0, 18.0, 'Excellent', true, '2023-11-18', '2023-11-18', NULL),
    (19, 19, 'SN456789', 6.0, 16.0, 'Fair', true, '2023-11-19', '2023-11-19', NULL),
    (20, 20, 'SN678901', 12.0, 22.0, 'Good', true, '2023-11-20', '2023-11-20', NULL);

-- Sample data for company table
INSERT INTO company (address, primary_contact_id, is_prev_customer, pricing_rate) VALUES
    ('123 Main St, Cityville', NULL, true, 0.85),
    ('456 Oak Ave, Townburg', NULL, false, 1.00),
    ('789 Pine Blvd, Villageton', NULL, true, 0.90),
    ('101 Cedar Ln, Hamletown', NULL, false, 0.95),
    ('202 Maple Dr, Suburbia', NULL, true, 0.88),
    ('303 Elm Rd, Ruralville', NULL, false, 0.92),
    ('404 Birch Dr, Countryside', NULL, true, 0.87),
    ('505 Walnut Ln, Seaside', NULL, false, 0.96),
    ('606 Pine Dr, Mountainview', NULL, true, 0.89),
    ('707 Oak St, Hilltop', NULL, false, 0.94),
    ('808 Maple Ave, Lakeside', NULL, true, 0.91),
    ('909 Cedar Blvd, Riverside', NULL, false, 0.93),
    ('1010 Birch Ave, Skyline', NULL, true, 0.86),
    ('1111 Elm Ln, Valleyview', NULL, false, 0.97),
    ('1212 Walnut Rd, Cliffside', NULL, true, 0.83),
    ('1313 Pine Blvd, Oceanview', NULL, false, 0.98),
    ('1414 Oak Dr, Summit', NULL, true, 0.80),
    ('1515 Maple St, Horizon', NULL, false, 0.99),
    ('1616 Cedar Ave, Riverside', NULL, true, 0.82),
    ('1717 Birch Ln, Crestview', NULL, false, 1.01);

-- Sample data for contact table
INSERT INTO contact (company_id, contact_position, phone_number, email) VALUES
    (1, 'Manager', '+1234567890', 'manager@company1.com'),
    (2, 'Coordinator', '+2345678901', 'coordinator@company2.com'),
    (3, 'Supervisor', '+3456789012', 'supervisor@company3.com'),
    (4, 'Director', '+4567890123', 'director@company4.com'),
    (5, 'Executive', '+5678901234', 'executive@company5.com'),
    (6, 'Manager', '+6789012345', 'manager@company6.com'),
    (7, 'Coordinator', '+7890123456', 'coordinator@company7.com'),
    (8, 'Supervisor', '+8901234567', 'supervisor@company8.com'),
    (9, 'Director', '+9012345678', 'director@company9.com'),
    (10, 'Executive', '+0123456789', 'executive@company10.com'),
    (11, 'Manager', '+1122334455', 'manager@company11.com'),
    (12, 'Coordinator', '+2233445566', 'coordinator@company12.com'),
    (13, 'Supervisor', '+3344556677', 'supervisor@company13.com'),
    (14, 'Director', '+4455667788', 'director@company14.com'),
    (15, 'Executive', '+5566778899', 'executive@company15.com'),
    (16, 'Manager', '+6677889900', 'manager@company16.com'),
    (17, 'Coordinator', '+7788990011', 'coordinator@company17.com'),
    (18, 'Supervisor', '+8899001122', 'supervisor@company18.com'),
    (19, 'Director', '+9900112233', 'director@company19.com'),
    (20, 'Executive', '+0011223344', 'executive@company20.com');

-- Update primary_contact_id in company table
UPDATE company SET primary_contact_id = 1 WHERE company_id = 1;
UPDATE company SET primary_contact_id = 2 WHERE company_id = 2;
UPDATE company SET primary_contact_id = 3 WHERE company_id = 3;
UPDATE company SET primary_contact_id = 4 WHERE company_id = 4;
UPDATE company SET primary_contact_id = 5 WHERE company_id = 5;
UPDATE company SET primary_contact_id = 6 WHERE company_id = 6;
UPDATE company SET primary_contact_id = 7 WHERE company_id = 7;
UPDATE company SET primary_contact_id = 8 WHERE company_id = 8;
UPDATE company SET primary_contact_id = 9 WHERE company_id = 9;
UPDATE company SET primary_contact_id = 10 WHERE company_id = 10;
UPDATE company SET primary_contact_id = 11 WHERE company_id = 11;
UPDATE company SET primary_contact_id = 12 WHERE company_id = 12;
UPDATE company SET primary_contact_id = 13 WHERE company_id = 13;
UPDATE company SET primary_contact_id = 14 WHERE company_id = 14;
UPDATE company SET primary_contact_id = 15 WHERE company_id = 15;
UPDATE company SET primary_contact_id = 16 WHERE company_id = 16;
UPDATE company SET primary_contact_id = 17 WHERE company_id = 17;
UPDATE company SET primary_contact_id = 18 WHERE company_id = 18;
UPDATE company SET primary_contact_id = 19 WHERE company_id = 19;
UPDATE company SET primary_contact_id = 20 WHERE company_id = 20;

-- Sample data for quotation table
INSERT INTO quotation (quotation_date, tools_quoted_qty, totalprice) VALUES
    ('2023-11-01', 5, 150.00),
    ('2023-11-02', 8, 240.00),
    ('2023-11-03', 10, 300.00),
    ('2023-11-04', 6, 180.00),
    ('2023-11-05', 12, 360.00),
    ('2023-11-06', 15, 450.00),
    ('2023-11-07', 7, 210.00),
    ('2023-11-08', 9, 270.00),
    ('2023-11-09', 11, 330.00),
    ('2023-11-10', 14, 420.00),
    ('2023-11-11', 16, 480.00),
    ('2023-11-12', 18, 540.00),
    ('2023-11-13', 20, 600.00),
    ('2023-11-14', 22, 660.00),
    ('2023-11-15', 24, 720.00),
    ('2023-11-16', 26, 780.00),
    ('2023-11-17', 28, 840.00),
    ('2023-11-18', 30, 900.00),
    ('2023-11-19', 32, 960.00),
    ('2023-11-20', 34, 1020.00);

-- Sample data for quotation_line_item table
INSERT INTO quotation_line_item (quotation_id, tool_id, tool_quoted_qty, tool_price) VALUES
    (1, 1, 2, 30.00),
    (1, 2, 1, 40.00),
    (2, 3, 3, 30.00),
    (2, 4, 5, 40.00),
    (3, 5, 2, 30.00),
    (3, 6, 5, 40.00),
    (4, 7, 4, 30.00),
    (4, 8, 2, 40.00),
    (5, 9, 6, 30.00),
    (5, 10, 6, 40.00),
    (6, 11, 3, 30.00),
    (6, 12, 3, 40.00),
    (7, 13, 1, 30.00),
    (7, 14, 6, 40.00),
    (8, 15, 2, 30.00),
    (8, 16, 7, 40.00),
    (9, 17, 4, 30.00),
    (9, 18, 7, 40.00),
    (10, 19, 5, 30.00),
    (10, 20, 9, 40.00);

-- Sample data for purchase_order table
INSERT INTO purchase_order (quotation_id, company_id, order_date, tools_rented_qty, total_adjusted_price, gst, qst, final_price) VALUES
    (1, 1, '2023-11-01', 5, 150.00, 7.50, 8.50, 166.00),
    (2, 2, '2023-11-02', 8, 240.00, 12.00, 13.60, 265.60),
    (3, 3, '2023-11-03', 10, 300.00, 15.00, 17.00, 332.00),
    (4, 4, '2023-11-04', 6, 180.00, 9.00, 10.20, 199.20),
    (5, 5, '2023-11-05', 12, 360.00, 18.00, 20.40, 398.40),
    (6, 6, '2023-11-06', 15, 450.00, 22.50, 25.50, 498.00),
    (7, 7, '2023-11-07', 7, 210.00, 10.50, 11.90, 232.40),
    (8, 8, '2023-11-08', 9, 270.00, 13.50, 15.30, 298.80),
    (9, 9, '2023-11-09', 11, 330.00, 16.50, 18.70, 365.20),
    (10, 10, '2023-11-10', 14, 420.00, 21.00, 23.80, 464.80),
    (11, 11, '2023-11-11', 16, 480.00, 24.00, 27.20, 531.20),
    (12, 12, '2023-11-12', 18, 540.00, 27.00, 30.60, 598.60),
    (13, 13, '2023-11-13', 20, 600.00, 30.00, 34.00, 666.00),
    (14, 14, '2023-11-14', 22, 660.00, 33.00, 37.40, 733.40),
    (15, 15, '2023-11-15', 24, 720.00, 36.00, 40.80, 800.80),
    (16, 16, '2023-11-16', 26, 780.00, 39.00, 44.20, 868.20),
    (17, 17, '2023-11-17', 28, 840.00, 42.00, 47.60, 935.60),
    (18, 18, '2023-11-18', 30, 900.00, 45.00, 51.00, 1003.00),
    (19, 19, '2023-11-19', 32, 960.00, 48.00, 54.40, 1070.40),
    (20, 20, '2023-11-20', 34, 1020.00, 51.00, 57.80, 1137.80);

-- Sample data for purchase_order_line_item table
INSERT INTO purchase_order_line_item (purchase_order_id, tool_id, unit_scheduled_id, tool_rented_qty, tool_price) VALUES
    (1, 1, NULL, 2, 30.00),
    (1, 2, NULL, 1, 40.00),
    (2, 3, NULL, 3, 30.00),
    (2, 4, NULL, 5, 40.00),
    (3, 5, NULL, 2, 30.00),
    (3, 6, NULL, 5, 40.00),
    (4, 7, NULL, 4, 30.00),
    (4, 8, NULL, 2, 40.00),
    (5, 9, NULL, 6, 30.00),
    (5, 10, NULL, 6, 40.00),
    (6, 11, NULL, 3, 30.00),
    (6, 12, NULL, 3, 40.00),
    (7, 13, NULL, 1, 30.00),
    (7, 14, NULL, 6, 40.00),
    (8, 15, NULL, 2, 30.00),
    (8, 16, NULL, 7, 40.00),
    (9, 17, NULL, 4, 30.00),
    (9, 18, NULL, 7, 40.00),
    (10, 19, NULL, 5, 30.00),
    (10, 20, NULL, 9, 40.00);

-- Populate availability_status table with mock data
INSERT INTO availability_status (availability_status_name)
VALUES
    ('available'),
    ('rented'),
    ('requires_calibration'),
    ('out_of_commission');

-- Sample data for unit_scheduler table
INSERT INTO unit_scheduler (unit_id, unavailable_start_date, unavailable_end_date, availability_status_id, unit_recalibration_flag_id) VALUES
    (1, '2023-11-01', '2023-11-05', 3, NULL),
    (2, '2023-11-02', '2023-11-06', 2, NULL),
    (3, '2023-11-03', '2023-11-07', 4, NULL),
    (4, '2023-11-04', '2023-11-08', 1, NULL),
    (5, '2023-11-05', '2023-11-09', 3, NULL),
    (6, '2023-11-06', '2023-11-10', 2, NULL),
    (7, '2023-11-07', '2023-11-11', 4, NULL),
    (8, '2023-11-08', '2023-11-12', 1, NULL),
    (9, '2023-11-09', '2023-11-13', 3, NULL),
    (10, '2023-11-10', '2023-11-14', 2, NULL),
    (11, '2023-11-11', '2023-11-15', 4, NULL),
    (12, '2023-11-12', '2023-11-16', 1, NULL),
    (13, '2023-11-13', '2023-11-17', 3, NULL),
    (14, '2023-11-14', '2023-11-18', 2, NULL),
    (15, '2023-11-15', '2023-11-19', 4, NULL),
    (16, '2023-11-16', '2023-11-20', 1, NULL),
    (17, '2023-11-17', '2023-11-21', 3, NULL),
    (18, '2023-11-18', '2023-11-22', 2, NULL),
    (19, '2023-11-19', '2023-11-23', 4, NULL),
    (20, '2023-11-20', '2023-11-24', 1, NULL);

-- Update unit_scheduled_id in purchase_order_line_item table to reference unit_scheduler rows
UPDATE purchase_order_line_item SET unit_scheduled_id = 1 WHERE purchase_order_id = 1;
UPDATE purchase_order_line_item SET unit_scheduled_id = 2 WHERE purchase_order_id = 2;
UPDATE purchase_order_line_item SET unit_scheduled_id = 3 WHERE purchase_order_id = 3;
UPDATE purchase_order_line_item SET unit_scheduled_id = 4 WHERE purchase_order_id = 4;
UPDATE purchase_order_line_item SET unit_scheduled_id = 5 WHERE purchase_order_id = 5;
UPDATE purchase_order_line_item SET unit_scheduled_id = 6 WHERE purchase_order_id = 6;
UPDATE purchase_order_line_item SET unit_scheduled_id = 7 WHERE purchase_order_id = 7;
UPDATE purchase_order_line_item SET unit_scheduled_id = 8 WHERE purchase_order_id = 8;
UPDATE purchase_order_line_item SET unit_scheduled_id = 9 WHERE purchase_order_id = 9;
UPDATE purchase_order_line_item SET unit_scheduled_id = 10 WHERE purchase_order_id = 10;
UPDATE purchase_order_line_item SET unit_scheduled_id = 11 WHERE purchase_order_id = 11;
UPDATE purchase_order_line_item SET unit_scheduled_id = 12 WHERE purchase_order_id = 12;
UPDATE purchase_order_line_item SET unit_scheduled_id = 13 WHERE purchase_order_id = 13;
UPDATE purchase_order_line_item SET unit_scheduled_id = 14 WHERE purchase_order_id = 14;
UPDATE purchase_order_line_item SET unit_scheduled_id = 15 WHERE purchase_order_id = 15;
UPDATE purchase_order_line_item SET unit_scheduled_id = 16 WHERE purchase_order_id = 16;
UPDATE purchase_order_line_item SET unit_scheduled_id = 17 WHERE purchase_order_id = 17;
UPDATE purchase_order_line_item SET unit_scheduled_id = 18 WHERE purchase_order_id = 18;
UPDATE purchase_order_line_item SET unit_scheduled_id = 19 WHERE purchase_order_id = 19;
UPDATE purchase_order_line_item SET unit_scheduled_id = 20 WHERE purchase_order_id = 20;

-- Sample data for tool_restock_request table
INSERT INTO tool_restock_request (tool_id, notice_date, restock_notice_author, qty_requested) VALUES
    (1, '2023-11-01', 'Author1', 5),
    (2, '2023-11-02', 'Author2', 8),
    (3, '2023-11-03', 'Author3', 10),
    (4, '2023-11-04', 'Author4', 6),
    (5, '2023-11-05', 'Author5', 12),
    (6, '2023-11-06', 'Author6', 15),
    (7, '2023-11-07', 'Author7', 7),
    (8, '2023-11-08', 'Author8', 9),
    (9, '2023-11-09', 'Author9', 11),
    (10, '2023-11-10', 'Author10', 14),
    (11, '2023-11-11', 'Author11', 16),
    (12, '2023-11-12', 'Author12', 18),
    (13, '2023-11-13', 'Author13', 20),
    (14, '2023-11-14', 'Author14', 22),
    (15, '2023-11-15', 'Author15', 24),
    (16, '2023-11-16', 'Author16', 26),
    (17, '2023-11-17', 'Author17', 28),
    (18, '2023-11-18', 'Author18', 30),
    (19, '2023-11-19', 'Author19', 32),
    (20, '2023-11-20', 'Author20', 34);

-- Populate unit_recalibration_status table with mock data
INSERT INTO unit_recalibration_status (recal_status)
VALUES
    ('calibration_not_needed'),
    ('calibration_needed_soon'),
    ('calibration_needed_immediately');

-- Sample data for unit_recalibration_flag table
INSERT INTO unit_recalibration_flag (unit_id, unit_recalibration_status_id, flag_date, manual_flagger, flagger_name) VALUES
    (1, 1, '2023-11-01', true, 'Flagger1'),
    (2, 2, '2023-11-02', false, 'Flagger2'),
    (3, 3, '2023-11-03', true, 'Flagger3'),
    (4, 1, '2023-11-04', false, 'Flagger4'),
    (5, 2, '2023-11-05', true, 'Flagger5'),
    (6, 3, '2023-11-06', false, 'Flagger6'),
    (7, 1, '2023-11-07', true, 'Flagger7'),
    (8, 2, '2023-11-08', false, 'Flagger8'),
    (9, 3, '2023-11-09', true, 'Flagger9'),
    (10, 1, '2023-11-10', false, 'Flagger10'),
    (11, 2, '2023-11-11', true, 'Flagger11'),
    (12, 3, '2023-11-12', false, 'Flagger12'),
    (13, 1, '2023-11-13', true, 'Flagger13'),
    (14, 2, '2023-11-14', false, 'Flagger14'),
    (15, 3, '2023-11-15', true, 'Flagger15'),
    (16, 1, '2023-11-16', false, 'Flagger16'),
    (17, 2, '2023-11-17', true, 'Flagger17'),
    (18, 3, '2023-11-18', false, 'Flagger18'),
    (19, 1, '2023-11-19', true, 'Flagger19'),
    (20, 2, '2023-11-20', false, 'Flagger20');

-- Update unit_recalibration_flag_id in unit_scheduler table to reference unit_recalibration_flag rows
UPDATE unit_scheduler SET unit_recalibration_flag_id = 1 WHERE unit_id = 1;
UPDATE unit_scheduler SET unit_recalibration_flag_id = 2 WHERE unit_id = 2;
UPDATE unit_scheduler SET unit_recalibration_flag_id = 3 WHERE unit_id = 3;
UPDATE unit_scheduler SET unit_recalibration_flag_id = 4 WHERE unit_id = 4;
UPDATE unit_scheduler SET unit_recalibration_flag_id = 5 WHERE unit_id = 5;
UPDATE unit_scheduler SET unit_recalibration_flag_id = 6 WHERE unit_id = 6;
UPDATE unit_scheduler SET unit_recalibration_flag_id = 7 WHERE unit_id = 7;
UPDATE unit_scheduler SET unit_recalibration_flag_id = 8 WHERE unit_id = 8;
UPDATE unit_scheduler SET unit_recalibration_flag_id = 9 WHERE unit_id = 9;
UPDATE unit_scheduler SET unit_recalibration_flag_id = 10 WHERE unit_id = 10;
UPDATE unit_scheduler SET unit_recalibration_flag_id = 11 WHERE unit_id = 11;
UPDATE unit_scheduler SET unit_recalibration_flag_id = 12 WHERE unit_id = 12;
UPDATE unit_scheduler SET unit_recalibration_flag_id = 13 WHERE unit_id = 13;
UPDATE unit_scheduler SET unit_recalibration_flag_id = 14 WHERE unit_id = 14;
UPDATE unit_scheduler SET unit_recalibration_flag_id = 15 WHERE unit_id = 15;
UPDATE unit_scheduler SET unit_recalibration_flag_id = 16 WHERE unit_id = 16;
UPDATE unit_scheduler SET unit_recalibration_flag_id = 17 WHERE unit_id = 17;
UPDATE unit_scheduler SET unit_recalibration_flag_id = 18 WHERE unit_id = 18;
UPDATE unit_scheduler SET unit_recalibration_flag_id = 19 WHERE unit_id = 19;
UPDATE unit_scheduler SET unit_recalibration_flag_id = 20 WHERE unit_id = 20;

-- Populate unit_recalibration_schedule_type table with mock data
INSERT INTO unit_recalibration_schedule_type (recal_type_name)
VALUES
    ('hours_of_usage'),
    ('cycles_of_usage'),
    ('days_in_field'),
    ('days_since_calibrated');

-- Sample data for unit_recalibration_schedule table
INSERT INTO unit_recalibration_schedule (unit_recalibration_flag_id, unit_id, unit_scheduled_id, last_calibration_certificate_id, unit_recalibration_schedule_type_id, recal_type_counter, recal_start_date, recal_end_date) VALUES
    (1, 1, 1, NULL, 1, 12, '2023-11-01', '2023-11-05'),
    (2, 2, 2, NULL, 2, 13, '2023-11-02', '2023-11-06'),
    (3, 3, 3, NULL, 3, 14, '2023-11-03', '2023-11-07'),
    (4, 4, 4, NULL, 4, 15, '2023-11-04', '2023-11-08'),
    (5, 5, 5, NULL, 1, 16, '2023-11-05', '2023-11-09'),
    (6, 6, 6, NULL, 2, 17, '2023-11-06', '2023-11-10'),
    (7, 7, 7, NULL, 3, 18, '2023-11-07', '2023-11-11'),
    (8, 8, 8, NULL, 4, 19, '2023-11-08', '2023-11-12'),
    (9, 9, 9, NULL, 1, 20, '2023-11-09', '2023-11-13'),
    (10, 10, 10, NULL, 2, 21, '2023-11-10', '2023-11-14'),
    (11, 11, 11, NULL, 3, 22, '2023-11-11', '2023-11-15'),
    (12, 12, 12, NULL, 4, 23, '2023-11-12', '2023-11-16'),
    (13, 13, 13, NULL, 1, 24, '2023-11-13', '2023-11-17'),
    (14, 14, 14, NULL, 2, 25, '2023-11-14', '2023-11-18'),
    (15, 15, 15, NULL, 3, 26, '2023-11-15', '2023-11-19'),
    (16, 16, 16, NULL, 4, 27, '2023-11-16', '2023-11-20'),
    (17, 17, 17, NULL, 1, 28, '2023-11-17', '2023-11-21'),
    (18, 18, 18, NULL, 2, 29, '2023-11-18', '2023-11-22'),
    (19, 19, 19, NULL, 3, 30, '2023-11-19', '2023-11-23'),
    (20, 20, 20, NULL, 4, 31, '2023-11-20', '2023-11-24');

-- Sample data for unit_calibration_certificate table
INSERT INTO unit_calibration_certificate (unit_id, certification_date, recalibration_advised_date, calibration_signature) VALUES
    (1, '2023-11-01', '2023-11-02', 'Signature1'),
    (2, '2023-11-02', '2023-11-03', 'Signature2'),
    (3, '2023-11-03', '2023-11-04', 'Signature3'),
    (4, '2023-11-04', '2023-11-05', 'Signature4'),
    (5, '2023-11-05', '2023-11-06', 'Signature5'),
    (6, '2023-11-06', '2023-11-07', 'Signature6'),
    (7, '2023-11-07', '2023-11-08', 'Signature7'),
    (8, '2023-11-08', '2023-11-09', 'Signature8'),
    (9, '2023-11-09', '2023-11-10', 'Signature9'),
    (10, '2023-11-10', '2023-11-11', 'Signature10'),
    (11, '2023-11-11', '2023-11-12', 'Signature11'),
    (12, '2023-11-12', '2023-11-13', 'Signature12'),
    (13, '2023-11-13', '2023-11-14', 'Signature13'),
    (14, '2023-11-14', '2023-11-15', 'Signature14'),
    (15, '2023-11-15', '2023-11-16', 'Signature15'),
    (16, '2023-11-16', '2023-11-17', 'Signature16'),
    (17, '2023-11-17', '2023-11-18', 'Signature17'),
    (18, '2023-11-18', '2023-11-19', 'Signature18'),
    (19, '2023-11-19', '2023-11-20', 'Signature19'),
    (20, '2023-11-20', '2023-11-21', 'Signature20');

-- Update last_calibration_certificate_id in unit table to reference unit_calibration_certificate rows
UPDATE unit SET last_calibration_certificate_id = 1 WHERE unit_id = 1;
UPDATE unit SET last_calibration_certificate_id = 2 WHERE unit_id = 2;
UPDATE unit SET last_calibration_certificate_id = 3 WHERE unit_id = 3;
UPDATE unit SET last_calibration_certificate_id = 4 WHERE unit_id = 4;
UPDATE unit SET last_calibration_certificate_id = 5 WHERE unit_id = 5;
UPDATE unit SET last_calibration_certificate_id = 6 WHERE unit_id = 6;
UPDATE unit SET last_calibration_certificate_id = 7 WHERE unit_id = 7;
UPDATE unit SET last_calibration_certificate_id = 8 WHERE unit_id = 8;
UPDATE unit SET last_calibration_certificate_id = 9 WHERE unit_id = 9;
UPDATE unit SET last_calibration_certificate_id = 10 WHERE unit_id = 10;
UPDATE unit SET last_calibration_certificate_id = 11 WHERE unit_id = 11;
UPDATE unit SET last_calibration_certificate_id = 12 WHERE unit_id = 12;
UPDATE unit SET last_calibration_certificate_id = 13 WHERE unit_id = 13;
UPDATE unit SET last_calibration_certificate_id = 14 WHERE unit_id = 14;
UPDATE unit SET last_calibration_certificate_id = 15 WHERE unit_id = 15;
UPDATE unit SET last_calibration_certificate_id = 16 WHERE unit_id = 16;
UPDATE unit SET last_calibration_certificate_id = 17 WHERE unit_id = 17;
UPDATE unit SET last_calibration_certificate_id = 18 WHERE unit_id = 18;
UPDATE unit SET last_calibration_certificate_id = 19 WHERE unit_id = 19;
UPDATE unit SET last_calibration_certificate_id = 20 WHERE unit_id = 20;

-- Update last_calibration_certificate_id in unit_recalibration_schedule table to reference unit_calibration_certificate rows
UPDATE unit_recalibration_schedule SET last_calibration_certificate_id = 1 WHERE unit_recalibration_schedule_id = 1;
UPDATE unit_recalibration_schedule SET last_calibration_certificate_id = 2 WHERE unit_recalibration_schedule_id = 2;
UPDATE unit_recalibration_schedule SET last_calibration_certificate_id = 3 WHERE unit_recalibration_schedule_id = 3;
UPDATE unit_recalibration_schedule SET last_calibration_certificate_id = 4 WHERE unit_recalibration_schedule_id = 4;
UPDATE unit_recalibration_schedule SET last_calibration_certificate_id = 5 WHERE unit_recalibration_schedule_id = 5;
UPDATE unit_recalibration_schedule SET last_calibration_certificate_id = 6 WHERE unit_recalibration_schedule_id = 6;
UPDATE unit_recalibration_schedule SET last_calibration_certificate_id = 7 WHERE unit_recalibration_schedule_id = 7;
UPDATE unit_recalibration_schedule SET last_calibration_certificate_id = 8 WHERE unit_recalibration_schedule_id = 8;
UPDATE unit_recalibration_schedule SET last_calibration_certificate_id = 9 WHERE unit_recalibration_schedule_id = 9;
UPDATE unit_recalibration_schedule SET last_calibration_certificate_id = 10 WHERE unit_recalibration_schedule_id = 10;
UPDATE unit_recalibration_schedule SET last_calibration_certificate_id = 11 WHERE unit_recalibration_schedule_id = 11;
UPDATE unit_recalibration_schedule SET last_calibration_certificate_id = 12 WHERE unit_recalibration_schedule_id = 12;
UPDATE unit_recalibration_schedule SET last_calibration_certificate_id = 13 WHERE unit_recalibration_schedule_id = 13;
UPDATE unit_recalibration_schedule SET last_calibration_certificate_id = 14 WHERE unit_recalibration_schedule_id = 14;
UPDATE unit_recalibration_schedule SET last_calibration_certificate_id = 15 WHERE unit_recalibration_schedule_id = 15;
UPDATE unit_recalibration_schedule SET last_calibration_certificate_id = 16 WHERE unit_recalibration_schedule_id = 16;
UPDATE unit_recalibration_schedule SET last_calibration_certificate_id = 17 WHERE unit_recalibration_schedule_id = 17;
UPDATE unit_recalibration_schedule SET last_calibration_certificate_id = 18 WHERE unit_recalibration_schedule_id = 18;
UPDATE unit_recalibration_schedule SET last_calibration_certificate_id = 19 WHERE unit_recalibration_schedule_id = 19;
UPDATE unit_recalibration_schedule SET last_calibration_certificate_id = 20 WHERE unit_recalibration_schedule_id = 20;
