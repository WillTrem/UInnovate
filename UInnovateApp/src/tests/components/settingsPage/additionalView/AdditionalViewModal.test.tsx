import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { describe, expect } from "vitest";
import { Middleware, Store } from "@reduxjs/toolkit";
import configureStore from "redux-mock-store";
import { Role } from "../../../../redux/AuthSlice";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import AdditionalViewEditor from "../../../../components/settingsPage/additionalView/AdditionalViewEditor";
import AdditionalViewModal from "../../../../components/settingsPage/additionalView/AdditionalViewModal";
import userEvent from "@testing-library/user-event";
import { ViewTypeEnum } from "../../../../enums/ViewTypeEnum";

describe('AdditionalViewModal', () => {
	const initialState = {
		schema: { schema_name: "mock schema name" },
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
	const setShowMock = vi.fn();
	const refreshListMock = vi.fn();


	it("renders the AdditionalViewEditor component", async () => {
		store = mockStore(initialState);
		render(
			<MemoryRouter>
				<Provider store={store}>
					<AdditionalViewModal show={true} setShow={setShowMock} refreshList={refreshListMock}/> 
				</Provider>
			</MemoryRouter>
		);
	}),
	it("Adds a new additional view", async () => {
		store = mockStore(initialState);
		const user = userEvent.setup();
		render(
			<MemoryRouter>
				<Provider store={store}>
					<AdditionalViewModal show={true} setShow={setShowMock} refreshList={refreshListMock}/> 
				</Provider>
			</MemoryRouter>
		);

		const viewNameInput = screen.getByPlaceholderText('Enter a view name');
		const viewTypeSelect = screen.getByLabelText('View Type');
		const tableSelect = screen.getByLabelText('Tables');
		const submitButton = screen.getByText("Save");
		await act(async () => {
			await user.type(viewNameInput, 'mockViewName');
			await user.selectOptions(viewTypeSelect,  ViewTypeEnum.Calendar.toString());
			await user.selectOptions(tableSelect,  "mock table name");
			await user.click(submitButton);
		})

		await waitFor(() => {
			expect(setShowMock).toHaveBeenCalled();
		})
	})
});