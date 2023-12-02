-- SCHEMA: app_rentals

DROP SCHEMA IF EXISTS app_rentals CASCADE ;

CREATE SCHEMA IF NOT EXISTS app_rentals ;

GRANT USAGE ON SCHEMA app_rentals TO web_anon;

CREATE OR REPLACE FUNCTION my_concat_immutable(text, text)
RETURNS text LANGUAGE SQL IMMUTABLE AS $$
    SELECT COALESCE($1, '') || ' ' || COALESCE($2, '');
$$;


CREATE TABLE tool_type (
    type_id serial PRIMARY KEY,
    type_name text,
    type_category text
);
COMMENT ON TABLE tool_type IS '{"displayField": "type_name"}';
COMMENT ON COLUMN tool_type.type_name IS '{"reqOnCreate": true}';
COMMENT ON COLUMN tool_type.type_category IS '{"reqOnCreate": true}';

CREATE TABLE tool (
    tool_id serial PRIMARY KEY,
    tool_type int REFERENCES tool_type(type_id),
    tool_name text,
    tool_price money,
    tool_description text,
    tool_qty_available int
);
COMMENT ON TABLE tool IS '{"displayField": "tool_name"}';
COMMENT ON COLUMN tool.tool_type IS '{"reqOnCreate": true, "refTable": "tool_type"}';
COMMENT ON COLUMN tool.tool_name IS '{"reqOnCreate": true}';
COMMENT ON COLUMN tool.tool_price IS '{"reqOnCreate": true}';
COMMENT ON COLUMN tool.tool_description IS '{"reqOnCreate": true}';
COMMENT ON COLUMN tool.tool_qty_available IS '{"reqOnCreate": true}';

CREATE TABLE unit (
    unit_id serial PRIMARY KEY,
    tool_id int REFERENCES tool(tool_id),
    tool_type int REFERENCES tool_type(type_id),
    unit_serial_number text,
    unit_weight real,
    unit_height real,
    unit_condition text,
    unit_available boolean,
    unit_last_exited_date timestamp,
    unit_last_returned_date timestamp,
    last_calibration_certificate_id int
);
COMMENT ON TABLE unit IS '{"displayField": "unit_serial_number"}';
COMMENT ON COLUMN unit.tool_id IS '{"reqOnCreate": true, "refTable": "tool"}';
COMMENT ON COLUMN unit.tool_type IS '{"reqOnCreate": true, "refTable": "tool_type"}';
COMMENT ON COLUMN unit.unit_serial_number IS '{"reqOnCreate": true}';
COMMENT ON COLUMN unit.unit_weight IS '{"reqOnCreate": true}';
COMMENT ON COLUMN unit.unit_height IS '{"reqOnCreate": true}';
COMMENT ON COLUMN unit.unit_condition IS '{"reqOnCreate": true}';
COMMENT ON COLUMN unit.unit_available IS '{"reqOnCreate": true}';
COMMENT ON COLUMN unit.unit_last_exited_date IS '{"reqOnCreate": true}';
COMMENT ON COLUMN unit.unit_last_returned_date IS '{"reqOnCreate": true}';
COMMENT ON COLUMN unit.last_calibration_certificate_id IS '{"reqOnCreate": true, "refTable": "unit_calibration_certificate"}';

CREATE TABLE company (
    company_id serial PRIMARY KEY,
    company_name text,
    address text,
    primary_contact_id int,
    is_prev_customer boolean,
    pricing_rate real
);
COMMENT ON TABLE company IS '{"displayField": "company_name"}';
COMMENT ON COLUMN company.company_name IS '{"reqOnCreate": true}';
COMMENT ON COLUMN company.address IS '{"reqOnCreate": true}';
COMMENT ON COLUMN company.primary_contact_id IS '{"reqOnCreate": true, "refTable": "contact"}';
COMMENT ON COLUMN company.is_prev_customer IS '{"reqOnCreate": true}';
COMMENT ON COLUMN company.pricing_rate IS '{"reqOnCreate": true}';

