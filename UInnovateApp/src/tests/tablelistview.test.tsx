import { describe, expect, it, vi } from "vitest";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import TableListView from "../components/TableListView";
import { MemoryRouter } from "react-router-dom";
import { ColumnMock, TableMock } from "../virtualmodel/__mocks__/VMD";
import "@testing-library/jest-dom";
import store from "../redux/Store";
import { Provider } from "react-redux";

vi.mock("axios");

// vi.unmock("../virtualmodel/VMD");
// vi.unmock("../virtualmodel/DataAccessor");

describe("TableListView component", () => {
  // Sample data for testing
  // Making a mock single mock table
  const table = new TableMock("Table1");

  // Making a mock column array of three columns
  const columns = [
    new ColumnMock("Column1"),
    new ColumnMock("Column2"),
    new ColumnMock("Column3"),
  ];

  // Adding the columns to the table
  columns.forEach((column) => {
    table.addColumn(column, "something", false, "", "", "");
  });

  render(
    <MemoryRouter>
      <Provider store={store}>
        <TableListView table={table} />
      </Provider>
    </MemoryRouter>
  );

  console.log(screen.debug(undefined, 20000));

  it("renders a table with the specified attributes", async () => {
    // Wait for the table to be rendered
    const tableElement = await screen.findByRole("table");
    expect(tableElement).toBeInTheDocument();

    it("opens and closes the sliding panel", () => {
      // Render the component
      render(
        <Provider store={store}>
          <TableListView table={table} /* props */ />
        </Provider>
      );

      // Check if the sliding panel is not open by default
      expect(screen.queryByText("Details")).not.toBeInTheDocument();

      // Find the button that opens the sliding panel and simulate a click event
      const openButton = screen.getAllByRole("button");
      fireEvent.click(openButton[1]);

      // Check if the sliding panel is now open
      expect(screen.getByText("Details")).toBeInTheDocument();
    });
    it("renders the Show Look up Table button when showTable is false", () => {
      const { getByText } = render(
        <Provider store={store}>
          <TableListView table={table} />
        </Provider>
      );

      expect(getByText("Show Look up Table")).toBeInTheDocument();
    });
    it("renders the LookUpTableDetails component when showTable is true", () => {
      // Mock localStorage
      Storage.prototype.getItem = vi.fn(() => "mock value");

      const { getByText } = render(<TableListView table={table} />);
      const button = getByText("Show Look up Table");
      fireEvent.click(button);
      // Assuming LookUpTableDetails renders some text, replace 'Some text' with that text
      expect(getByText("Some text")).toBeInTheDocument();
    });
  });
  it("renders the upload button", async () => {
    render(
      <MemoryRouter>
        <Provider store={store}>
          <TableListView table={table} />
        </Provider>
      </MemoryRouter>
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

  it("Render Reset Filter button", async () => {
    render(
      <MemoryRouter>
        <Provider store={store}>
          <TableListView table={table} />
        </Provider>
      </MemoryRouter>
    );

    const resetFiltersButton = screen.getByTestId("reset-filter-button");

    // Check if the button is in the document
    expect(resetFiltersButton).toBeInTheDocument();

    // Simulate a click event on the button
    fireEvent.click(resetFiltersButton);
  });

  it("render the filter button and simulate a click events", async () => {
    render(
      <MemoryRouter>
        <Provider store={store}>
          <TableListView table={table} />
        </Provider>
      </MemoryRouter>
    );

    // Wait for the button to be in the document
    let filterButtons;

    // Wait for the button to be in the document
    await waitFor(() => {
      filterButtons = screen.getAllByTestId("Button-Filtering");
      expect(filterButtons[0]).toBeInTheDocument(); // Check the first button
    });

    // Add null check before accessing the elements in the array
    if (filterButtons) {
      // Simulate a click event on the button
      fireEvent.click(filterButtons[0]);
    }

    //check if the filter menu is in the document which should render after pressing the filter button
    let filtermenu;
    await waitFor(() => {
      filtermenu = screen.getAllByTestId("filter-menu");
      expect(filtermenu[0]).toBeInTheDocument(); // Check the first button
    });

    //The confirm button should also be rendered with the filter menu
    let filterConfirmButton;
    await waitFor(() => {
      filterConfirmButton = screen.getAllByTestId("filter-confirm-button");
      expect(filterConfirmButton[0]).toBeInTheDocument(); // Check the first button
    });

    if (filterConfirmButton && filtermenu) {
      fireEvent.click(filterConfirmButton[0]);
    }
  });

  it("table UI is rendered", async () => {
    render(
      <MemoryRouter>
        <Provider store={store}>
          <TableListView table={table} />
        </Provider>
      </MemoryRouter>
    );

    const renderedTable = screen.getByTestId("table");
    expect(renderedTable).toBeInTheDocument();
  });

  it("Verify existence of upload button", async () => {
    render(
      <MemoryRouter>
        <Provider store={store}>
          <TableListView table={table} />
        </Provider>
      </MemoryRouter>
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
      <MemoryRouter>
        <Provider store={store}>
          <TableListView table={table} />
        </Provider>
      </MemoryRouter>
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
      render(
        <Provider store={store}>
          <TableListView table={table} /* props */ />
        </Provider>
      );

      // Check if the sliding panel is not open by default
      expect(screen.queryByText("Details")).not.toBeInTheDocument();

      // Find the button that opens the sliding panel and simulate a click event
      const openButton = screen.getAllByRole("button");
      fireEvent.click(openButton[1]);

      // Check if the sliding panel is now open
      expect(screen.getByText("Details")).toBeInTheDocument();

      expect(screen.getByText("SELECT DATE & TIME")).toBeInTheDocument();
    });

    it("renders the date picker ", () => {
      // Render the component
      render(
        <Provider store={store}>
          <TableListView table={table} /* props */ />
        </Provider>
      );

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
      render(
        <Provider store={store}>
          <TableListView table={table} /* props */ />
        </Provider>
      );

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
