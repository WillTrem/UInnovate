-- Stored Procedure: CreateQuotationRevision
CREATE OR REPLACE FUNCTION app_rentals.CreateQuotationRevision(
    old_quotation_id INT,
    new_quotation_date TIMESTAMP
)
RETURNS INT AS $$
DECLARE
    new_quotation_id INT;
BEGIN
    -- Clone the quotation
    INSERT INTO quotation (quotation_date, tools_quoted_qty, totalprice)
    SELECT
        new_quotation_date,
        tools_quoted_qty,
        totalprice
    FROM
        quotation
    WHERE
        quotation_id = old_quotation_id
    RETURNING quotation_id INTO new_quotation_id;

    -- Clone quotation line items
    INSERT INTO quotation_line_item (quotation_id, id, tool_quoted_qty, tool_price)
    SELECT
        new_quotation_id,
        id,
        tool_quoted_qty,
        tool_price
    FROM
        quotation_line_item
    WHERE
        quotation_id = old_quotation_id;

    RETURN new_quotation_id;
END;
$$ LANGUAGE plpgsql;

-- Stored Procedure: CreatePurchaseOrderFromQuotation
CREATE OR REPLACE FUNCTION app_rentals.CreatePurchaseOrderFromQuotation(
    quotation_id_param INT,
    order_date_param TIMESTAMP
)
RETURNS INT AS $$
DECLARE
    new_purchase_order_id INT;
BEGIN
    -- Clone quotation information
    INSERT INTO purchase_order (quotation_id, company_id, order_date, tools_rented_qty, total_adjusted_price)
    SELECT
        quotation_id_param,
        company_id,
        order_date_param,
        tools_quoted_qty,
        totalprice
    FROM
        quotation
    WHERE
        quotation_id = quotation_id_param
    RETURNING purchase_order_id INTO new_purchase_order_id;

    -- Clone quotation line items to purchase order line items
    INSERT INTO purchase_order_line_item (purchase_order_id, id, unit_scheduled_id, tool_rented_qty, tool_price)
    SELECT
        new_purchase_order_id,
        id,
        NULL::INT, -- NULL for now, will likely change how this works in the future
        tool_quoted_qty,
        tool_price
    FROM
        quotation_line_item
    WHERE
        quotation_id = quotation_id_param;

    RETURN new_purchase_order_id;
END;
$$ LANGUAGE plpgsql;

-- Stored Procedure: ScheduleToolIntoUnitScheduler
CREATE OR REPLACE FUNCTION app_rentals.ScheduleToolIntoUnitScheduler(
    id_param INT,
    rent_start_date TIMESTAMP,
    rent_end_date TIMESTAMP
)
RETURNS INT AS $$
DECLARE
    unit_id_for_tool INT;
    new_unit_scheduler_id INT;
BEGIN
    -- Find a unit corresponding to the tool
    SELECT
        unit_id
    INTO
        unit_id_for_tool
    FROM
        unit
    WHERE
        id = id_param
        AND (last_returned_date IS NULL OR last_returned_date <= CURRENT_DATE)
    ORDER BY
        last_returned_date ASC
    LIMIT 1;

    -- Create a new entry in unit_scheduler
    IF unit_id_for_tool IS NOT NULL THEN
        INSERT INTO unit_scheduler (unit_id, unavailable_start_date, unavailable_end_date, availability_status_id)
        VALUES
            (unit_id_for_tool, rent_start_date, rent_end_date, (SELECT availability_status_id FROM availability_status WHERE availability_status_name = 'rented'))
        RETURNING unit_scheduled_id INTO new_unit_scheduler_id;
        RETURN new_unit_scheduler_id;
    ELSE
        -- Handle the case where a suitable unit is not found
        RETURN 0;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Stored Procedure: CreateRestockRequestForTool
CREATE OR REPLACE FUNCTION app_rentals.CreateRestockRequestForTool(
    id_param INT,
    restock_notice_author_param TEXT,
    qty_requested_param INT
)
RETURNS INT AS $$
DECLARE
    new_restock_request_id INT;
