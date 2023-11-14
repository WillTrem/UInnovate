-- Database: uinnovate_tool_rental

CREATE TABLE tool_type (
    type_id serial PRIMARY KEY,
    type_name text,
    type_category text
);

CREATE TABLE tool (
    tool_id serial PRIMARY KEY,
    tool_type int REFERENCES tool_type(type_id),
    tool_name text,
    tool_price money,
    tool_description text,
    tool_qty_available int
);

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

CREATE TABLE company (
    company_id serial PRIMARY KEY,
    address text,
    primary_contact_id int,
    is_prev_customer boolean,
    pricing_rate real
);

CREATE TABLE contact (
    contact_id serial PRIMARY KEY,
    company_id int REFERENCES company(company_id),
    contact_position text,
    phone_number text,
    email text
);

ALTER TABLE company ADD CONSTRAINT fk_prim_contact
    FOREIGN KEY (primary_contact_id) REFERENCES contact(contact_id);

CREATE TABLE quotation (
    quotation_id serial PRIMARY KEY,
    quotation_date timestamp,
    tools_quoted_qty int,
    totalprice money
);

CREATE TABLE quotation_line_item (
    quotation_id int REFERENCES quotation(quotation_id),
    tool_id int REFERENCES tool(tool_id),
    tool_quoted_qty int,
    tool_price money,
    PRIMARY KEY (quotation_id, tool_id)
);

CREATE TABLE purchase_order (
    purchase_order_id serial PRIMARY KEY,
    quotation_id int REFERENCES quotation(quotation_id),
    company_id int REFERENCES company(company_id),
    order_date timestamp,
    tools_rented_qty int,
    total_adjusted_price money,
    gst money,
    qst money,
    final_price money
);

CREATE TABLE purchase_order_line_item (
    purchase_order_id int REFERENCES purchase_order(purchase_order_id),
    tool_id int REFERENCES tool(tool_id),
    unit_scheduled_id int,
    tool_rented_qty int,
    tool_price money,
    PRIMARY KEY (purchase_order_id, tool_id)
);

--enum table
CREATE TABLE availability_status (
    availability_status_id serial PRIMARY KEY,
    availability_status_name text
);

CREATE TABLE unit_scheduler (
    unit_scheduled_id serial PRIMARY KEY,
    unit_id int REFERENCES unit(unit_id),
    unavailable_start_date timestamp,
    unavailable_end_date timestamp,
    availability_status_id int REFERENCES availability_status(availability_status_id),
    unit_recalibration_flag_id int
);

ALTER TABLE purchase_order_line_item ADD CONSTRAINT fk_purchase_order_line_item_unit_scheduler
    FOREIGN KEY (unit_scheduled_id) REFERENCES unit_scheduler(unit_scheduled_id);

CREATE TABLE tool_restock_request (
    tool_restock_request_id serial PRIMARY KEY,
    tool_id int REFERENCES tool(tool_id),
    notice_date timestamp,
    restock_notice_author text,
    qty_requested int
);

--enum table
CREATE TABLE unit_recalibration_status (
    unit_recalibration_status_id serial PRIMARY KEY,
    recal_status text
);

CREATE TABLE unit_recalibration_flag (
    unit_recalibration_flag_id serial PRIMARY KEY,
    unit_id int REFERENCES unit(unit_id),
    unit_recalibration_status_id int REFERENCES unit_recalibration_status(unit_recalibration_status_id),
    flag_date timestamp,
    manual_flagger boolean,
    flagger_name text
);

ALTER TABLE unit_scheduler ADD CONSTRAINT fk_unit_scheduler_recal_flag
    FOREIGN KEY (unit_recalibration_flag_id) REFERENCES unit_recalibration_flag(unit_recalibration_flag_id);

--enum table
CREATE TABLE unit_recalibration_schedule_type (
    unit_recalibration_schedule_type_id serial PRIMARY KEY,
    recal_type_name text
);

CREATE TABLE unit_recalibration_schedule (
    unit_recalibration_schedule_id serial PRIMARY KEY,
    unit_recalibration_flag_id int REFERENCES unit_recalibration_flag(unit_recalibration_flag_id),
    unit_id int REFERENCES unit(unit_id),
    unit_scheduled_id int REFERENCES unit_scheduler(unit_scheduled_id),
    last_calibration_certificate_id int,
    unit_recalibration_schedule_type_id int REFERENCES unit_recalibration_schedule_type(unit_recalibration_schedule_type_id),
    --the counter is to count the amount of the type above (e.g. number of cycles)
    recal_type_counter int,
    recal_start_date timestamp,
    recal_end_date timestamp
);

CREATE TABLE unit_calibration_certificate (
    unit_calibration_certificate_id serial PRIMARY KEY,
    unit_id int REFERENCES unit(unit_id),
    certification_date timestamp,
    recalibration_advised_date timestamp,
    calibration_signature text
);

ALTER TABLE unit ADD CONSTRAINT fk_unit_cal_cert
    FOREIGN KEY (last_calibration_certificate_id) REFERENCES unit_calibration_certificate(unit_calibration_certificate_id);

ALTER TABLE unit_recalibration_schedule ADD CONSTRAINT fk_unit_cal_cert_schedule
    FOREIGN KEY (last_calibration_certificate_id) REFERENCES unit_calibration_certificate(unit_calibration_certificate_id)