import { describe, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
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


    it("opens and closes the sliding panel", () => {
      // Render the component
      render(<TableListView table={table} /* props */ />);
  
      // Check if the sliding panel is not open by default
      expect(screen.queryByText("Details")).not.toBeInTheDocument();
  
      // Find the button that opens the sliding panel and simulate a click event
      const openButton = screen.getAllByRole('button',);
      fireEvent.click(openButton[1]);
  
      // Check if the sliding panel is now open
      expect(screen.getByText("LookUpTableDetails")).toBeInTheDocument();
  
    
  });
});
});