BEGIN
    -- Check if the tool exists
    IF NOT EXISTS (SELECT 1 FROM tool WHERE id = id_param) THEN
        -- Handle the case where the tool is not found
        RETURN 0;
    END IF;

    -- Create a new restock request
    INSERT INTO tool_restock_request (id, notice_date, restock_notice_author, qty_requested)
    VALUES
        (id_param, CURRENT_TIMESTAMP, restock_notice_author_param, qty_requested_param)
    RETURNING tool_restock_request_id INTO new_restock_request_id;
    RETURN new_restock_request_id;
END;
$$ LANGUAGE plpgsql;

-- Stored Procedure: AddToolToQuotation
CREATE OR REPLACE PROCEDURE app_rentals.AddToolToQuotation(
    quotation_id_param INT,
    id_param INT,
    tool_quoted_qty_param INT,
    tool_price_param MONEY
)
RETURNS VOID AS $$
BEGIN
    -- Check if the quotation exists
    IF NOT EXISTS (SELECT 1 FROM quotation WHERE quotation_id = quotation_id_param) THEN
        -- Handle the case where the quotation is not found

    -- Check if the tool exists
    ELSIF NOT EXISTS (SELECT 1 FROM tool WHERE id = id_param) THEN
        -- Handle the case where the tool is not found;

    -- Create a new line item for the tool in the quotation
    ELSE 
        INSERT INTO quotation_line_item (quotation_id, id, tool_quoted_qty, tool_price)
        VALUES
            (quotation_id_param, id_param, tool_quoted_qty_param, tool_price_param);
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Stored Procedure: CheckRecalibrationStatus
CREATE OR REPLACE PROCEDURE app_rentals.CheckRecalibrationStatus()
LANGUAGE plpgsql AS $$
DECLARE
    current_date TIMESTAMP := CURRENT_TIMESTAMP;
    unit_record RECORD;
    advised_recalibration_date TIMESTAMP; -- Renamed variable to avoid ambiguity
    recalibration_status_id INT;
    recalibration_flag_id INT;
BEGIN
    -- Loop through all units
    FOR unit_record IN SELECT unit_id, last_calibration_certificate_id FROM app_rentals.unit
    LOOP
        -- Get recalibration advised date
        SELECT recalibration_advised_date INTO advised_recalibration_date -- Use the renamed variable
        FROM app_rentals.unit_calibration_certificate
        WHERE unit_calibration_certificate_id = unit_record.last_calibration_certificate_id;

        -- Check if advised date is within a month
        IF advised_recalibration_date IS NOT NULL AND advised_recalibration_date <= current_date + INTERVAL '1 month' THEN
            -- Check if a recalibration flag exists for the unit
            SELECT unit_recalibration_flag_id, unit_recalibration_status_id
            INTO recalibration_flag_id, recalibration_status_id
            FROM app_rentals.unit_recalibration_flag
            WHERE unit_id = unit_record.unit_id;

            -- Update recalibration status
            IF recalibration_status_id IS NOT NULL THEN
                IF advised_recalibration_date <= current_date THEN
                    -- Update recal status to "calibration_needed_immediately"
                    UPDATE app_rentals.unit_recalibration_flag
                    SET unit_recalibration_status_id = (SELECT unit_recalibration_status_id FROM app_rentals.unit_recalibration_status WHERE recal_status = 'calibration_needed_immediately')
                    WHERE unit_recalibration_flag_id = recalibration_flag_id;
                ELSE
                    -- Update recal status to "calibration_needed_soon"
                    UPDATE app_rentals.unit_recalibration_flag
                    SET unit_recalibration_status_id = (SELECT unit_recalibration_status_id FROM app_rentals.unit_recalibration_status WHERE recal_status = 'calibration_needed_soon')
                    WHERE unit_recalibration_flag_id = recalibration_flag_id;
                END IF;
            ELSE
                -- Create a new recalibration flag for the unit
                INSERT INTO app_rentals.unit_recalibration_flag (unit_id, unit_recalibration_status_id, flag_date, manual_flagger, flagger_name)
                VALUES
                    (unit_record.unit_id, (SELECT unit_recalibration_status_id FROM app_rentals.unit_recalibration_status WHERE recal_status = 'calibration_needed_soon'), current_date, FALSE, NULL);
            END IF;
        END IF;
    END LOOP;