CREATE TABLE contact (
    contact_id serial PRIMARY KEY,
    company_id int REFERENCES company(company_id),
    first_name text,
    last_name text,
    full_name text GENERATED ALWAYS AS (my_concat_immutable(first_name, last_name)) STORED,
    contact_position text,
    phone_number text,
    email text,
    active boolean
);
COMMENT ON TABLE contact IS '{"displayField": "fullname"}';
COMMENT ON COLUMN contact.company_id IS '{"reqOnCreate": true, "refTable": "company"}';
COMMENT ON COLUMN contact.first_name IS '{"reqOnCreate": true}';
COMMENT ON COLUMN contact.last_name IS '{"reqOnCreate": true}';
COMMENT ON COLUMN contact.contact_position IS '{"reqOnCreate": true}';
COMMENT ON COLUMN contact.phone_number IS '{"reqOnCreate": true}';
COMMENT ON COLUMN contact.email IS '{"reqOnCreate": true}';
COMMENT ON COLUMN contact.active IS '{"reqOnCreate": true}';

ALTER TABLE company ADD CONSTRAINT fk_prim_contact
    FOREIGN KEY (primary_contact_id) REFERENCES contact(contact_id);

--generated columns not working for now, need more time to investigate
CREATE TABLE quotation (
    quotation_id serial PRIMARY KEY,
    quotation_date timestamp NOT NULL,
    --quotation_name text GENERATED ALWAYS AS (my_concat_immutable(cast(quotation_id as text), cast(quotation_date as text))) STORED,
    tools_quoted_qty int,
    totalprice money
);
COMMENT ON TABLE quotation IS '{"displayField": "quotation_id"}';
COMMENT ON COLUMN quotation.quotation_date IS '{"reqOnCreate": true}';
COMMENT ON COLUMN quotation.tools_quoted_qty IS '{"reqOnCreate": true}';
COMMENT ON COLUMN quotation.totalprice IS '{"reqOnCreate": true}';

--should only exist as a lookup table, no need for display field (to discuss with Eddy)
CREATE TABLE quotation_line_item (
    quotation_id int REFERENCES quotation(quotation_id),
    tool_id int REFERENCES tool(tool_id),
    tool_quoted_qty int,
    tool_price money,
    PRIMARY KEY (quotation_id, tool_id)
);
COMMENT ON COLUMN quotation_line_item.quotation_id IS '{"reqOnCreate": true, "refTable": "quotation"}';
COMMENT ON COLUMN quotation_line_item.tool_id IS '{"reqOnCreate": true, "refTable": "tool"}';
COMMENT ON COLUMN quotation_line_item.tool_quoted_qty IS '{"reqOnCreate": true}';
COMMENT ON COLUMN quotation_line_item.tool_price IS '{"reqOnCreate": true}';

--generated columns not working for now, need more time to investigate
CREATE TABLE purchase_order (
    purchase_order_id serial PRIMARY KEY,
    quotation_id int REFERENCES quotation(quotation_id),
    company_id int REFERENCES company(company_id),
    order_date timestamp,
    --purchase_order_name text GENERATED ALWAYS AS (my_concat_immutable(purchase_order_id, order_date)) STORED,
    tools_rented_qty int,
    total_adjusted_price money NOT NULL,
    gst money NOT NULL GENERATED ALWAYS AS (total_adjusted_price * 0.05) STORED,
    qst money NOT NULL GENERATED ALWAYS AS (total_adjusted_price * 0.9975) STORED,
    final_price money GENERATED ALWAYS AS (total_adjusted_price + (total_adjusted_price * 0.05) + (total_adjusted_price * 0.9975)) STORED
);
COMMENT ON TABLE purchase_order IS '{"displayField": "purchase_order_id"}';
COMMENT ON COLUMN purchase_order.quotation_id IS '{"reqOnCreate": true, "refTable": "quotation"}';
COMMENT ON COLUMN purchase_order.company_id IS '{"reqOnCreate": true, "refTable": "company"}';
COMMENT ON COLUMN purchase_order.order_date IS '{"reqOnCreate": true}';
COMMENT ON COLUMN purchase_order.tools_rented_qty IS '{"reqOnCreate": true}';
COMMENT ON COLUMN purchase_order.total_adjusted_price IS '{"reqOnCreate": true}';

