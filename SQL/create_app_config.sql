CREATE SCHEMA IF NOT EXISTS application_config;

CREATE TABLE IF NOT EXISTS application_config.properties (
	id serial PRIMARY KEY,
	name VARCHAR(255) UNIQUE NOT NULL,
	description TEXT,
	value_type VARCHAR(50) NOT NULL,
	default_value VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS application_config.values (
	property_id INT NOT NULL,
	id serial PRIMARY KEY,
	value VARCHAR(100) NOT NULL,
	"table" VARCHAR(255),
	"column" VARCHAR(255),
	FOREIGN KEY (property_id) 
	REFERENCES application_config.properties(id)
	ON DELETE CASCADE 
	ON UPDATE CASCADE
);