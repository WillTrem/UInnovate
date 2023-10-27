COPY application_config.properties("name", description, value_type, default_value)
FROM '/dataFiles/application_config.properties.csv'
DELIMITER ','
CSV HEADER;