--should only exist as a lookup table, no need for display field (to discuss with Eddy)
CREATE TABLE purchase_order_line_item (
    purchase_order_id int REFERENCES purchase_order(purchase_order_id),
    tool_id int REFERENCES tool(tool_id),
    unit_scheduled_id int,
    tool_rented_qty int,
    tool_price money,
    PRIMARY KEY (purchase_order_id, tool_id)
);
COMMENT ON COLUMN purchase_order_line_item.purchase_order_id IS '{"reqOnCreate": true, "refTable": "purchase_order"}';
COMMENT ON COLUMN purchase_order_line_item.tool_id IS '{"reqOnCreate": true, "refTable": "tool"}';
COMMENT ON COLUMN purchase_order_line_item.unit_scheduled_id IS '{"reqOnCreate": true, "refTable": "true"}';
COMMENT ON COLUMN purchase_order_line_item.tool_rented_qty IS '{"reqOnCreate": true}';
COMMENT ON COLUMN purchase_order_line_item.tool_price IS '{"reqOnCreate": true}';

--enum table
CREATE TABLE availability_status (
    availability_status_id serial PRIMARY KEY,
    availability_status_name text
);
COMMENT ON TABLE availability_status IS '{"displayField": "availability_status_name"}';
COMMENT ON COLUMN availability_status.availability_status_name IS '{"reqOnCreate": true}';

--generated columns not working for now, need more time to investigate
CREATE TABLE unit_scheduler (
    unit_scheduled_id serial PRIMARY KEY,
    unit_id int REFERENCES unit(unit_id) NOT NULL,
    unavailable_start_date timestamp,
    unavailable_end_date timestamp,
    --unit_scheduled_name text GENERATED ALWAYS AS (my_concat_immutable(unit_id, unavailable_start_date)) STORED,
    availability_status_id int REFERENCES availability_status(availability_status_id),
    unit_recalibration_flag_id int
);
COMMENT ON TABLE unit_scheduler IS '{"displayField": "unit_scheduled_id"}';
COMMENT ON COLUMN unit_scheduler.unit_id IS '{"reqOnCreate": true, "refTable": "unit"}';
COMMENT ON COLUMN unit_scheduler.unavailable_start_date IS '{"reqOnCreate": true}';
COMMENT ON COLUMN unit_scheduler.unavailable_end_date IS '{"reqOnCreate": true}';
COMMENT ON COLUMN unit_scheduler.availability_status_id IS '{"reqOnCreate": true, "refTable": "availability_status"}';
COMMENT ON COLUMN unit_scheduler.unit_recalibration_flag_id IS '{"reqOnCreate": true, "refTable": "unit_recalibration_flag"}';

ALTER TABLE purchase_order_line_item ADD CONSTRAINT fk_purchase_order_line_item_unit_scheduler
    FOREIGN KEY (unit_scheduled_id) REFERENCES unit_scheduler(unit_scheduled_id);

--generated columns not working for now, need more time to investigate
CREATE TABLE tool_restock_request (
    tool_restock_request_id serial PRIMARY KEY,
    tool_id int REFERENCES tool(tool_id) NOT NULL,
    notice_date timestamp,
    --tool_restock_name text GENERATED ALWAYS AS (my_concat_immutable(tool_id, notice_date)) STORED,
    restock_notice_author text,
    qty_requested int
);
COMMENT ON TABLE tool_restock_request IS '{"displayField": "tool_restock_request_id"}';
COMMENT ON COLUMN tool_restock_request.tool_id IS '{"reqOnCreate": true, "refTable": "tool"}';
COMMENT ON COLUMN tool_restock_request.notice_date IS '{"reqOnCreate": true}';
COMMENT ON COLUMN tool_restock_request.restock_notice_author IS '{"reqOnCreate": true}';
COMMENT ON COLUMN tool_restock_request.qty_requested IS '{"reqOnCreate": true}';

