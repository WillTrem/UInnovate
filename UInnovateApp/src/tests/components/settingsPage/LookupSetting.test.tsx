import { render, screen, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import configureStore from "redux-mock-store";
import { ColumnMock, TableMock } from "../../../virtualmodel/__mocks__/VMD";
import LookUpTableSetting from "../../../components/settingsPage/LookupSetting";
import { Store, Middleware } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { Role } from "../../../redux/AuthSlice";

const initialState = {
  schema: { schema_name: "application" },
  script_table: { table_name: "script_mock" },
  auth: {
    role: Role.ADMIN,
    user: "admin",
    token: "token",
    schema_access: ["mock schema name"],
  }, //See VMD mock for reference to schema_access table
};

const middlewares: Middleware[] = [];
const mockStore = configureStore(middlewares);
const store: Store = mockStore(initialState);
const table = new TableMock("example");
const table2 = new TableMock("example2");
const table3 = new TableMock("example3");
const columns = [new ColumnMock("Column1"), new ColumnMock("Column2")];

table.addColumn(columns[0], "reference", true, "reference_id", "null", "null");
table2.addColumn(
  columns[0],
  "reference",
  true,
  "reference_id",
  "referencess",
  "referencess_id"
);
table3.addColumn(columns[1], "", true, "null", "null", "null");

describe("LookupSetting component", () => {
  it("renders when table only has 1 references table", async () => {
    render(
      <Provider store={store}>
        <LookUpTableSetting table={table} />
      </Provider>
    );
    const initialSelect = screen.getByTestId("lookup-tables-initial");
    expect(initialSelect).toBeInTheDocument();

    const initialPlus = screen.getByTestId("initial-plus-button");
    expect(initialPlus).toBeInTheDocument();

    const initialMinus = screen.getByTestId("initial-minus-button");
    expect(initialMinus).toBeInTheDocument();
  });

  it("testing buttons when there are multiple tables", async () => {
    render(
      <Provider store={store}>
        <LookUpTableSetting table={table2} />
      </Provider>
    );
    const initialSelect = screen.getByTestId("lookup-tables-initial");
    expect(initialSelect).toBeInTheDocument();

    const initialPlus = screen.getByTestId("initial-plus-button");
    expect(initialPlus).toBeInTheDocument();

    const initialMinus = screen.getByTestId("initial-minus-button");
    expect(initialMinus).toBeInTheDocument();
    act(() => initialPlus.click());

    const SelectComponent = screen.getByTestId("lookup-tables-component");
    expect(SelectComponent).toBeInTheDocument();

    act(() => initialMinus.click());

    expect(SelectComponent).not.toBeInTheDocument();
  });

  it("checks if nothing shows for tables with no referencing", async () => {
    const { container } = render(
      <Provider store={store}>
        <LookUpTableSetting table={table3} />
      </Provider>
    );

    expect(container.firstChild).toBeNull();
  });
});
