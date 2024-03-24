-- SCHEMA: app_rentals

DROP SCHEMA IF EXISTS app_rentals CASCADE;

CREATE SCHEMA IF NOT EXISTS app_rentals;

GRANT USAGE ON SCHEMA app_rentals TO "user";

NOTIFY pgrst, 'reload config';
NOTIFY pgrst, 'reload schema';

CREATE OR REPLACE FUNCTION my_concat_immutable(text, text)
RETURNS text LANGUAGE SQL IMMUTABLE AS $$
    SELECT COALESCE($1, '') || ' ' || COALESCE($2, '');
$$;


CREATE TABLE app_rentals.tool_type (
    type_id serial PRIMARY KEY,
    type_name text,
    type_category text
);
COMMENT ON TABLE app_rentals.tool_type IS '{"displayField": "type_name"}';
COMMENT ON COLUMN app_rentals.tool_type.type_name IS '{"reqOnCreate": true}';
COMMENT ON COLUMN app_rentals.tool_type.type_category IS '{"reqOnCreate": true}';

CREATE TABLE app_rentals.tool (
    tool_id serial PRIMARY KEY,
    tool_type int REFERENCES app_rentals.tool_type(type_id),
    tool_name text,
    tool_price money,
    tool_description text,
    tool_qty_available int,
    attachments int REFERENCES filemanager.filegroup(id) ON DELETE SET NULL
);
COMMENT ON TABLE app_rentals.tool IS '{"displayField": "tool_name"}';
COMMENT ON COLUMN app_rentals.tool.tool_type IS '{"reqOnCreate": true, "refTable": "app_rentals.tool_type"}';
COMMENT ON COLUMN app_rentals.tool.tool_name IS '{"reqOnCreate": true}';
COMMENT ON COLUMN app_rentals.tool.tool_price IS '{"reqOnCreate": true}';
COMMENT ON COLUMN app_rentals.tool.tool_description IS '{"reqOnCreate": true}';
COMMENT ON COLUMN app_rentals.tool.tool_qty_available IS '{"reqOnCreate": true}';

CREATE TABLE app_rentals.unit (
    unit_id serial PRIMARY KEY,
    tool_id int REFERENCES app_rentals.tool(tool_id),
    tool_type int REFERENCES app_rentals.tool_type(type_id),
    unit_serial_number text,
    unit_weight real,
    unit_height real,
    unit_condition text,
    unit_available boolean,
    unit_last_exited_date timestamp,
    unit_last_returned_date timestamp,
    last_calibration_certificate_id int
);
COMMENT ON TABLE app_rentals.unit IS '{"displayField": "unit_serial_number"}';
COMMENT ON COLUMN app_rentals.unit.unit_id IS '{"reqOnCreate": true, "refTable": "app_rentals.tool"}';
COMMENT ON COLUMN app_rentals.unit.tool_type IS '{"reqOnCreate": true, "refTable": "app_rentals.tool_type"}';
COMMENT ON COLUMN app_rentals.unit.unit_serial_number IS '{"reqOnCreate": true}';
COMMENT ON COLUMN app_rentals.unit.unit_weight IS '{"reqOnCreate": true}';
COMMENT ON COLUMN app_rentals.unit.unit_height IS '{"reqOnCreate": true}';
COMMENT ON COLUMN app_rentals.unit.unit_condition IS '{"reqOnCreate": true}';
COMMENT ON COLUMN app_rentals.unit.unit_available IS '{"reqOnCreate": true}';
COMMENT ON COLUMN app_rentals.unit.unit_last_exited_date IS '{"reqOnCreate": true}';
COMMENT ON COLUMN app_rentals.unit.unit_last_returned_date IS '{"reqOnCreate": true}';
COMMENT ON COLUMN app_rentals.unit.last_calibration_certificate_id IS '{"reqOnCreate": true, "refTable": "app_rentals.unit_calibration_certificate"}';

