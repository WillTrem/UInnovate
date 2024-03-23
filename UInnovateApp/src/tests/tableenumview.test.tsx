import { render, screen, act } from "@testing-library/react";
import { vi, expect } from "vitest";
import TableEnumView from "../components/TableEnumView";
import { MemoryRouter } from "react-router-dom";
import store from "../redux/Store";
import { Provider } from "react-redux";
import { TableMock, ColumnMock } from "../virtualmodel/__mocks__/VMD";

vi.mock("axios");

describe("TableEnumView", () => {
  it("renders a table with the specified attributes", async () => {
    const table = new TableMock("mock table name");
    const column = new ColumnMock("type");

    table.addColumn(column, "", false, "");
    column.setVisibility(true);

    await act(async () => {
      render(
        <Provider store={store}>
          <MemoryRouter>
            <TableEnumView table={table} />
          </MemoryRouter>
        </Provider>
      );
    });

    expect(screen.getByText("type")).toBeInTheDocument();
  });
});
