-- SCHEMA: application

DROP SCHEMA IF EXISTS application CASCADE ;

CREATE SCHEMA IF NOT EXISTS application ;

GRANT USAGE ON SCHEMA application TO web_anon;

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


GRANT ALL ON application.tools TO web_anon;
GRANT ALL ON application.customers TO web_anon;
GRANT ALL ON application.rentals TO web_anon;