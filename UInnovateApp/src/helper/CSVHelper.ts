import { ParseResult, parse } from "papaparse";
import VMD, { Table } from "../virtualmodel/VMD";
import { Row } from "../virtualmodel/DataAccessor";

export function validateCSV(
    csvObject: ParseResult<unknown>,
    table: Table
): void {
    const csvHeaders = csvObject.meta.fields;

    // Reject if the csv file doesn't have columns (headers)
    if (!csvHeaders) {
        throw new Error("Could not parse the headers of the CSV file.");
    }
    const serialColumns = table.columns
    .filter(column => column.is_serial);

    // Rejects if the csv file has a number of headers less than the number of columns in the table minus the number of serial columns
    if (csvHeaders.length > table.columns.length || csvHeaders.length < (table.columns.length - serialColumns.length)) {
        throw new Error(
            "The number of headers in the CSV file is not valid."
        );
    }

    // Rejects if the csv file has duplicate headers
    if (new Set(csvHeaders).size !== csvHeaders.length) {
        throw new Error("The CSV file has duplicate headers.");
    }

    // Rejects if not all the table columns are included in the csv headers
    table.columns.every((column) => {
        if (!csvHeaders.includes(column.column_name) && !column.is_serial) {
            throw new Error(
                `Column ${column.column_name} could not be found in the headers of the CSV file.`
            );
        }
		return true;
    });
}

export async function loadCSVToDB(
    csvObject: ParseResult<unknown>,
    table: Table
): Promise<void> {
    const schema = VMD.getTableSchema(table.table_name);
    if (!schema) {
		throw new Error(`Could not find the schema for table ${table.table_name}.`);
    }
    
    // Filtering SERIAL typed columns from the CSV file
    const serialColumns = table.columns
    .filter(column => column.is_serial)
    .map(column => column.column_name);

    const filteredCSVObject = csvObject.data.map((row: any) => {
        let filteredRow = { ...row };
        serialColumns.forEach((serialColumn) => {
            delete filteredRow[serialColumn]
        })
        return filteredRow;
    })

    const dataAccessor = VMD.getAddRowDataAccessor(
        schema.schema_name,
        table.table_name,
        filteredCSVObject,
        true
    );
		await dataAccessor.addRow();
}
