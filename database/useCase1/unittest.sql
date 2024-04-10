-- Load the pgTAP extension if not already loaded
CREATE EXTENSION IF NOT EXISTS pgtap;

BEGIN;

-- Plan the tests
SELECT plan(112);

-- Test 1: Check if schema exists
SELECT has_schema('app_rentals');

-- Test 2: Check if table exists and its columns (tool_type)
SELECT has_table('app_rentals', 'tool_type');
SELECT has_column('app_rentals', 'tool_type', 'type_id');
SELECT has_column('app_rentals', 'tool_type', 'type_name');
SELECT has_column('app_rentals', 'tool_type', 'type_category');

-- Test 3: Check if table exists and its columns (tool)
SELECT has_table('app_rentals', 'tool');
SELECT has_column('app_rentals', 'tool', 'tool_id');
SELECT has_column('app_rentals', 'tool', 'tool_type');
SELECT has_column('app_rentals', 'tool', 'tool_name');
SELECT has_column('app_rentals', 'tool', 'tool_price');
SELECT has_column('app_rentals', 'tool', 'tool_description');
SELECT has_column('app_rentals', 'tool', 'tool_qty_available');
SELECT has_column('app_rentals', 'tool', 'attachments');

-- Test 4: Check if table exists and its columns (unit)
SELECT has_table('app_rentals', 'unit');
SELECT has_column('app_rentals', 'unit', 'unit_id');
SELECT has_column('app_rentals', 'unit', 'tool_id');
SELECT has_column('app_rentals', 'unit', 'tool_type');
SELECT has_column('app_rentals', 'unit', 'unit_serial_number');
SELECT has_column('app_rentals', 'unit', 'unit_weight');
SELECT has_column('app_rentals', 'unit', 'unit_height');
SELECT has_column('app_rentals', 'unit', 'unit_condition');
SELECT has_column('app_rentals', 'unit', 'unit_available');
SELECT has_column('app_rentals', 'unit', 'unit_last_exited_date');
SELECT has_column('app_rentals', 'unit', 'unit_last_returned_date');
SELECT has_column('app_rentals', 'unit', 'last_calibration_certificate_id');

-- Test 5: Check if table exists and its columns (company)
SELECT has_table('app_rentals', 'company');
SELECT has_column('app_rentals', 'company', 'company_id');
SELECT has_column('app_rentals', 'company', 'company_name');
SELECT has_column('app_rentals', 'company', 'address');
SELECT has_column('app_rentals', 'company', 'primary_contact_id');
SELECT has_column('app_rentals', 'company', 'is_prev_customer');
SELECT has_column('app_rentals', 'company', 'pricing_rate');

-- Test 6: Check if table exists and its columns (contact)
SELECT has_table('app_rentals', 'contact');
SELECT has_column('app_rentals', 'contact', 'contact_id');
SELECT has_column('app_rentals', 'contact', 'company_id');
SELECT has_column('app_rentals', 'contact', 'first_name');
SELECT has_column('app_rentals', 'contact', 'last_name');
SELECT has_column('app_rentals', 'contact', 'full_name');
SELECT has_column('app_rentals', 'contact', 'contact_position');
SELECT has_column('app_rentals', 'contact', 'phone_number');
SELECT has_column('app_rentals', 'contact', 'email');
SELECT has_column('app_rentals', 'contact', 'active');

-- Test 7: Check if table exists and its columns (quotation)
SELECT has_table('app_rentals', 'quotation');
SELECT has_column('app_rentals', 'quotation', 'quotation_id');
SELECT has_column('app_rentals', 'quotation', 'quotation_date');
SELECT has_column('app_rentals', 'quotation', 'tools_quoted_qty');
SELECT has_column('app_rentals', 'quotation', 'totalprice');

-- Test 8: Check if table exists and its columns (quotation_line_item)
SELECT has_table('app_rentals', 'quotation_line_item');
SELECT has_column('app_rentals', 'quotation_line_item', 'quotation_id');
SELECT has_column('app_rentals', 'quotation_line_item', 'tool_id');
SELECT has_column('app_rentals', 'quotation_line_item', 'tool_quoted_qty');
SELECT has_column('app_rentals', 'quotation_line_item', 'tool_price');

-- Test 9: Check if table exists and its columns (purchase_order)
SELECT has_table('app_rentals', 'purchase_order');
SELECT has_column('app_rentals', 'purchase_order', 'purchase_order_id');
SELECT has_column('app_rentals', 'purchase_order', 'quotation_id');
SELECT has_column('app_rentals', 'purchase_order', 'company_id');
SELECT has_column('app_rentals', 'purchase_order', 'order_date');
SELECT has_column('app_rentals', 'purchase_order', 'tools_rented_qty');
SELECT has_column('app_rentals', 'purchase_order', 'total_adjusted_price');
SELECT has_column('app_rentals', 'purchase_order', 'gst');
SELECT has_column('app_rentals', 'purchase_order', 'qst');
SELECT has_column('app_rentals', 'purchase_order', 'final_price');

