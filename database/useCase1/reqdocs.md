# Use Case Requirements Document

## Tool Rental Management System

The purpose of this document is to document the requirements of a use case that we are building our platform (UInnovate) for. It will show an overall diagram of the needed database, the contained tables, and then a list of user requirements that are needed from the database as well as the preferred way of accomplishing those requirements.
For context, the use case we are representing is a Tool Rental Company, which rents out large tools to other corporations (for things such as mining, excavation, etc.). They have 3 categories of data storage to be converted into a database: Tool Inventory, Customer Relationship Management, and Restock and Recalibration Management.

### ER Diagram

To view the diagram in more detail, please visit [this link](https://dbdiagram.io/d/UInnovate-Tool-Rentals-655327557d8bbd646522f06e).

### Tables in the Database

Here are the tables that are present in the database:

- **tool_type**

  - This table separates the tools in the inventory into separate categories, and this helps keep the tools in the inventory more categorized and groupable.

- **tool**

  - This table represents the different tools that the company has in their inventory to rent. Companies and clients that wish to rent tools from the service would browse items that are present in this table. Purchases and quotes also refer back to this table.

- **unit**

  - This table represents the different units of each tool that the company has in their inventory to rent. The customers won’t face this side directly, this is for the tool rental company to manage their inventory, and rent out different units when a client requests to rent a specific tool. Each tool should have 1 or more units to rent out.

- **company**

  - This table represents the different companies. These are used to hold the companies that are customers, and companies can potentially get better pricing rates which are stored here as well.

- **contact**

  - This table represents the different contacts, which are stored for purposes of reaching out to the various client companies this service deals with. It stores various contact information and a reference to the corresponding company.

- **quotation**

  - This table represents the different quotes (or estimates) that can be given out by our use case’s service to estimate the price of a specific combination of tool rentals. It holds provisory pricing info, as well as a different information surrounding the quotation itself.

- **quotation_line_item**

  - This table is a weak entity that represents the items that are contained within a specific quote. It exists as a link between a quote and tool, and gives some individual quantity and pricing information.

- **purchase_order**

  - This table represents the different purchase orders that correspond to successful rental orders by a client company. It refers to said company, and must refer to a quote from which it was originated. Contains everything you’d expect on a receipt (pricing, subtotals, dates, etc.).

- **purchase_order_line_item**

  - This table is a weak entity that represents the items that are contained within a specific purchase order. It exists as a link between a quote and tool, and gives some individual quantity and pricing information. It also refers to a specific entry in the unit scheduler, to map which units are rented out and when.

- **unit_scheduler**

  - This table is used to manage all the units that are rented out, and to put them in a sort of “schedule” to ensure that no unit is ever double booked. Has a start and end date, a status type, and references to a unit and recalibration flag (the latter optional).

- **availability_status**

  - This is an enum table used to set the different types of statuses a unit can have in the unit scheduler. It serves to differentiate the reasons for which a unit could be unavailable (broken, rented, needs recalibration, etc.)

- **tool_restock_request**

  - This table is used to manage all the restock requests the service would generate from the wear and tear of the inventory. If employees notice that a specific type of tool will soon not be able to meet demand, they can log a restock request here to ask for more units of a specific tool.

- **unit_recalibration_flag**

  - This table is used to manage all the recalibration flags needed for the upkeep of the various units in the inventory. If either a system or an employee notices that a specific unit needs recalibrating (or is due for recalibration), a flag is created (or updated) in this table for that specific unit..

- **unit_recalibration_status**

  - This is an enum table used to set the different types of statuses a unit can have in the unit recalibration flag table. It serves to differentiate the urgency of the recalibration in the flag (not needed, needed soon, needed immediately, etc.)

- **unit_recalibration_schedule**

  - This table is used to manage all the recalibration schedules of the units in inventory, and to put them in a schedule to ensure that no unit in recalibration is being rented out. Has a start and end date, a recalibration measurement type and counter, and references to a unit, recalibration flag, an element of the unit scheduler and the most recent calibration certificate.

- **unit_recalibration_schedule_type**

  - This is an enum table used to set the different types of measures by which a unit can be tracked in the unit recalibration scheduler. It uses these measurements to determine whether a unit is due for recalibration (hours of usage, days in field, days since calibrated, etc.).

- **unit_calibration_certificate**
  - This table is used to store all the calibration certificates of the units in inventory. These are created whenever a unit is recalibrated, and entered into here for storage. It references a specific unit, and other information stored on the certificate.

### Use case requirements to be filled

Here are the various requirements that were created with the use case:

#### ability to manage client companies

This requires us to implement all CRUD operations for client companies. Here are examples of queries that would need to work:

```sql
  -- Create a new company
  INSERT INTO company (address, is_prev_customer, pricing_rate)
  VALUES ('123 Main St', true, 50.0);
  -- Read all companies
  SELECT * FROM company;
  -- Read a specific company by ID
  SELECT * FROM company WHERE company_id = 1;
  -- Update company information
  UPDATE company
  SET address = '456 Oak St', pricing_rate = 55.0
  WHERE company_id = 1;
  -- Delete a company by ID
  DELETE FROM company WHERE company_id = 1;
```

#### ability to manage client contacts

This requires us to implement all CRUD operations for client contacts. Here are examples of queries that would need to work:

```sql
  -- Create a new contact for a company
  INSERT INTO contact (company_id, contact_position, phone_number, email)
  VALUES (1, 'Manager', '555-1234', 'manager@example.com');
  -- Read all contacts
  SELECT * FROM contact;
  -- Read contacts for a specific company
  SELECT * FROM contact WHERE company_id = 1;
  -- Update contact information
  UPDATE contact
  SET phone_number = '555-5678'
  WHERE contact_id = 1;
  -- Delete a contact by ID
  DELETE FROM contact WHERE contact_id = 1;
```

#### ability to create quotations for tools

This requires us to implement all CRUD operations for quotations of tools. Here are examples of queries that would need to work:

```sql
  -- Create a new quotation
  INSERT INTO quotation (quotation_date, tools_quoted_qty, totalprice)
  VALUES (CURRENT_TIMESTAMP, 10, 500.0);
  -- Read all quotations
  SELECT * FROM quotation;
  -- Read a specific quotation by ID
  SELECT * FROM quotation WHERE quotation_id = 1;
  -- Update quotation information
  UPDATE quotation
  SET totalprice = 550.0
  WHERE quotation_id = 1;
  -- Delete a quotation by ID
  DELETE FROM quotation WHERE quotation_id = 1;
```

#### ability to version quotations

This requires us to provide versioning for all the quotations. This requirement will require us to change our approach to the database, but after discussion with the stakeholder, it will be implemented in a future iteration.

#### ability to generate purchase orders

This requires us to implement all CRUD operations for purchase orders of tools. Here are examples of queries that would need to work:

```sql
  -- Create a new purchase order
  INSERT INTO purchase_order (quotation_id, company_id, order_date, tools_rented_qty, total_adjusted_price, gst, qst, final_price)
  VALUES (1, 1, CURRENT_TIMESTAMP, 8, 480.0, 24.0, 12.0, 516.0);
  -- Read all purchase orders
  SELECT * FROM purchase_order;
  -- Read a specific purchase order by ID
  SELECT * FROM purchase_order WHERE purchase_order_id = 1;
  -- Update purchase order information
  UPDATE purchase_order
  SET total_adjusted_price = 500.0
  WHERE purchase_order_id = 1;
  -- Delete a purchase order by ID
  DELETE FROM purchase_order WHERE purchase_order_id = 1;
```

#### ability to have alternate pricing rates for tools for specific customers

This requires us to store different pricing rates for different clients, and apply them upon generating purchase orders. There is a plan to alter the implementation of this, but for now companies are stored with their one pricing rate. This needs to be a valid query:

```sql
  -- Fetch a pricing rate by a company's address
  SELECT pricing_rate
  FROM company
  WHERE address = '123 Main St';
```

#### ability to manage tooling types

This requires us to implement all CRUD operations for types of tools in inventory. Here are examples of queries that would need to work:

```sql
  -- Create a new tool type
  INSERT INTO tool_type (type_name, type_category)
  VALUES ('Hammer', 'Hand Tools');
  -- Read all tool types
  SELECT * FROM tool_type;
  -- Read a specific tool type by ID
  SELECT * FROM tool_type WHERE type_id = 1;
  -- Update tool type information
  UPDATE tool_type
  SET type_category = 'Power Tools'
  WHERE type_id = 1;
  -- Delete a tool type by ID
  DELETE FROM tool_type WHERE type_id = 1;
```

#### ability to manage tools inventory

This requires us to implement all CRUD operations for the different tools in inventory. Here are examples of queries that would need to work:

```sql
  -- Create a new tool
  INSERT INTO tool (tool_type, tool_name, tool_price, tool_description, tool_qty_available)
  VALUES (1, 'Power Drill', 99.99, 'Cordless drill with variable speed', 20);
  -- Read all tools
  SELECT * FROM tool;
  -- Read a specific tool by ID
  SELECT * FROM tool WHERE id = 1;
  -- Update tool information
  UPDATE tool
  SET tool_qty_available = 25
  WHERE id = 1;
  -- Delete a tool by ID
  DELETE FROM tool WHERE id = 1;
```

However, to manage tools properly, control over individual units is needed. This requires us to also implement all CRUD operations for the different units of each tool in inventory. Here are examples of queries that would need to work:

```sql
  -- Create a new unit
  INSERT INTO unit (id, tool_type, unit_serial_number, unit_weight, unit_height, unit_condition, unit_available)
  VALUES (1, 1, 'UD123456', 3.5, 12.0, 'Good', true);
  -- Read all units
  SELECT * FROM unit;
  -- Read a specific unit by ID
  SELECT * FROM unit WHERE unit_id = 1;
  -- Update unit information
  UPDATE unit
  SET unit_condition = 'Excellent', unit_available = false
  WHERE unit_id = 1;
  -- Delete a unit by ID
  DELETE FROM unit WHERE unit_id = 1;
```

#### ability to view tool availability

This requires us to store the availability status of a tool to be rented. This would need to be a join between the tool and unit tables, checking on the availability status of a unit. Here is an example of a query that would need to work:

```sql
  -- Read all available Power Drill Units
  SELECT
  unit_serial_number,
  unit_weight,
  unit_height,
  unit_condition
  FROM
  tool
  JOIN
  unit ON tool.id = unit.id
  WHERE
  tool.tool_name = 'Power Drill'
  AND unit.unit_available = true;
```

#### ability to register a tool as exited

This requires us to implement queries that allow the user to set an exit date for a specific unit of a tool. Below is an example of a query that would need to work under this requirement:

```sql
  -- Update the 'UD123456' unit as exited today
  UPDATE unit
  SET unit_last_exited_date = CURRENT_TIMESTAMP
  WHERE unit_serial_number = 'UD123456';
```

#### ability to register a tool as returned

This requires us to implement queries that allow the user to set a return date for a specific unit of a tool. Below is an example of a query that would need to work under this requirement:

```sql
  -- Update the 'UD123456' unit as returned today
  UPDATE unit
  SET unit_last_returned_date = CURRENT_TIMESTAMP
  WHERE unit_serial_number = 'UD123456';
```

#### ability to create a restock request

This requires us to implement all CRUD operations for the restock requests of tools in inventory. Here are examples of queries that would need to work:

```sql
  -- Create a new tool restock request
  INSERT INTO tool_restock_request (id, notice_date, restock_notice_author, qty_requested)
  VALUES (1, CURRENT_TIMESTAMP, 'John Doe', 5);
  -- Read all tool restock requests
  SELECT * FROM tool_restock_request;
  -- Read a specific tool restock request by ID
  SELECT * FROM tool_restock_request WHERE tool_restock_request_id = 1;
  -- Update tool restock request information
  UPDATE tool_restock_request
  SET qty_requested = 10
  WHERE tool_restock_request_id = 1;
  -- Delete a tool restock request by ID
  DELETE FROM tool_restock_request WHERE tool_restock_request_id = 1;
```

#### ability to flag tools that will soon/currently need to be recalibrated

Both of the above requirements refer to the ability to flag tools for recalibration. This requires us to implement all CRUD operations for the restock requests of tools in inventory. Here are examples of queries that would need to work:

```sql
  -- Create a new unit recalibration flag
  INSERT INTO unit_recalibration_flag (unit_id, unit_recalibration_status_id, flag_date, manual_flagger, flagger_name)
  VALUES (1, 1, CURRENT_TIMESTAMP, true, 'Jane Doe');
  -- Read all unit recalibration flags
  SELECT * FROM unit_recalibration_flag;
  -- Read a specific unit recalibration flag by ID
  SELECT * FROM unit_recalibration_flag WHERE unit_recalibration_flag_id = 1;
  -- Update unit recalibration flag information
  UPDATE unit_recalibration_flag
  SET manual_flagger = false
  WHERE unit_recalibration_flag_id = 1;
  -- Delete a unit recalibration flag by ID
  DELETE FROM unit_recalibration_flag WHERE unit_recalibration_flag_id = 1;
```

The recalibration status table will enable the recalibrate flags to differentiate between soon and immediate calibration requirements. If that enum table is correctly populated, then the above CRUD operations would be sufficient.

#### ability to store calibration certificates

This requires us to implement all CRUD operations for the calibration certificates of tools in inventory. Here are examples of queries that would need to work:

```sql
  -- Create a new unit calibration certificate
  INSERT INTO unit_calibration_certificate (unit_id, certification_date, recalibration_advised_date, calibration_signature)
  VALUES (1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '6 months', 'John Calibration');
  -- Read all unit calibration certificates
  SELECT * FROM unit_calibration_certificate;
  -- Read a specific unit calibration certificate by ID
  SELECT * FROM unit_calibration_certificate WHERE unit_calibration_certificate_id = 1;
  -- Update unit calibration certificate information
  UPDATE unit_calibration_certificate
  SET calibration_signature = 'Jane Calibration'
  WHERE unit_calibration_certificate_id = 1;
  -- Delete a unit calibration certificate by ID
  DELETE FROM unit_calibration_certificate WHERE unit_calibration_certificate_id = 1;
```
