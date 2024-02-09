import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import UserManagementTab from "../../../components/settingsPage/UserMangementTab"
import { describe, expect } from "vitest";
import { Middleware, Store } from "@reduxjs/toolkit";
import configureStore from "redux-mock-store";
import { Role } from "../../../redux/AuthSlice";
import { ConfigProvider } from "../../../contexts/ConfigContext";
import { Provider } from "react-redux";
import { ErrMsg } from "../../../components/settingsPage/SignupModal";

describe("UserManagementTab component", () => {
	const initialState = {
		schema: { schema_name: "application" },
		script_table: { table_name: "script_mock" },
		auth: { role: Role.ADMIN, user: "admin", token: "token" } 
	};
	const middlewares: Middleware[] = [];
	const mockStore = configureStore(middlewares);
	let store: Store;


	it("renders the component", () => {
		store = mockStore(initialState);
		render(
			<ConfigProvider>
				<Provider store={store}>
					<UserManagementTab />
				</Provider>
			</ConfigProvider>
		);
	}),
		it("displays the add user modal when the add user button is clicked", async () => {
			const { getByText } = render(<ConfigProvider>
				<Provider store={store}>
					<UserManagementTab />
				</Provider>
			</ConfigProvider>);
			const button = getByText("Add User");
			fireEvent.click(button);

			await waitFor(() => {
				const modalElement = screen.getByTestId('add-user-modal');
				expect(modalElement).toBeInTheDocument();
			});
		}),
		it("closes the add user modal when the cancel button is clicked", async () => {
			render(<ConfigProvider>
				<Provider store={store}>
					<UserManagementTab />
				</Provider>
			</ConfigProvider>);
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
		render(<ConfigProvider>
			<Provider store={store}>
				<UserManagementTab />
			</Provider>
		</ConfigProvider>);
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
				<ConfigProvider>
					<Provider store={store}>
						<UserManagementTab />
					</Provider>
				</ConfigProvider>
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

		})
})