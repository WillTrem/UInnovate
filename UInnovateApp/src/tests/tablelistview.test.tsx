import { describe, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import TableListView from "../components/TableListView";
import { MemoryRouter } from "react-router-dom";
import { Column, Table } from "../virtualmodel/VMD";
import { ConfigProvider } from "../contexts/ConfigContext";
import "@testing-library/jest-dom";
import { DataAccessorMock } from "../virtualmodel/__mocks__/DataAccessor";

vi.mock("axios");
vi.mock("DataAccessor");
vi.mock("../contexts/ConfigContext)");

describe("TableListView component", () => {
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
    table.addColumn(column, "something", false);
  });

  render(
    <ConfigProvider>
      <MemoryRouter>
        <TableListView table={table} />
      </MemoryRouter>
    </ConfigProvider>
  );

  it("renders a table with the specified attributes", async () => {
    // Wait for the table to be rendered
    const tableElement = await screen.findByRole("table");
    expect(tableElement).toBeInTheDocument();

    it("opens and closes the sliding panel", () => {
      // Render the component
      render(<TableListView table={table} /* props */ />);

      // Check if the sliding panel is not open by default
      expect(screen.queryByText("Details")).not.toBeInTheDocument();

      // Find the button that opens the sliding panel and simulate a click event
      const openButton = screen.getAllByRole("button");
      fireEvent.click(openButton[1]);

      // Check if the sliding panel is now open
      expect(screen.getByText("Details")).toBeInTheDocument();
    });
    it("renders the Show Look up Table button when showTable is false", () => {
      const { getByText } = render(<TableListView table={table} />);

      expect(getByText("Show Look up Table")).toBeInTheDocument();
    });
    it("renders the LookUpTableDetails component when showTable is true", () => {
      // Mock localStorage
      Storage.prototype.getItem = jest.fn(() => "mock value");

      const { getByText } = render(<TableListView table={table} />);
      const button = getByText("Show Look up Table");
      fireEvent.click(button);
      // Assuming LookUpTableDetails renders some text, replace 'Some text' with that text
      expect(getByText("Some text")).toBeInTheDocument();
    });
  });
  it("renders the Show Files button", async () => {
    render(
      <ConfigProvider>
        <MemoryRouter>
          <TableListView table={table} />
        </MemoryRouter>
      </ConfigProvider>
    );

    // Check for row existence by getting them by title
    const rows = await screen.findAllByTitle("row");

    // Click the first row
    rows[0].click();

    // Find the button that shows files
    const noShowFilesButton = screen.queryByTitle("Show Files Button");

    // Find the button that opens the sliding panel and simulate a click event
    expect(noShowFilesButton).toBeNull();

    columns[0].setReferenceTable("filegroup");

    const showFilesButton = await screen.findAllByTitle("Show Files Button");

    // Click the button
    expect(showFilesButton[0]).toBeInTheDocument();
  });

  it("Verify functionality of Shows file button", async () => {
    render(
      <ConfigProvider>
        <MemoryRouter>
          <TableListView table={table} />
        </MemoryRouter>
      </ConfigProvider>
    );
    // Check for row existence by getting them by title
    const rows = await screen.findAllByTitle("row");

    // Click the first row
    act(() => rows[0].click());

    columns[0].setReferenceTable("filegroup");

    const showFilesButton = await screen.findAllByTitle("Show Files Button");

    expect(showFilesButton[0]).toBeInTheDocument();

    // Click the button
    act(() => showFilesButton[0].click());

    // Check if the upload pop is now displayed
    const uploadPop = await screen.findAllByTitle("Dropzone");

    expect(uploadPop[0]).not.toBeInTheDocument();
  });

  it("Verify functionality of Shows file button", async () => {
    render(
      <ConfigProvider>
        <MemoryRouter>
          <TableListView table={table} />
        </MemoryRouter>
      </ConfigProvider>
    );
    // Check for row existence by getting them by title
    const rows = await screen.findAllByTitle("row");

    // Click the first row
    act(() => rows[0].click());

    columns[0].setReferenceTable("filegroup");

    const showFilesButton = await screen.findAllByTitle("Show Files Button");

    expect(showFilesButton[0]).toBeInTheDocument();

    // Click the button
    act(() => showFilesButton[0].click());

    // Check if the upload pop is now displayed
    const uploadPop = await screen.findAllByTitle("Dropzone");

    expect(uploadPop[0]).not.toBeInTheDocument();
    it("renders the date time picker", () => {
      // Render the component
      render(<TableListView table={table} /* props */ />);

      // Check if the sliding panel is not open by default
      expect(screen.queryByText("Details")).not.toBeInTheDocument();

      // Find the button that opens the sliding panel and simulate a click event
      const openButton = screen.getAllByRole("button");
      fireEvent.click(openButton[1]);

      // Check if the sliding panel is now open
      expect(screen.getByText("Details")).toBeInTheDocument();

      expect(screen.getByText("SELECT DATE & TIME")).toBeInTheDocument();
    });

    it("renders the date picker", () => {
      // Render the component
      render(<TableListView table={table} /* props */ />);

      // Check if the sliding panel is not open by default
      expect(screen.queryByText("Details")).not.toBeInTheDocument();

      // Find the button that opens the sliding panel and simulate a click event
      const openButton = screen.getAllByRole("button");
      fireEvent.click(openButton[1]);

      // Check if the sliding panel is now open
      expect(screen.getByText("Details")).toBeInTheDocument();

      expect(screen.getByText("SELECT DATE")).toBeInTheDocument();
    });

    it("renders the category selector", () => {
      // Render the component
      render(<TableListView table={table} /* props */ />);

      // Check if the sliding panel is not open by default
      expect(screen.queryByText("Details")).not.toBeInTheDocument();

      // Find the button that opens the sliding panel and simulate a click event
      const openButton = screen.getAllByRole("button");
      fireEvent.click(openButton[1]);

      // Check if the sliding panel is now open
      expect(screen.getByText("Details")).toBeInTheDocument();

      expect(screen.getByText("category1")).toBeInTheDocument();
    });
  });
});
