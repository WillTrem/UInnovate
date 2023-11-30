import { describe, it, vi } from "vitest";
import TestRenderer from "react-test-renderer";
import TableListView from "../components/TableListView";
import { MemoryRouter } from "react-router-dom";
import { Column, Table } from "../virtualmodel/VMD";
import { ConfigProvider } from "../contexts/ConfigContext";

vi.mock("../contexts/ConfigContext)");
describe("TableListView component", () => {
  it("renders a table with the specified attributes", () => {
    // Sample data for testing
    // Making a mock single mock table
    const table = new Table("Table1");
    // Making a mock column array of three columns
    const columns = [
      new Column("Column1"),
      new Column("Column2"),
      new Column("Column3"),
    ];

    // Adding the columns to the table
    columns.forEach((column) => {
      table.addColumn(column);
    });

    const tablelistview = TestRenderer.create(
      <ConfigProvider>
        <MemoryRouter>
          <TableListView table={table} />
        </MemoryRouter>
      </ConfigProvider>
    ).toJSON();
    console.log(tablelistview);
  });
});