-- Test 10: Check if table exists and its columns (purchase_order_line_item)
SELECT has_table('app_rentals', 'purchase_order_line_item');
SELECT has_column('app_rentals', 'purchase_order_line_item', 'purchase_order_id');
SELECT has_column('app_rentals', 'purchase_order_line_item', 'tool_id');
SELECT has_column('app_rentals', 'purchase_order_line_item', 'unit_scheduled_id');
SELECT has_column('app_rentals', 'purchase_order_line_item', 'tool_rented_qty');
SELECT has_column('app_rentals', 'purchase_order_line_item', 'tool_price');

-- Test 11: Check if table exists and its columns (availability_status)
SELECT has_table('app_rentals', 'availability_status');
SELECT has_column('app_rentals', 'availability_status', 'availability_status_id');
SELECT has_column('app_rentals', 'availability_status', 'availability_status_name');

-- Test 12: Check if table exists and its columns (unit_scheduler)
SELECT has_table('app_rentals', 'unit_scheduler');
SELECT has_column('app_rentals', 'unit_scheduler', 'unit_scheduled_id');
SELECT has_column('app_rentals', 'unit_scheduler', 'unit_id');
SELECT has_column('app_rentals', 'unit_scheduler', 'unavailable_start_date');
SELECT has_column('app_rentals', 'unit_scheduler', 'unavailable_end_date');
SELECT has_column('app_rentals', 'unit_scheduler', 'availability_status_id');
SELECT has_column('app_rentals', 'unit_scheduler', 'unit_recalibration_flag_id');

-- Test 13: Check if table exists and its columns (tool_restock_request)
SELECT has_table('app_rentals', 'tool_restock_request');
SELECT has_column('app_rentals', 'tool_restock_request', 'tool_restock_request_id');
SELECT has_column('app_rentals', 'tool_restock_request', 'tool_id');
SELECT has_column('app_rentals', 'tool_restock_request', 'notice_date');
SELECT has_column('app_rentals', 'tool_restock_request', 'qty_requested');

-- Test 14: Check if table exists and its columns (unit_recalibration_status)
SELECT has_table('app_rentals', 'unit_recalibration_status');
SELECT has_column('app_rentals', 'unit_recalibration_status', 'unit_recalibration_status_id');
SELECT has_column('app_rentals', 'unit_recalibration_status', 'recal_status');

-- Test 15: Check if table exists and its columns (unit_recalibration_flag)
SELECT has_table('app_rentals', 'unit_recalibration_flag');
SELECT has_column('app_rentals', 'unit_recalibration_flag', 'unit_recalibration_flag_id');
SELECT has_column('app_rentals', 'unit_recalibration_flag', 'unit_id');
SELECT has_column('app_rentals', 'unit_recalibration_flag', 'unit_recalibration_status_id');
SELECT has_column('app_rentals', 'unit_recalibration_flag', 'flag_date');
SELECT has_column('app_rentals', 'unit_recalibration_flag', 'manual_flagger');
SELECT has_column('app_rentals', 'unit_recalibration_flag', 'flagger_name');

-- Test 16: Check if table exists and its columns (unit_recalibration_schedule_type)
SELECT has_table('app_rentals', 'unit_recalibration_schedule_type');
SELECT has_column('app_rentals', 'unit_recalibration_schedule_type', 'unit_recalibration_schedule_type_id');
SELECT has_column('app_rentals', 'unit_recalibration_schedule_type', 'recal_type_name');

-- Test 17: Check if table exists and its columns (unit_recalibration_schedule)
SELECT has_table('app_rentals', 'unit_recalibration_schedule');
SELECT has_column('app_rentals', 'unit_recalibration_schedule', 'unit_recalibration_schedule_id');
SELECT has_column('app_rentals', 'unit_recalibration_schedule', 'unit_recalibration_flag_id');
SELECT has_column('app_rentals', 'unit_recalibration_schedule', 'unit_id');
SELECT has_column('app_rentals', 'unit_recalibration_schedule', 'unit_scheduled_id');
SELECT has_column('app_rentals', 'unit_recalibration_schedule', 'last_calibration_certificate_id');
SELECT has_column('app_rentals', 'unit_recalibration_schedule', 'unit_recalibration_schedule_type_id');
SELECT has_column('app_rentals', 'unit_recalibration_schedule', 'recal_type_counter');
SELECT has_column('app_rentals', 'unit_recalibration_schedule', 'recal_start_date');
SELECT has_column('app_rentals', 'unit_recalibration_schedule', 'recal_end_date');

-- Test 18: Check if table exists and its columns (unit_calibration_certificate)
SELECT has_table('app_rentals', 'unit_calibration_certificate');
SELECT has_column('app_rentals', 'unit_calibration_certificate', 'unit_calibration_certificate_id');
SELECT has_column('app_rentals', 'unit_calibration_certificate', 'unit_id');
SELECT has_column('app_rentals', 'unit_calibration_certificate', 'certification_date');
SELECT has_column('app_rentals', 'unit_calibration_certificate', 'recalibration_advised_date');
SELECT has_column('app_rentals', 'unit_calibration_certificate', 'calibration_signature');

-- Finish the tests
SELECT * FROM finish();