--enum table
CREATE TABLE unit_recalibration_status (
    unit_recalibration_status_id serial PRIMARY KEY,
    recal_status text
);
COMMENT ON TABLE unit_recalibration_status IS '{"displayField": "recal_status"}';
COMMENT ON COLUMN unit_recalibration_status.recal_status IS '{"reqOnCreate": true}';

--generated columns not working for now, need more time to investigate
CREATE TABLE unit_recalibration_flag (
    unit_recalibration_flag_id serial PRIMARY KEY,
    unit_id int REFERENCES unit(unit_id) NOT NULL,
    unit_recalibration_status_id int REFERENCES unit_recalibration_status(unit_recalibration_status_id),
    flag_date timestamp NOT NULL,
    --unit_recalibration_flag_name text GENERATED ALWAYS AS (my_concat_immutable(unit_id, flag_date)) STORED,
    manual_flagger boolean,
    flagger_name text
);
COMMENT ON TABLE unit_recalibration_flag IS '{"displayField": "unit_recalibration_flag_id"}';
COMMENT ON COLUMN unit_recalibration_flag.unit_id IS '{"reqOnCreate": true, "refTable": "unit"}';
COMMENT ON COLUMN unit_recalibration_flag.unit_recalibration_status_id IS '{"reqOnCreate": true, "refTable": "unit_recalibration_status"}';
COMMENT ON COLUMN unit_recalibration_flag.flag_date IS '{"reqOnCreate": true}';
COMMENT ON COLUMN unit_recalibration_flag.manual_flagger IS '{"reqOnCreate": true}';
COMMENT ON COLUMN unit_recalibration_flag.flagger_name IS '{"reqOnCreate": true}';

ALTER TABLE unit_scheduler ADD CONSTRAINT fk_unit_scheduler_recal_flag
    FOREIGN KEY (unit_recalibration_flag_id) REFERENCES unit_recalibration_flag(unit_recalibration_flag_id);

--enum table
CREATE TABLE unit_recalibration_schedule_type (
    unit_recalibration_schedule_type_id serial PRIMARY KEY,
    recal_type_name text
);
COMMENT ON TABLE unit_recalibration_schedule_type IS '{"displayField": "recal_type_name"}';
COMMENT ON COLUMN unit_recalibration_schedule_type.recal_type_name IS '{"reqOnCreate": true}';

--generated columns not working for now, need more time to investigate
CREATE TABLE unit_recalibration_schedule (
    unit_recalibration_schedule_id serial PRIMARY KEY,
    unit_recalibration_flag_id int REFERENCES unit_recalibration_flag(unit_recalibration_flag_id),
    unit_id int REFERENCES unit(unit_id) NOT NULL,
    unit_scheduled_id int REFERENCES unit_scheduler(unit_scheduled_id),
    last_calibration_certificate_id int,
    unit_recalibration_schedule_type_id int REFERENCES unit_recalibration_schedule_type(unit_recalibration_schedule_type_id),
    --the counter is to count the amount of the type above (e.g. number of cycles)
    recal_type_counter int,
    recal_start_date timestamp,
    recal_end_date timestamp
    --unit_recalibration_schedule_name text GENERATED ALWAYS AS (my_concat_immutable(unit_id, recal_start_date)) STORED
);
COMMENT ON TABLE unit_recalibration_schedule IS '{"displayField": "unit_recalibration_schedule_id"}';
COMMENT ON COLUMN unit_recalibration_schedule.unit_recalibration_flag_id IS '{"reqOnCreate": true, "refTable": "unit_recalibration_flag"}';
COMMENT ON COLUMN unit_recalibration_schedule.unit_id IS '{"reqOnCreate": true, "refTable": "unit"}';
COMMENT ON COLUMN unit_recalibration_schedule.unit_scheduled_id IS '{"reqOnCreate": true, "refTable": "unit_scheduler"}';
COMMENT ON COLUMN unit_recalibration_schedule.last_calibration_certificate_id IS '{"reqOnCreate": true, "refTable": "unit_calibration_certificate"}';
COMMENT ON COLUMN unit_recalibration_schedule.unit_recalibration_schedule_type_id IS '{"reqOnCreate": true, "refTable": "unit_recalibration_schedule_type"}';
COMMENT ON COLUMN unit_recalibration_schedule.recal_type_counter IS '{"reqOnCreate": true}';
COMMENT ON COLUMN unit_recalibration_schedule.recal_start_date IS '{"reqOnCreate": true}';
COMMENT ON COLUMN unit_recalibration_schedule.recal_end_date IS '{"reqOnCreate": true}';

