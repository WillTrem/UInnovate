-- Create the Tools Table
CREATE TABLE application.Tools (
    ToolID serial PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Description TEXT,
    RentalRate DECIMAL(10, 2) NOT NULL,
    Availability BOOLEAN NOT NULL
);

-- Create the Customers Table
CREATE TABLE application.Customers (
    CustomerID serial PRIMARY KEY,
    FirstName VARCHAR(255) NOT NULL,
    LastName VARCHAR(255) NOT NULL,
    Email VARCHAR(255),
    Phone VARCHAR(20)
);

-- Create the Rentals Table
CREATE TABLE application.Rentals (
    RentalID serial PRIMARY KEY,
    ToolID INT REFERENCES application.Tools(ToolID),
    CustomerID INT REFERENCES application.Customers(CustomerID),
    RentalDate DATE NOT NULL,
    DueDate DATE NOT NULL,
    ActualReturnDate DATE
);

-- Insert sample data into the Tools Table
INSERT INTO application.Tools (Name, Description, RentalRate, Availability)
VALUES
    ('Hammer', 'A versatile tool for various tasks.', 2.50, TRUE),
    ('Drill', 'Perfect for making holes in various materials.', 5.00, TRUE),
    ('Screwdriver', 'For tightening and loosening screws.', 1.50, TRUE),
    ('Wrench', 'Used for turning nuts and bolts.', 3.00, TRUE),
    ('Saw', 'Ideal for cutting wood and other materials.', 4.50, TRUE);
	
-- Insert more realistic sample data into the Customers Table with diverse phone numbers
INSERT INTO application.Customers (FirstName, LastName, Email, Phone)
VALUES
    ('Mohammed', 'Ali', 'mohammed.ali@hotmail.com', '555-876-5432'),
    ('Lisa', 'Kim', 'lisa.kim@gmail.com', '555-432-1098'),
    ('Samantha', 'Chen', 'samantha.chen@example.com', '555-210-9876'),
    ('Ahmed', 'Khan', 'ahmed.khan@yahoo.com', '555-678-5678'),
    ('Daniel', 'Taylor', 'daniel.taylor@gmail.com', '444-555-1234'),
    ('Ella', 'Martinez', 'ella.martinez@example.com', '333-789-5678'),
    ('Oliver', 'Hernandez', 'oliver.hernandez@hotmail.com', '222-345-6789'),
    ('Sophia', 'Brown', 'sophia.brown@yahoo.com', '111-876-5432'),
    ('Ethan', 'Johnson', 'ethan.johnson@gmail.com', '999-432-1098');


-- Insert sample data into the Rentals Table
INSERT INTO application.Rentals (ToolID, CustomerID, RentalDate, DueDate, ActualReturnDate)
VALUES
    (1, 1, '2023-09-15', '2023-09-18', '2023-09-18'),
    (2, 2, '2023-09-16', '2023-09-20', '2023-09-19'),
    (3, 3, '2023-09-17', '2023-09-21', NULL),
    (4, 4, '2023-09-18', '2023-09-23', NULL),
    (5, 5, '2023-09-19', '2023-09-25', NULL);




GRANT SELECT ON application.tools TO web_anon;
GRANT SELECT ON application.customers TO web_anon;
GRANT SELECT ON application.rentals TO web_anon;