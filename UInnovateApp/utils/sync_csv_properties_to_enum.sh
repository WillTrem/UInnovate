#!/bin/bash

### This is a tool script to copyu the config properties names from the csv file and
### turn them as javascript constants to use in the code.

input_csv="../../dataFiles/appconfig_properties.csv"
output_js="../src/virtualmodel/ConfigProperties.ts"

# Check if the input CSV file exists
if [ ! -f "$input_csv" ]; then
    echo "Input CSV file not found: $input_csv"
    exit 1
fi

# Create or truncate the output JavaScript file
> "$output_js"

# Initialize a flag to skip the first row
skip_first_row=1

echo "enum ConfigProperty{" >> "$output_js"
# Process each line in the CSV and write it as a constant in the JavaScript file
while IFS=, read -r element _ || [ -n "$element" ]; do
	# Skips first row (header row)
	if [ $skip_first_row -eq 1 ]; then
        skip_first_row=0
        continue
    fi
    # Remove leading/trailing spaces and double quotes if necessary
    element="${element#"${element%%[![:space:]]*}"}"
    element="${element%"${element##*[![:space:]]}"}"

	# Finds the name in uppercase for constant variable name
	element_upper=$(echo "$element" | tr '[:lower:]' '[:upper:]')

    # Write the enum value  to the JavaScript file
    echo "    ${element_upper} = \"$element\"," >> "$output_js"
done < "$input_csv"
echo "}" >> "$output_js"
echo "export default ConfigProperty;" >> "$output_js"
echo "JavaScript file '$output_js' has been generated."