END;
$$;


-- Stored Procedure: GetCalibrateSoonUnits
CREATE OR REPLACE FUNCTION app_rentals.GetCalibrateSoonUnits()
RETURNS TABLE (
    unit_id INT,
    unit_serial_number TEXT,
    unit_recalibration_status_name TEXT,
    recalibration_flag_date TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        urf.unit_id,
        u.unit_serial_number,
        urs.recal_status AS unit_recalibration_status_name,
        urf.flag_date AS recalibration_flag_date
    FROM
        unit_recalibration_flag urf
    JOIN
        unit_recalibration_status urs ON urf.unit_recalibration_status_id = urs.unit_recalibration_status_id
    JOIN
        unit u ON urf.unit_id = u.unit_id
    WHERE
        urs.recal_status = 'calibration_needed_soon';
END;
$$ LANGUAGE plpgsql;


-- Stored Procedure: GetCalibrateImmediatelyUnits
CREATE OR REPLACE FUNCTION app_rentals.GetCalibrateImmediatelyUnits()
RETURNS TABLE (
    unit_id INT,
    unit_serial_number TEXT,
    unit_recalibration_status_name TEXT,
    recalibration_flag_date TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        urf.unit_id,
        u.unit_serial_number,
        urs.recal_status AS unit_recalibration_status_name,
        urf.flag_date AS recalibration_flag_date
    FROM
        unit_recalibration_flag urf
    JOIN
        unit_recalibration_status urs ON urf.unit_recalibration_status_id = urs.unit_recalibration_status_id
    JOIN
        unit u ON urf.unit_id = u.unit_id
    WHERE
        urs.recal_status = 'calibration_needed_immediately';
END;
$$ LANGUAGE plpgsql;

-- Demo Procedures

-- # 1. Update Unit Availability
--  updates the availability status of units based on their last returned date. 
-- If a unit has not been returned within a specified number of days, its availability status is set to false 
-- indicating it's not available.
CREATE OR REPLACE PROCEDURE app_rentals.update_unit_availability()
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE app_rentals.unit
    SET unit_available = FALSE
    WHERE unit_last_returned_date < CURRENT_DATE - INTERVAL '30 days';
END;
$$;

-- # 2 Archive Old Quotations
-- moves old quotations (older than a year) 
-- to an archive table for historical records and then deletes them from the main quotation table.
CREATE OR REPLACE PROCEDURE app_rentals.archive_old_quotations()
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO app_rentals.quotation_archive (quotation_id, quotation_date, tools_quoted_qty, totalprice)
    SELECT quotation_id, quotation_date, tools_quoted_qty, totalprice
    FROM app_rentals.quotation
    WHERE quotation_date < CURRENT_DATE - INTERVAL '1 year';

    DELETE FROM app_rentals.quotation
    WHERE quotation_date < CURRENT_DATE - INTERVAL '1 year';
END;
$$;


-- #3 Restock Low Inventory Tools
--  identifies tools with a quantity available below a certain threshold and creates restock requests for them.
CREATE OR REPLACE PROCEDURE app_rentals.restock_low_inventory_tools()
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO app_rentals.tool_restock_request (id, notice_date, restock_notice_author, qty_requested)
    SELECT id, CURRENT_DATE, 'Automated System', 50 -- assuming a restock request of 50 units
    FROM app_rentals.tool
    WHERE tool_qty_available < 10; -- assuming a threshold of 10 units
END;
$$;

