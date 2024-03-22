import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { Store, Middleware } from "@reduxjs/toolkit";
import MockAdapter from "axios-mock-adapter";
import configureStore from "redux-mock-store";
import axiosCustom from "../../../api/AxiosCustom";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { describe, expect } from "vitest";
import { Role } from "../../../redux/AuthSlice";
import RolesTab from "../../../components/settingsPage/Users/RolesTab";
import userEvent from "@testing-library/user-event";

describe("RolesTab component", () => {
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
	const mock = new MockAdapter(axiosCustom);

	it("Changes the default role when selecting a new one", async () => {
		// Arrange
		store = mockStore(initialState);
		const user = userEvent.setup()
		const { debug } = render(
			<MemoryRouter>
				<Provider store={store}>
					<RolesTab />
				</Provider>
			</MemoryRouter>
		);
		
		// Act
		await waitFor(() => {
			const defaultColumn = screen.getByText('Default');
			expect(defaultColumn).toBeInTheDocument();
		});
		
		const select = screen.queryAllByTestId('default-role-select')[0];
		const combobox = within(select).getByRole('combobox');
		await act(() => user.click(combobox));
		const listbox = await screen.findByRole("listbox");		
		debug(listbox);
		await act(() => user.click(within(listbox).getByText('Configurator')))

		// Assert
		await waitFor(async () => {
			expect(combobox).toHaveTextContent("Configurator");
		})
	}),
	it("Changes the schema role when selecting a new one", async () => {
		// Arrange
		store = mockStore(initialState);
		const user = userEvent.setup()
		const { debug } = render(
			<MemoryRouter>
				<Provider store={store}>
					<RolesTab />
				</Provider>
			</MemoryRouter>
		);
		
		// Act
		await waitFor(() => {
			const defaultColumn = screen.getByText('Default');
			expect(defaultColumn).toBeInTheDocument();
		});
		
		const select = screen.queryAllByTestId('schema-role-select')[0];
		const combobox = within(select).getByRole('combobox');
		await act(() => user.click(combobox));
		const listbox = await screen.findByRole("listbox");		
		debug(listbox);
		await act(() => user.click(within(listbox).getByText('Configurator')))

		// Assert
		await waitFor(async () => {
			expect(combobox).not.toHaveTextContent("User");
		})
	})
});