CREATE TABLE app_rentals.company (
    company_id serial PRIMARY KEY,
    company_name text,
    address text,
    primary_contact_id int,
    is_prev_customer boolean,
    pricing_rate real
);
COMMENT ON TABLE app_rentals.company IS '{"displayField": "company_name"}';
COMMENT ON COLUMN app_rentals.company.company_name IS '{"reqOnCreate": true}';
COMMENT ON COLUMN app_rentals.company.address IS '{"reqOnCreate": true}';
COMMENT ON COLUMN app_rentals.company.primary_contact_id IS '{"reqOnCreate": true, "refTable": "app_rentals.contact"}';
COMMENT ON COLUMN app_rentals.company.is_prev_customer IS '{"reqOnCreate": true}';
COMMENT ON COLUMN app_rentals.company.pricing_rate IS '{"reqOnCreate": true}';

CREATE TABLE app_rentals.contact (
    contact_id serial PRIMARY KEY,
    company_id int REFERENCES app_rentals.company(company_id),
    first_name text,
    last_name text,
    full_name text GENERATED ALWAYS AS (my_concat_immutable(first_name, last_name)) STORED,
    contact_position text,
    phone_number text,
    email text,
    active boolean
);
COMMENT ON TABLE app_rentals.contact IS '{"displayField": "fullname"}';
COMMENT ON COLUMN app_rentals.contact.company_id IS '{"reqOnCreate": true, "refTable": "app_rentals.company"}';
COMMENT ON COLUMN app_rentals.contact.first_name IS '{"reqOnCreate": true}';
COMMENT ON COLUMN app_rentals.contact.last_name IS '{"reqOnCreate": true}';
COMMENT ON COLUMN app_rentals.contact.contact_position IS '{"reqOnCreate": true}';
COMMENT ON COLUMN app_rentals.contact.phone_number IS '{"reqOnCreate": true}';
COMMENT ON COLUMN app_rentals.contact.email IS '{"reqOnCreate": true}';
COMMENT ON COLUMN app_rentals.contact.active IS '{"reqOnCreate": true}';

ALTER TABLE app_rentals.company ADD CONSTRAINT fk_prim_contact
    FOREIGN KEY (primary_contact_id) REFERENCES app_rentals.contact(contact_id);

--generated columns not working for now, need more time to investigate
CREATE TABLE app_rentals.quotation (
    quotation_id serial PRIMARY KEY,
    quotation_date timestamp NOT NULL,
    --quotation_name text GENERATED ALWAYS AS (my_concat_immutable(cast(quotation_id as text), cast(quotation_date as text))) STORED,
    tools_quoted_qty int,
    totalprice money
);
COMMENT ON TABLE app_rentals.quotation IS '{"displayField": "quotation_id"}';
COMMENT ON COLUMN app_rentals.quotation.quotation_date IS '{"reqOnCreate": true}';
COMMENT ON COLUMN app_rentals.quotation.tools_quoted_qty IS '{"reqOnCreate": true}';
COMMENT ON COLUMN app_rentals.quotation.totalprice IS '{"reqOnCreate": true}';

--should only exist as a lookup table, no need for display field (to discuss with Eddy)
CREATE TABLE app_rentals.quotation_line_item (
    quotation_id int REFERENCES app_rentals.quotation(quotation_id),
    tool_id int REFERENCES app_rentals.tool(tool_id),
    tool_quoted_qty int,
    tool_price money,
    PRIMARY KEY (quotation_id, id)
);
COMMENT ON COLUMN app_rentals.quotation_line_item.quotation_id IS '{"reqOnCreate": true, "refTable": "app_rentals.quotation"}';
COMMENT ON COLUMN app_rentals.quotation_line_item.tool_id IS '{"reqOnCreate": true, "refTable": "app_rentals.tool"}';
COMMENT ON COLUMN app_rentals.quotation_line_item.tool_quoted_qty IS '{"reqOnCreate": true}';
COMMENT ON COLUMN app_rentals.quotation_line_item.tool_price IS '{"reqOnCreate": true}';

