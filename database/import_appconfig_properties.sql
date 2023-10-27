COPY meta.appconfig_properties("name", description, value_type, default_value)
FROM '/dataFiles/appconfig_properties.csv'
DELIMITER ','
CSV HEADER;