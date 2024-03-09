import { describe, it, vi, expect } from "vitest";
import DisplayTab from "../components/settingsPage/DisplayTab";
import { render } from "@testing-library/react";
import { Role } from "../redux/AuthSlice";
import { Middleware, Store } from "@reduxjs/toolkit";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";

describe("DisplayTab component", () => {
  const initialState = {
    schema: { schema_name: "application" },
    script_table: { table_name: "script_mock" },
    auth: { role: Role.ADMIN, user: "admin", token: "token" , schema_access: ['mock schema name'] } //See VMD mock for reference to schema_access table
  };
  const middlewares: Middleware[] = [];
  const mockStore = configureStore(middlewares);
  const store: Store = mockStore(initialState);

  it("renders the component", () => {
    render(
        <Provider store={store}>
          <DisplayTab />
        </Provider>
    );
  });
  it("shows the list of tables", () => {
    const { getAllByTestId } = render(
        <Provider store={store}>
          <DisplayTab />
        </Provider>
    );
    const tableNavs = getAllByTestId("table-setting-nav");

    expect(tableNavs.length).toBeGreaterThan(0);
  });
});