--generated columns not working for now, need more time to investigate
CREATE TABLE app_rentals.purchase_order (
    purchase_order_id serial PRIMARY KEY,
    quotation_id int REFERENCES app_rentals.quotation(quotation_id),
    company_id int REFERENCES app_rentals.company(company_id),
    order_date timestamp,
    --purchase_order_name text GENERATED ALWAYS AS (my_concat_immutable(purchase_order_id, order_date)) STORED,
    tools_rented_qty int,
    total_adjusted_price money NOT NULL,
    gst money NOT NULL GENERATED ALWAYS AS (total_adjusted_price * 0.05) STORED,
    qst money NOT NULL GENERATED ALWAYS AS (total_adjusted_price * 0.9975) STORED,
    final_price money GENERATED ALWAYS AS (total_adjusted_price + (total_adjusted_price * 0.05) + (total_adjusted_price * 0.9975)) STORED
);
COMMENT ON TABLE app_rentals.purchase_order IS '{"displayField": "purchase_order_id"}';
COMMENT ON COLUMN app_rentals.purchase_order.quotation_id IS '{"reqOnCreate": true, "refTable": "app_rentals.quotation"}';
COMMENT ON COLUMN app_rentals.purchase_order.company_id IS '{"reqOnCreate": true, "refTable": "app_rentals.company"}';
COMMENT ON COLUMN app_rentals.purchase_order.order_date IS '{"reqOnCreate": true}';
COMMENT ON COLUMN app_rentals.purchase_order.tools_rented_qty IS '{"reqOnCreate": true}';
COMMENT ON COLUMN app_rentals.purchase_order.total_adjusted_price IS '{"reqOnCreate": true}';

--should only exist as a lookup table, no need for display field (to discuss with Eddy)
CREATE TABLE app_rentals.purchase_order_line_item (
    purchase_order_id int REFERENCES app_rentals.purchase_order(purchase_order_id),
    tool_id int REFERENCES app_rentals.tool(tool_id),
    unit_scheduled_id int,
    tool_rented_qty int,
    tool_price money,
    PRIMARY KEY (purchase_order_id, tool_id)
);
COMMENT ON COLUMN app_rentals.purchase_order_line_item.purchase_order_id IS '{"reqOnCreate": true, "refTable": "app_rentals.purchase_order"}';
COMMENT ON COLUMN app_rentals.purchase_order_line_item.tool_id IS '{"reqOnCreate": true, "refTable": "app_rentals.tool"}';
COMMENT ON COLUMN app_rentals.purchase_order_line_item.unit_scheduled_id IS '{"reqOnCreate": true, "refTable": "app_rentals.unit_scheduler"}';
COMMENT ON COLUMN app_rentals.purchase_order_line_item.tool_rented_qty IS '{"reqOnCreate": true}';
COMMENT ON COLUMN app_rentals.purchase_order_line_item.tool_price IS '{"reqOnCreate": true}';

--enum table
CREATE TABLE app_rentals.availability_status (
    availability_status_id serial PRIMARY KEY,
    availability_status_name text
);
COMMENT ON TABLE app_rentals.availability_status IS '{"displayField": "availability_status_name"}';
COMMENT ON COLUMN app_rentals.availability_status.availability_status_name IS '{"reqOnCreate": true}';

--generated columns not working for now, need more time to investigate
CREATE TABLE app_rentals.unit_scheduler (
    unit_scheduled_id serial PRIMARY KEY,
    unit_id int REFERENCES app_rentals.unit(unit_id) NOT NULL,
    unavailable_start_date timestamp,
    unavailable_end_date timestamp,
    --unit_scheduled_name text GENERATED ALWAYS AS (my_concat_immutable(unit_id, unavailable_start_date)) STORED,
    availability_status_id int REFERENCES app_rentals.availability_status(availability_status_id),
    unit_recalibration_flag_id int
);
COMMENT ON TABLE app_rentals.unit_scheduler IS '{"displayField": "unit_scheduled_id"}';
COMMENT ON COLUMN app_rentals.unit_scheduler.unit_id IS '{"reqOnCreate": true, "refTable": "app_rentals.unit"}';
COMMENT ON COLUMN app_rentals.unit_scheduler.unavailable_start_date IS '{"reqOnCreate": true}';
COMMENT ON COLUMN app_rentals.unit_scheduler.unavailable_end_date IS '{"reqOnCreate": true}';
COMMENT ON COLUMN app_rentals.unit_scheduler.availability_status_id IS '{"reqOnCreate": true, "refTable": "app_rentals.availability_status"}';
COMMENT ON COLUMN app_rentals.unit_scheduler.unit_recalibration_flag_id IS '{"reqOnCreate": true, "refTable": "app_rentals.unit_recalibration_flag"}';

