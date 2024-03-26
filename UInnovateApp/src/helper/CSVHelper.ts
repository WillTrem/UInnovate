import { ParseResult, parse } from "papaparse";
import VMD, { Table } from "../virtualmodel/VMD";

export function validateCSV(
    csvObject: ParseResult<unknown>,
    table: Table
): void {
    const csvHeaders = csvObject.meta.fields;

    // Reject if the csv file doesn't have columns (headers)
    if (!csvHeaders) {
        throw new Error("Could not parse the headers of the CSV file.");
    }

    // Rejects if the csv file doesn't have the same number of headers as the table's number of columns
    if (csvHeaders.length !== table.columns.length) {
        throw new Error(
            "The number of headers in the CSV file does not match the number of columns in the table."
        );
    }

    // Rejects if the csv file has duplicate headers
    if (new Set(csvHeaders).size !== csvHeaders.length) {
        throw new Error("The CSV file has duplicate headers.");
    }

    // Rejects if not all the table columns are included in the csv headers
    table.columns.every((column) => {
        if (!csvHeaders.includes(column.column_name)) {
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
    const dataAccessor = VMD.getAddRowDataAccessor(
        schema.schema_name,
        table.table_name,
        csvObject.data,
        true
    );
		await dataAccessor.addRow();
}
