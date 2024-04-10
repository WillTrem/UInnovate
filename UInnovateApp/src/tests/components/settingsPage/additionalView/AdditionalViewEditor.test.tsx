import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { describe, expect } from "vitest";
import { Middleware, Store } from "@reduxjs/toolkit";
import configureStore from "redux-mock-store";
import { Role } from "../../../../redux/AuthSlice";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import AdditionalViewEditor from "../../../../components/settingsPage/additionalView/AdditionalViewEditor";


describe('AdditionalViewEditor', () => {
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
	const setSelectedSchemaMock = vi.fn();

	it("renders the AdditionalViewEditor component", async () => {
		store = mockStore(initialState);
		render(
			<MemoryRouter>
				<Provider store={store}>
					<AdditionalViewEditor selectedSchema="mock schema name" setSelectedSchema={setSelectedSchemaMock} />
				</Provider>
			</MemoryRouter>
		);

		await waitFor(() => {
			expect(screen.getByText("mockViewName")).toBeInTheDocument();
		})
	}),
	it("properly deletes the additional view", async () => {
		store = mockStore(initialState);
		render(
			<MemoryRouter>
				<Provider store={store}>
					<AdditionalViewEditor selectedSchema="mock schema name" setSelectedSchema={setSelectedSchemaMock} />
				</Provider>
			</MemoryRouter>
		);

		await waitFor(() => {
			expect(screen.getByText("mockViewName")).toBeInTheDocument();
		});

		const deleteButton = screen.getByTestId('delete-button');
		await act(() => {
			fireEvent.click(deleteButton);
		})
	}),
	it("properly shows the add view modal on button click", async () => {
		store = mockStore(initialState);
		render(
			<MemoryRouter>
				<Provider store={store}>
					<AdditionalViewEditor selectedSchema="mock schema name" setSelectedSchema={setSelectedSchemaMock} />
				</Provider>
			</MemoryRouter>
		);

		await waitFor(() => {
			expect(screen.getByText("mockViewName")).toBeInTheDocument();
		});
		const addButton = screen.getByText('ADD VIEW');
		await act(() => {
			fireEvent.click(addButton);
		})
	})
})