--generated columns not working for now, need more time to investigate
CREATE TABLE unit_calibration_certificate (
    unit_calibration_certificate_id serial PRIMARY KEY,
    unit_id int REFERENCES unit(unit_id) NOT NULL,
    certification_date timestamp,
    --unit_calibration_certificate_name text GENERATED ALWAYS AS (my_concat_immutable(unit_id, certification_date)) STORED,
    recalibration_advised_date timestamp,
    calibration_signature text
);
COMMENT ON TABLE unit_calibration_certificate IS '{"displayField": "unit_calibration_certificate_id"}';
COMMENT ON COLUMN unit_calibration_certificate.unit_id IS '{"reqOnCreate": true, "refTable": "unit"}';
COMMENT ON COLUMN unit_calibration_certificate.certification_date IS '{"reqOnCreate": true}';
COMMENT ON COLUMN unit_calibration_certificate.recalibration_advised_date IS '{"reqOnCreate": true}';
COMMENT ON COLUMN unit_calibration_certificate.calibration_signature IS '{"reqOnCreate": true}';

ALTER TABLE unit ADD CONSTRAINT fk_unit_cal_cert
    FOREIGN KEY (last_calibration_certificate_id) REFERENCES unit_calibration_certificate(unit_calibration_certificate_id);

ALTER TABLE unit_recalibration_schedule ADD CONSTRAINT fk_unit_cal_cert_schedule
    FOREIGN KEY (last_calibration_certificate_id) REFERENCES unit_calibration_certificate(unit_calibration_certificate_id);

GRANT ALL ON app_rentals.tool_type TO web_anon;
GRANT ALL ON app_rentals.tool TO web_anon;
GRANT ALL ON app_rentals.unit TO web_anon;
GRANT ALL ON app_rentals.company TO web_anon;
GRANT ALL ON app_rentals.contact TO web_anon;
GRANT ALL ON app_rentals.quotation TO web_anon;
GRANT ALL ON app_rentals.quotation_line_item TO web_anon;
GRANT ALL ON app_rentals.purchase_order TO web_anon;
GRANT ALL ON app_rentals.purchase_order_line_item TO web_anon;
GRANT ALL ON app_rentals.availability_status TO web_anon;
GRANT ALL ON app_rentals.unit_scheduler TO web_anon;
GRANT ALL ON app_rentals.tool_restock_request TO web_anon;
GRANT ALL ON app_rentals.unit_recalibration_status TO web_anon;
GRANT ALL ON app_rentals.unit_recalibration_flag TO web_anon;
GRANT ALL ON app_rentals.unit_recalibration_schedule_type TO web_anon;
GRANT ALL ON app_rentals.unit_recalibration_schedule TO web_anon;
GRANT ALL ON app_rentals.unit_calibration_certificate TO web_anon;