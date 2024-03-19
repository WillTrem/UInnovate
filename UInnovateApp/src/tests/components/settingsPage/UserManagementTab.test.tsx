import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import UserManagementTab from "../../../components/settingsPage/Users/UserManagementTab"
import { describe, expect } from "vitest";
import { Middleware, Store } from "@reduxjs/toolkit";
import configureStore from "redux-mock-store";
import { Role } from "../../../redux/AuthSlice";
import { Provider } from "react-redux";
import { ErrMsg } from "../../../enums/ErrMsg";
import { MemoryRouter } from "react-router-dom";

describe("UserManagementTab component", () => {
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


	it("renders the component", () => {
		store = mockStore(initialState);
		render(
			<MemoryRouter>
				<Provider store={store}>
					<UserManagementTab />
				</Provider>
			</MemoryRouter>
		);
	}),
		it("displays the add user modal when the add user button is clicked", async () => {
			const { getByText } = render(<MemoryRouter>
				<Provider store={store}>
					<UserManagementTab />
				</Provider>
			</MemoryRouter>);
			const button = getByText("Add User");
			fireEvent.click(button);

			await waitFor(() => {
				const modalElement = screen.getByTestId('add-user-modal');
				expect(modalElement).toBeInTheDocument();
			});
		}),
		it("closes the add user modal when the cancel button is clicked", async () => {
			render(<MemoryRouter>
				<Provider store={store}>
					<UserManagementTab />
				</Provider>
			</MemoryRouter>);
			const button = screen.getByText("Add User");
			fireEvent.click(button);

			await waitFor(() => {
				const modalElement = screen.getByTestId('add-user-modal');
				expect(modalElement).toBeInTheDocument();
			});

			const closeButton = screen.getByText("Cancel");

			fireEvent.click(closeButton);

			await waitFor(() => {
				const modalElement = screen.queryByTestId('add-user-modal');
				expect(modalElement).not.toBeInTheDocument();
			});
		})
	it("sends the request upon clicking the add user button", async () => {
		render(<MemoryRouter>
			<Provider store={store}>
				<UserManagementTab />
			</Provider>
		</MemoryRouter>);
		const button = screen.getByText("Add User");
		fireEvent.click(button);

		await waitFor(() => {
			const modalElement = screen.getByTestId('add-user-modal');
			expect(modalElement).toBeInTheDocument();
		});

		const createUserButton = screen.getByText("Add");
		const emailTextField = screen.getByLabelText("Email");
		fireEvent.change(emailTextField, { target: { value: "test@test.com" } });

		fireEvent.click(createUserButton);
		// Expects to close the modal
		await waitFor(() => {
			const modalElement = screen.queryByTestId('add-user-modal');
			expect(modalElement).not.toBeInTheDocument();
		});
	}),
		it("Displays an error message if the email address is not valid", async () => {
			store = mockStore(initialState);
			render(
				<MemoryRouter>
					<Provider store={store}>
						<UserManagementTab />
					</Provider>
				</MemoryRouter>
			);
			const button = screen.getByText("Add User");
			fireEvent.click(button);

			await waitFor(() => {
				const modalElement = screen.getByTestId('add-user-modal');
				expect(modalElement).toBeInTheDocument();
			});

			const createUserButton = screen.getByText("Add");


			// Attempt at adding a user without specifying an email address
			fireEvent.click(createUserButton);

			await waitFor(() => {
				expect(screen.getByText(ErrMsg.MISSING_FIELD));
			})

			const emailTextField = screen.getByLabelText("Email");

			fireEvent.change(emailTextField, { target: { value: "invalidEmailAddress" } });

			// Attempt at adding a user with an invalid email address
			fireEvent.click(createUserButton);

			await waitFor(() => {
				expect(screen.getByText(ErrMsg.INVALID_EMAIL));
			})

		}),
		it("Displays the unauthorized screen for unauthorized user", async () => {
			store = mockStore({ ...initialState, auth: { dbRole: Role.CONFIG, user: "configurator_user", token: "token" } });
			render(
				<MemoryRouter>
					<Provider store={store}>
						<UserManagementTab />
					</Provider>
				</MemoryRouter>
			);
			expect(screen.getByTestId("unauthorized-screen"));
		}),
		it("Renders user data properly", async () => {
			store = mockStore(initialState);
			render(
				<MemoryRouter>
					<Provider store={store}>
						<UserManagementTab />
					</Provider>
				</MemoryRouter>
			);

			await waitFor(() => {
				expect(screen.getByText("test@test.com")).toBeInTheDocument();
			})

		}),
		it("Properly toggles active state", async () => {
			store = mockStore(initialState);
			render(
				<MemoryRouter>
					<Provider store={store}>
						<UserManagementTab />
					</Provider>
				</MemoryRouter>
			);
			await waitFor(() => {
				expect(screen.getByText("test@test.com")).toBeInTheDocument();
			})
			const toggleSwitch = screen.getByTestId('visibility-switch')
			act(() => fireEvent.change(toggleSwitch, { target: { checked: false } }));
			await waitFor(() => {
				expect(toggleSwitch).not.toBeChecked();
			})

		}),
		it("Properly handles change in schema access", async () => {
			store = mockStore(initialState);
			const {debug} = render(
				<MemoryRouter>
					<Provider store={store}>
						<UserManagementTab />
					</Provider>
				</MemoryRouter>
			);
			await waitFor(() => {
				expect(screen.getByText("test@test.com")).toBeInTheDocument();
			})
			const multiSelect = screen.getByTestId('schema-multi-select')
			const select = within(multiSelect).getByRole('combobox');
			const chip = within(select).queryAllByRole('button')[0];
			const deleteIcon = within(chip).getByTestId('CancelIcon');
			act(() => fireEvent.click(deleteIcon));
			await waitFor(() => {
				expect(within(select).queryByText("mock schema name")).not.toBeInTheDocument();
			})

		})

})
