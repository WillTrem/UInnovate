import { act, render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Provider } from "react-redux";
import { Store, Middleware } from "@reduxjs/toolkit";
import DeleteRowButton from "../../../components/TableListViewComponents/DeleteRowButton";
import configureStore from "redux-mock-store";
import { Role } from "../../../redux/AuthSlice";
import { vi } from "vitest";
import { TableMock, ColumnMock } from "../../../virtualmodel/__mocks__/VMD";
import VMD from "../../../virtualmodel/__mocks__/VMD";

describe("DeleteRowButton", () => {
  const initialState = {
    schema: { schema_name: "application" },
    script_table: { table_name: "script_mock" },
    auth: {
      role: Role.ADMIN,
      user: "admin",
      token: "token",
      schema_access: ["mock schema name"],
    },
  };

  const middlewares: Middleware[] = [];
  const mockStore = configureStore(middlewares);
  const store: Store = mockStore(initialState);

  const table = new TableMock("table with no primary key and no dependencies");
  const table2 = new TableMock("table with primary key and no dependencies");

  const columns = [
    new ColumnMock("Column1"),
    new ColumnMock("Column2"),
    new ColumnMock("Column3"),
  ];

  table.addColumn(columns[0], "something", true, "something_id", "", "");
  table2.addColumn(columns[1], "something", false, "something_id", "", "");

  const row = { row: { id: "1" } };
  const getRows = vi.fn();

  afterEach(() => {
    getRows.mockReset();
  })

  it("renders the component with table 1", async () => {
    render(
      <Provider store={store}>
        <DeleteRowButton getRows={getRows} table={table} row={row} />
      </Provider>
      
    );
    const resetFiltersButton = screen.getByTestId("delete-row-button");
    expect(resetFiltersButton).toBeInTheDocument();

    act(() => resetFiltersButton.click());

    expect(VMD.getRemoveRowAccessor).toHaveBeenCalled();
    await waitFor(() => {
      expect(getRows).toHaveBeenCalled();
    })
  });

  it("renders the component with table 2", async () => {
    render(
      <Provider store={store}>
        <DeleteRowButton getRows={getRows} table={table2} row={row} />
      </Provider>
    );

    const resetFiltersButton = screen.getByTestId("delete-row-button");
    expect(resetFiltersButton).toBeInTheDocument();

    act(() => resetFiltersButton.click());

    expect(VMD.getRemoveRowAccessor).toHaveBeenCalled();
    await waitFor(() => {
      expect(getRows).toHaveBeenCalled();
    })
  });
});
