import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import { describe, expect } from "vitest";
import { Middleware, Store } from "@reduxjs/toolkit";
import configureStore from "redux-mock-store";
import UserManagementTab from "../../../components/settingsPage/Users/UserManagementTab";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { NavBar } from "../../../components/NavBar";
import SignupModal from "../../../components/settingsPage/SignupModal";

describe("Signup modal component", () => {
	const initialState = {
		schema: { schema_name: "application" },
		script_table: { table_name: "script_mock" },
		auth: { dbRole: null, user: null, token: null },
		userData: {
			users: [{ email: "mockuser123@test.com", role: "user", is_active: true, schema_access: ["mock schema name"], schemaRoles: {} },
			{ email: "mockAdmin@test.com", role: "administrator", is_active: true, schema_access: ["mock schema name"], schemaRoles: {} },
			{ email: "mockConfigurator@test.com", role: "configurator", is_active: true, schema_access: ["mock schema name"], schemaRoles: {} }]
		}
	};

	const middlewares: Middleware[] = [];
	const mockStore = configureStore(middlewares);
	let store: Store;

	it('renders the modal when clicking on the NavBar', async () => {
		// Arrange
		store = mockStore(initialState);
		const user = userEvent.setup();
		render(
			<MemoryRouter>
				<Provider store={store}>
					<NavBar />
				</Provider>
			</MemoryRouter>
		);

		const signupButton = screen.getByTestId('signup-button');
		// Act
		await act(() => {
			user.click(signupButton)
		})

		// Assert
		expect(await screen.findByText("Sign up (or Log in)")).toBeInTheDocument();
	}),
		it('transitions to the correct state when a known email address is written', async () => {
			// Arrange
			store = mockStore(initialState);
			const user = userEvent.setup();
			const { debug } = render(
				<MemoryRouter>
					<Provider store={store}>
						<SignupModal open={true} />
					</Provider>
				</MemoryRouter>
			);


			const nextButton = screen.getByTestId('next-button');
			const emailInput = screen.getByLabelText('Email');
			debug(emailInput);

			await act(async () => {
				await user.type(emailInput, "test@test.com");
				user.click(nextButton);
			});

			const elements = await screen.findAllByText("Log in");
			expect(elements).toHaveLength(2);
			elements.forEach(element => {
				expect(element).toBeInTheDocument();
			});
		})

});