ALTER TABLE app_rentals.purchase_order_line_item ADD CONSTRAINT fk_purchase_order_line_item_unit_scheduler
    FOREIGN KEY (unit_scheduled_id) REFERENCES app_rentals.unit_scheduler(unit_scheduled_id);

--generated columns not working for now, need more time to investigate
CREATE TABLE app_rentals.tool_restock_request (
    tool_restock_request_id serial PRIMARY KEY,
    tool_id int REFERENCES app_rentals.tool(tool_id) NOT NULL,
    notice_date timestamp,
    --tool_restock_name text GENERATED ALWAYS AS (my_concat_immutable(id, notice_date)) STORED,
    restock_notice_author text,
    qty_requested int
);
COMMENT ON TABLE app_rentals.tool_restock_request IS '{"displayField": "tool_restock_request_id"}';
COMMENT ON COLUMN app_rentals.tool_restock_request.tool_id IS '{"reqOnCreate": true, "refTable": "app_rentals.tool"}';
COMMENT ON COLUMN app_rentals.tool_restock_request.notice_date IS '{"reqOnCreate": true}';
COMMENT ON COLUMN app_rentals.tool_restock_request.restock_notice_author IS '{"reqOnCreate": true}';
COMMENT ON COLUMN app_rentals.tool_restock_request.qty_requested IS '{"reqOnCreate": true}';

--enum table
CREATE TABLE app_rentals.unit_recalibration_status (
    unit_recalibration_status_id serial PRIMARY KEY,
    recal_status text
);
COMMENT ON TABLE app_rentals.unit_recalibration_status IS '{"displayField": "recal_status"}';
COMMENT ON COLUMN app_rentals.unit_recalibration_status.recal_status IS '{"reqOnCreate": true}';

--generated columns not working for now, need more time to investigate
CREATE TABLE app_rentals.unit_recalibration_flag (
    unit_recalibration_flag_id serial PRIMARY KEY,
    unit_id int REFERENCES app_rentals.unit(unit_id) NOT NULL,
    unit_recalibration_status_id int REFERENCES app_rentals.unit_recalibration_status(unit_recalibration_status_id),
    flag_date timestamp NOT NULL,
    --unit_recalibration_flag_name text GENERATED ALWAYS AS (my_concat_immutable(unit_id, flag_date)) STORED,
    manual_flagger boolean,
    flagger_name text
);
COMMENT ON TABLE app_rentals.unit_recalibration_flag IS '{"displayField": "unit_recalibration_flag_id"}';
COMMENT ON COLUMN app_rentals.unit_recalibration_flag.unit_id IS '{"reqOnCreate": true, "refTable": "app_rentals.unit"}';
COMMENT ON COLUMN app_rentals.unit_recalibration_flag.unit_recalibration_status_id IS '{"reqOnCreate": true, "refTable": "app_rentals.unit_recalibration_status"}';
COMMENT ON COLUMN app_rentals.unit_recalibration_flag.flag_date IS '{"reqOnCreate": true}';
COMMENT ON COLUMN app_rentals.unit_recalibration_flag.manual_flagger IS '{"reqOnCreate": true}';
COMMENT ON COLUMN app_rentals.unit_recalibration_flag.flagger_name IS '{"reqOnCreate": true}';

