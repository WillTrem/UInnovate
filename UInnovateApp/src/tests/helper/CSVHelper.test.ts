import { ParseResult } from "papaparse";
import VMD, { Column, Table } from "../../virtualmodel/VMD";
import { describe, expect } from "vitest";
import { loadCSVToDB, validateCSV } from "../../helper/CSVHelper";
import { ColumnMock, TableMock } from "../../virtualmodel/__mocks__/VMD";

describe("CSVHelper", () => {
    const validTable = new TableMock("table");
    validTable.addColumn(
        new ColumnMock("column1"),
        "",
        true,
        false,
        "",
        "",
        ""
    );
    validTable.addColumn(
        new ColumnMock("column2"),
        "",
        true,
        false,
        "",
        "",
        ""
    );
    describe("validateCSV", () => {
        it("should allow a valid CSV file", () => {
            const csvObject: ParseResult<unknown> = {
                data: [],
                errors: [],
                meta: {
                    delimiter: ",",
                    linebreak: "\n",
                    aborted: false,
                    cursor: 0,
                    fields: ["column1", "column2"],
                    truncated: false,
                },
            };

            expect(() => validateCSV(csvObject, validTable)).not.toThrow();
        });

        it("should throw errors if the CSV file is invalid", () => {
            let invalidCsvObject: ParseResult<unknown> = {
                data: [],
                errors: [],
                meta: {
                    delimiter: ",",
                    linebreak: "\n",
                    aborted: false,
                    cursor: 0,
                    fields: undefined,
                    truncated: false,
                },
            };

            expect(() => validateCSV(invalidCsvObject, validTable)).toThrow();

            invalidCsvObject.meta.fields = ["column1"];
            expect(() => validateCSV(invalidCsvObject, validTable)).toThrow();

            invalidCsvObject.meta.fields = ["column1", "column1"];
            expect(() => validateCSV(invalidCsvObject, validTable)).toThrow();

            invalidCsvObject.meta.fields = ["column1", "invalidColumn"];
            expect(() => validateCSV(invalidCsvObject, validTable)).toThrow();
        });
    });

    describe("loadCSVToDB", () => {
        it("should load CSV to DB correctly", async () => {
            const csvObject: ParseResult<unknown> = {
                data: [{ column1: "value1", column2: "value2" }],
                errors: [],
                meta: {
                    delimiter: ",",
                    linebreak: "\n",
                    aborted: false,
                    cursor: 0,
                    fields: ["column1", "column2"],
                    truncated: false,
                },
            };

            await loadCSVToDB(csvObject, validTable);

            expect(VMD.getTableSchema).toHaveBeenCalledWith(
                validTable.table_name
            );
            expect(VMD.getAddRowDataAccessor).toHaveBeenCalledWith(
                "mock schema name",
                validTable.table_name,
                csvObject.data,
                true
            );
        });
    });
});
