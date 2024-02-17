import { describe, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import TableListView from "../components/TableListView";
import { MemoryRouter } from "react-router-dom";
import { Column, Table } from "../virtualmodel/VMD";
import { ConfigProvider } from "../contexts/ConfigContext";
import "@testing-library/jest-dom";

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
  it("renders the upload button", async () => {
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

    // Find the button that shows files
    const noShowFilesButton = screen.queryByTitle("Show Files Button");

    // Find the button that opens the sliding panel and simulate a click event
    expect(noShowFilesButton).toBeNull();

    act(() => {
      columns[0].setReferenceTable("filegroup");
      rows[0].click();
    });

    // Find the button that uploads files
    const dropzoneButton = screen.getByTitle("Dropzone");

    expect(dropzoneButton).toBeInTheDocument();
  });

  it("Verify existence of upload button", async () => {
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

    // Check if the upload pop is now displayed
    const dropzoneButton = screen.getByTitle("Dropzone");

    expect(dropzoneButton).toBeInTheDocument();
  });

  it("Verify functionality of upload file button", async () => {
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

    // Check if the upload pop is now displayed
    const dropzoneButton = screen.getByTitle("Dropzone");

    expect(dropzoneButton).toBeInTheDocument();

    const fileInputField = await screen.findByTitle("Uploader");
    const event = {
      target: {
        files: [
          new File(["(⌐□_□)"], "chucknorris.png", {
            type: "image/png",
          }) as unknown as File,
        ],
      },
    };
    await act(() => fireEvent.change(fileInputField, event));
    //TODO: Fix this test to be less hacky, MYKWIM
    const file_instance = await screen.findByTitle("file-instance");
    expect(file_instance).toBeInTheDocument();

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