ALTER TABLE app_rentals.unit_scheduler ADD CONSTRAINT fk_unit_scheduler_recal_flag
    FOREIGN KEY (unit_recalibration_flag_id) REFERENCES app_rentals.unit_recalibration_flag(unit_recalibration_flag_id);

--enum table
CREATE TABLE app_rentals.unit_recalibration_schedule_type (
    unit_recalibration_schedule_type_id serial PRIMARY KEY,
    recal_type_name text
);
COMMENT ON TABLE app_rentals.unit_recalibration_schedule_type IS '{"displayField": "recal_type_name"}';
COMMENT ON COLUMN app_rentals.unit_recalibration_schedule_type.recal_type_name IS '{"reqOnCreate": true}';

--generated columns not working for now, need more time to investigate
CREATE TABLE app_rentals.unit_recalibration_schedule (
    unit_recalibration_schedule_id serial PRIMARY KEY,
    unit_recalibration_flag_id int REFERENCES app_rentals.unit_recalibration_flag(unit_recalibration_flag_id),
    unit_id int REFERENCES app_rentals.unit(unit_id) NOT NULL,
    unit_scheduled_id int REFERENCES app_rentals.unit_scheduler(unit_scheduled_id),
    last_calibration_certificate_id int,
    unit_recalibration_schedule_type_id int REFERENCES app_rentals.unit_recalibration_schedule_type(unit_recalibration_schedule_type_id),
    --the counter is to count the amount of the type above (e.g. number of cycles)
    recal_type_counter int,
    recal_start_date timestamp,
    recal_end_date timestamp
    --unit_recalibration_schedule_name text GENERATED ALWAYS AS (my_concat_immutable(unit_id, recal_start_date)) STORED
);
COMMENT ON TABLE app_rentals.unit_recalibration_schedule IS '{"displayField": "unit_recalibration_schedule_id"}';
COMMENT ON COLUMN app_rentals.unit_recalibration_schedule.unit_recalibration_flag_id IS '{"reqOnCreate": true, "refTable": "app_rentals.unit_recalibration_flag"}';
COMMENT ON COLUMN app_rentals.unit_recalibration_schedule.unit_id IS '{"reqOnCreate": true, "refTable": "app_rentals.unit"}';
COMMENT ON COLUMN app_rentals.unit_recalibration_schedule.unit_scheduled_id IS '{"reqOnCreate": true, "refTable": "app_rentals.unit_scheduler"}';
COMMENT ON COLUMN app_rentals.unit_recalibration_schedule.last_calibration_certificate_id IS '{"reqOnCreate": true, "refTable": "app_rentals.unit_calibration_certificate"}';
COMMENT ON COLUMN app_rentals.unit_recalibration_schedule.unit_recalibration_schedule_type_id IS '{"reqOnCreate": true, "refTable": "app_rentals.unit_recalibration_schedule_type"}';
COMMENT ON COLUMN app_rentals.unit_recalibration_schedule.recal_type_counter IS '{"reqOnCreate": true}';
COMMENT ON COLUMN app_rentals.unit_recalibration_schedule.recal_start_date IS '{"reqOnCreate": true}';
COMMENT ON COLUMN app_rentals.unit_recalibration_schedule.recal_end_date IS '{"reqOnCreate": true}';

--generated columns not working for now, need more time to investigate
CREATE TABLE app_rentals.unit_calibration_certificate (
    unit_calibration_certificate_id serial PRIMARY KEY,
    unit_id int REFERENCES app_rentals.unit(unit_id) NOT NULL,
    certification_date timestamp,
    --unit_calibration_certificate_name text GENERATED ALWAYS AS (my_concat_immutable(unit_id, certification_date)) STORED,
    recalibration_advised_date timestamp,
    calibration_signature text
);
COMMENT ON TABLE app_rentals.unit_calibration_certificate IS '{"displayField": "unit_calibration_certificate_id"}';
COMMENT ON COLUMN app_rentals.unit_calibration_certificate.unit_id IS '{"reqOnCreate": true, "refTable": "app_rentals.unit"}';
COMMENT ON COLUMN app_rentals.unit_calibration_certificate.certification_date IS '{"reqOnCreate": true}';
COMMENT ON COLUMN app_rentals.unit_calibration_certificate.recalibration_advised_date IS '{"reqOnCreate": true}';
COMMENT ON COLUMN app_rentals.unit_calibration_certificate.calibration_signature IS '{"reqOnCreate": true}';

