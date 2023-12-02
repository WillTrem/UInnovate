-- SCHEMA: application

DROP SCHEMA IF EXISTS app_rentals CASCADE ;

CREATE SCHEMA IF NOT EXISTS app_rentals ;

GRANT USAGE ON SCHEMA app_rentals TO web_anon;

-- Create the Tools Table
CREATE TABLE  app_rentals.Tools (
    ToolID serial PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Description TEXT,
    RentalRate DECIMAL(10, 2) NOT NULL,
    Availability BOOLEAN NOT NULL
);

-- Create the Customers Table
CREATE TABLE  app_rentals.Customers (
    CustomerID serial PRIMARY KEY,
    FirstName VARCHAR(255) NOT NULL,
    LastName VARCHAR(255) NOT NULL,
    Email VARCHAR(255),
    Phone VARCHAR(20)
);

-- Create the Rentals Table
CREATE TABLE  app_rentals.Rentals (
    RentalID serial PRIMARY KEY,
    ToolID INT REFERENCES  app_rentals.Tools(ToolID),
    CustomerID INT REFERENCES  app_rentals.Customers(CustomerID),
    RentalDate DATE NOT NULL,
    DueDate DATE NOT NULL,
    ActualReturnDate DATE
);


GRANT ALL ON app_rentals.tools TO web_anon;
GRANT ALL ON app_rentals.customers TO web_anon;
GRANT ALL ON app_rentals.rentals TO web_anon;