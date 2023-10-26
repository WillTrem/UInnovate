-- Database: uinnovate_tool_rental

DROP DATABASE IF EXISTS uinnovate_tool_rental;

CREATE DATABASE uinnovate_tool_rental
    WITH
    OWNER = username_placeholder  --replace with your own username
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.utf8'
    LC_CTYPE = 'en_US.utf8'
    LOCALE_PROVIDER = 'libc'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;

--Typically run the above seperately from below
	
CREATE TABLE tool_type (
    type_id int NOT NULL PRIMARY KEY,
    type_name text,
	type_category text
);
CREATE TABLE tool(
    tool_id int NOT NULL PRIMARY KEY,
    tool_type int REFERENCES tool_type(type_id),
    tool_name text,
    tool_price money,
    tool_weight real,
    tool_height real,
	tool_description text,
	tool_available boolean,
    tool_last_exited_date timestamp,
    tool_last_returned_date timestamp,
	last_calibration_certificate_id int
);
CREATE TABLE company(
    company_id int NOT NULL PRIMARY KEY,
    address text,
	primary_contact_id int,
	is_prev_customer boolean,
    pricing_rate real
);
CREATE TABLE contact(
    contact_id int NOT NULL PRIMARY KEY,
    company_id int REFERENCES company(company_id),
    contact_position text,
    phone_number int,
    email text
);
ALTER TABLE company ADD CONSTRAINT fk_prim_contact
    FOREIGN KEY (primary_contact_id) REFERENCES contact(contact_id
);
CREATE TABLE quotation(
    quotation_id int NOT NULL PRIMARY KEY,
    quotation_date timestamp,
    tools_quoted_qty int,
	tools_quoted int[],  --this is an array of ids, each should point to a specific tool ID (Postgres doesnt support foreign key arrays)
    totalprice money
);
CREATE TABLE purchase_order(
    purchase_order_id int NOT NULL PRIMARY KEY,
    quotation_id int REFERENCES quotation(quotation_id),
    company_id int REFERENCES company(company_id),
    order_date timestamp,
	tools_rented_qty int,
	tools_rented int[], --this is an array of ids, each should point to a specific tool ID (Postgres doesnt support foreign key arrays)
    total_adjusted_price money,
    gst money,
    qst money,
    final_price money
);
CREATE TABLE unavailable_reason(
    unavailable_reason_id int NOT NULL PRIMARY KEY,
    unavailable_reason_name text
);
CREATE TABLE tool_scheduler(
    tool_id int NOT NULL REFERENCES tool(tool_id),
    unavailable_start_date timestamp,
    unavailable_end_date timestamp,
    unavailable_reason_id int REFERENCES unavailable_reason(unavailable_reason_id)
);
CREATE TABLE tool_restock_notice(
    tool_restock_notice_id int NOT NULL PRIMARY KEY,
    tool_type_id int REFERENCES tool_type(type_id),
	notice_date timestamp,
	restock_notice_author text,
	qty_requested int
);
CREATE TABLE tool_recalibration_flag(
    tool_recalibration_flag_id int NOT NULL PRIMARY KEY,
    tool_id int REFERENCES tool(tool_id),
	flag_date timestamp,
	recal_flagger text,
	needs_immediate_recal boolean
);
CREATE TABLE tool_calibration_certificate(
    tool_calibration_certificate_id int NOT NULL PRIMARY KEY,
    tool_id int REFERENCES tool(tool_id),
	certification_date timestamp,
	recalibration_advised_date timestamp,
	calibration_signature text
);
ALTER TABLE tool ADD CONSTRAINT fk_tool_cal_cert
    FOREIGN KEY (last_calibration_certificate_id) REFERENCES tool_calibration_certificate(tool_calibration_certificate_id
);