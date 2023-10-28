-- Populate tool_type table with mock data
INSERT INTO tool_type (type_name, type_category)
VALUES
    ('Hand Tool', 'General'),
    ('Power Tool', 'General'),
    ('Garden Tool', 'General'),
    ('Construction Tool', 'General'),
    ('Painting Tool', 'General'),
    ('Plumbing Tool', 'General'),
    ('Electrical Tool', 'General'),
    ('Woodworking Tool', 'General'),
    ('Metalworking Tool', 'General'),
    ('Cleaning Tool', 'General'),
    ('Measuring Tool', 'General'),
    ('Safety Equipment', 'General'),
    ('Welding Tool', 'General'),
    ('HVAC Tool', 'General'),
    ('Automotive Tool', 'General'),
    ('Masonry Tool', 'General'),
    ('Carpentry Tool', 'General'),
    ('Landscaping Tool', 'General'),
    ('Roofing Tool', 'General'),
    ('Flooring Tool', 'General');

-- Populate tool table with mock data
INSERT INTO tool (tool_type, tool_name, tool_price, tool_description, tool_qty_available)
SELECT
    type_id,
    'Tool ' || generate_series(1, 20),
    (100 * random())::numeric::money,
    'Description for Tool ' || generate_series(1, 20),
    floor(1 + (10 - 1 + 1) * random())
FROM tool_type;

-- Populate purchase_order table with mock data
INSERT INTO purchase_order (quotation_id, company_id, order_date, tools_rented_qty, total_adjusted_price, gst, qst, final_price)
SELECT
    quotation_id,
    company_id,
    current_timestamp - (interval '15 days' * random()),
    floor(1 + (10 - 1 + 1) * random()),
    (2000 * random())::numeric::money, 
    (100 * random())::numeric::money,  
    (50 * random())::numeric::money,  
    (2500 * random())::numeric::money  
FROM quotation
CROSS JOIN company
LIMIT 20;

-- Populate quotation_line_item table with mock data
INSERT INTO quotation_line_item (quotation_id, tool_id, tool_quoted_qty, tool_price)
SELECT
    quotation_id,
    tool_id,
    floor(1 + (5 - 1 + 1) * random()),
    (100 * random())::numeric::money
FROM quotation
CROSS JOIN tool
LIMIT 20;

-- Populate purchase_order_line_item table with mock data and generate random monetary values
INSERT INTO purchase_order_line_item (purchase_order_id, tool_id, unit_scheduled_id, tool_rented_qty, tool_price)
SELECT
    purchase_order_id,
    tool_id,
    floor(1 + (20 - 1 + 1) * random()),
    floor(1 + (5 - 1 + 1) * random()),
    (100 * random())::numeric::money 
FROM purchase_order
CROSS JOIN tool
LIMIT 20; 

-- Populate tool_restock_request table with mock data
INSERT INTO tool_restock_request (tool_id, notice_date, restock_notice_author, qty_requested)
SELECT
    tool_id,
    current_timestamp - (interval '15 days' * random()),
    'Author ' || generate_series(1, 20),
    floor(1 + (5 - 1 + 1) * random())
FROM tool;

-- Populate availability_status table with mock data
INSERT INTO availability_status (availability_status_name)
VALUES
    ('available'),
    ('rented'),
    ('requires_calibration'),
    ('out_of_commission');

-- Populate unit_recalibration_status table with mock data
INSERT INTO unit_recalibration_status (recal_status)
VALUES
    ('calibration_not_needed'),
    ('calibration_needed_soon'),
    ('calibration_needed_immediately');

-- Populate unit_recalibration_schedule_type table with mock data
INSERT INTO unit_recalibration_schedule_type (recal_type_name)
VALUES
    ('hours_of_usage'),
    ('cycles_of_usage'),
    ('days_in_field'),
    ('days_since_calibrated');

-- Populate unit_recalibration_flag table with mock data
INSERT INTO unit_recalibration_flag (unit_id, unit_recalibration_status_id, flag_date, manual_flagger, flagger_name)
SELECT
    unit_id,
    CASE floor(1 + (3 - 1 + 1) * random())
        WHEN 1 THEN 1
        WHEN 2 THEN 2
        WHEN 3 THEN 3
    END,
    current_timestamp - (interval '30 days' * random()),
    CASE floor(1 + (2 - 1 + 1) * random())
        WHEN 1 THEN TRUE
        WHEN 2 THEN FALSE
    END,
    'Flagger ' || generate_series(1, 20)
FROM unit;

-- Populate unit_calibration_certificate table with mock data
INSERT INTO unit_calibration_certificate (unit_id, certification_date, recalibration_advised_date, calibration_signature)
SELECT
    unit_id,
    current_timestamp - (interval '60 days' * random()),
    current_timestamp - (interval '30 days' * random()),
    'Calibration Signature ' || generate_series(1, 20)
FROM unit;

-- Populate unit_recalibration_schedule table with mock data
INSERT INTO unit_recalibration_schedule (unit_recalibration_flag_id, unit_id, last_calibration_certificate_id, unit_scheduled_id, unit_recalibration_schedule_type_id, recal_type_counter, recal_start_date, recal_end_date)
SELECT
    floor(1 + (20 - 1 + 1) * random()),
    unit_id,
    floor(1 + (20 - 1 + 1) * random()),
    floor(1 + (20 - 1 + 1) * random()),
    floor(1 + (4 - 1 + 1) * random()),
    floor(1 + (5 - 1 + 1) * random()),
    current_timestamp - (interval '30 days' * random()),
    current_timestamp - (interval '15 days' * random())
FROM unit_recalibration_flag;

-- Populate unit_scheduler table with mock data
INSERT INTO unit_scheduler (unit_id, unavailable_start_date, unavailable_end_date, availability_status_id, unit_recalibration_flag_id)
SELECT
    unit_id,
    current_timestamp - (interval '10 days' * random()),
    current_timestamp - (interval '5 days' * random()),
    CASE floor(1 + (4 - 1 + 1) * random())
        WHEN 1 THEN 1
        WHEN 2 THEN 2
        WHEN 3 THEN 3
        WHEN 4 THEN 4
    END,
    floor(1 + (20 - 1 + 1) * random())
FROM unit;