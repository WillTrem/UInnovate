import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { describe, expect } from "vitest";
import { ColumnConfig } from "../../../components/settingsPage/ColumnConfig";
import VMD, { ColumnMock } from "../../../virtualmodel/__mocks__/VMD";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { Role } from "../../../redux/AuthSlice";
import { Middleware, Store } from "@reduxjs/toolkit";
import userEvent from "@testing-library/user-event";

describe("ColumnConfig component", () => {
  const initialState = {
		schema: { schema_name: "application" },
		script_table: { table_name: "script_mock" },
		auth: { dbRole: Role.ADMIN, user: "admin", token: "token" },
		userData: {
			users: [{ email: "mockuser123@test.com", role: "user", is_active: true, schema_access: ["mock schema name"], schemaRoles: {} },
			{ email: "mockAdmin@test.com", role: "administrator", is_active: true, schema_access: ["mock schema name"], schemaRoles: {} },
			{ email: "mockConfigurator@test.com", role: "configurator", is_active: true, schema_access: ["mock schema name"], schemaRoles: {} }]
		}
	};

	const middlewares: Middleware[] = [];
	const mockStore = configureStore(middlewares);
	let store: Store;
  const column = new ColumnMock("Column1");
  const table = new VMD.getTable("Table1");
  table.addColumn(column, "", false, "");

  it("renders the component", () => {
    store = mockStore(initialState);
    render(
      <Provider store={store}>
        <ColumnConfig table={table} />
      </Provider>
    );
  }),
    it("modifies the config on visibility toggle", async () => {
      store = mockStore(initialState);
      // Arrange
      render(
        <Provider store={store}>
          <ColumnConfig table={table} />
        </Provider>
      );
      const toggleSwitch = screen.getAllByTestId("visibility-switch")[0]
      const checkbox = within(toggleSwitch).getByRole('checkbox')

      // Act - toggle the visibility off for the first column
     act(() => fireEvent.change(checkbox, { target: { checked: true } }));

      // Assert
      await waitFor(() => {
        expect(checkbox).toBeChecked();
      });
    });
    it("modifies the config on display type change", async () => {
      store = mockStore(initialState);
      const user = userEvent.setup()
      // Arrange
      render(
        <Provider store={store}>
          <ColumnConfig table={table} />
        </Provider>
      );

      // Act - toggle the visibility off for the first column
      const select = screen.getAllByTestId('display-type-select')[0];
      const combobox = within(select).getByRole('combobox');
      await act(() => user.click(combobox));
      const listbox = await screen.findByRole("listbox");		
      await act(() => user.click(within(listbox).getByText('text')))

      // Assert
      await waitFor(async () => {
        expect(combobox).toHaveTextContent("text");
      })
    });
});