ALTER TABLE app_rentals.unit ADD CONSTRAINT fk_unit_cal_cert
    FOREIGN KEY (last_calibration_certificate_id) REFERENCES app_rentals.unit_calibration_certificate(unit_calibration_certificate_id);

ALTER TABLE app_rentals.unit_recalibration_schedule ADD CONSTRAINT fk_unit_cal_cert_schedule
    FOREIGN KEY (last_calibration_certificate_id) REFERENCES app_rentals.unit_calibration_certificate(unit_calibration_certificate_id);

GRANT ALL ON app_rentals.tool_type TO "user";
GRANT ALL ON app_rentals.tool TO "user";
GRANT ALL ON app_rentals.unit TO "user";
GRANT ALL ON app_rentals.company TO "user";
GRANT ALL ON app_rentals.contact TO "user";
GRANT ALL ON app_rentals.quotation TO "user";
GRANT ALL ON app_rentals.quotation_line_item TO "user";
GRANT ALL ON app_rentals.purchase_order TO "user";
GRANT ALL ON app_rentals.purchase_order_line_item TO "user";
GRANT ALL ON app_rentals.availability_status TO "user";
GRANT ALL ON app_rentals.unit_scheduler TO "user";
GRANT ALL ON app_rentals.tool_restock_request TO "user";
GRANT ALL ON app_rentals.unit_recalibration_status TO "user";
GRANT ALL ON app_rentals.unit_recalibration_flag TO "user";
GRANT ALL ON app_rentals.unit_recalibration_schedule_type TO "user";
GRANT ALL ON app_rentals.unit_recalibration_schedule TO "user";
GRANT ALL ON app_rentals.unit_calibration_certificate TO "user";

--sequence permission granting
GRANT USAGE, SELECT ON SEQUENCE app_rentals.tool_type_type_id_seq TO "user";
GRANT USAGE, SELECT ON SEQUENCE app_rentals.tool_id_seq TO "user";
GRANT USAGE, SELECT ON SEQUENCE app_rentals.unit_unit_id_seq TO "user";
GRANT USAGE, SELECT ON SEQUENCE app_rentals.company_company_id_seq TO "user";
GRANT USAGE, SELECT ON SEQUENCE app_rentals.contact_contact_id_seq TO "user";
GRANT USAGE, SELECT ON SEQUENCE app_rentals.quotation_quotation_id_seq TO "user";
GRANT USAGE, SELECT ON SEQUENCE app_rentals.purchase_order_purchase_order_id_seq TO "user";
GRANT USAGE, SELECT ON SEQUENCE app_rentals.availability_status_availability_status_id_seq TO "user";
GRANT USAGE, SELECT ON SEQUENCE app_rentals.unit_scheduler_unit_scheduled_id_seq TO "user";
GRANT USAGE, SELECT ON SEQUENCE app_rentals.tool_restock_request_tool_restock_request_id_seq TO "user";
GRANT USAGE, SELECT ON SEQUENCE app_rentals.unit_recalibration_status_unit_recalibration_status_id_seq TO "user";
GRANT USAGE, SELECT ON SEQUENCE app_rentals.unit_recalibration_flag_unit_recalibration_flag_id_seq TO "user";
GRANT USAGE, SELECT ON SEQUENCE app_rentals.unit_recalibration_schedule_type_unit_recalibration_schedule_type_id_seq TO "user";
GRANT USAGE, SELECT ON SEQUENCE app_rentals.unit_recalibration_schedule_unit_recalibration_schedule_id_seq TO "user";
GRANT USAGE, SELECT ON SEQUENCE app_rentals.unit_calibration_certificate_unit_calibration_certificate_id_seq TO "user";