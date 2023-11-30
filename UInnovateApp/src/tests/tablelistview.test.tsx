import { describe, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import TableListView from "../components/TableListView";
import { MemoryRouter } from "react-router-dom";
import { Column, Table } from "../virtualmodel/VMD";
import { ConfigProvider } from "../contexts/ConfigContext";
import "@testing-library/jest-dom";

vi.mock("axios");
vi.mock("../contexts/ConfigContext)");
describe("TableListView component", () => {
  it("renders a table with the specified attributes", async () => {
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

    render(
      <ConfigProvider>
        <MemoryRouter>
          <TableListView table={table} />
        </MemoryRouter>
      </ConfigProvider>
    );

    // Wait for the table to be rendered
    const tableElement = await screen.findByRole("table");
    expect(tableElement).toBeInTheDocument();
  });
});
