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
		},
		languageSelection:{
			lang: "en",
  			translations: [
				{
					languageCode:'fr',
					values:[
						{translation_id: 1, language_code: 'fr', key_code: 'settings', value: 'Configuration', is_default: true},
						{translation_id: 4, language_code: 'fr', key_code: 'audit_trails', value: '', is_default: true}]
				},
				{
					languageCode:'en',
					values:[
						{translation_id: 5, language_code: 'en', key_code: 'settings', value: 'Settings', is_default: true},
						{translation_id: 8, language_code: 'en', key_code: 'audit_trails', value: '', is_default: true}]
				}
			]
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
			

			await act(async () => {
				await user.type(emailInput, "test@test.com");
				user.click(nextButton);
			});
			debug()
			const elements = await screen.findAllByText("Log in");
			expect(elements).toHaveLength(2);
			elements.forEach(element => {
				expect(element).toBeInTheDocument();
			});
		}),
		it('logs in the user when a valid email/password combination is entered', async () => {
			// Arrange
			store = mockStore(initialState);
			const user = userEvent.setup();
			const { debug } = render(
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

			const emailInput = await screen.findByLabelText('Email');

			await act(async () => {
				await user.type(emailInput, "test@test.com");
				await user.type(emailInput, "{enter}");
				// user.click(nextButton);
			});

			expect(screen.getByTestId('password-field'));
			const passwordInput = screen.getByTestId('password-field')

			await act(async () => {
				await user.type(passwordInput, 'valid_password');
				await user.type(passwordInput, "{enter}");
			})
			debug();

			await waitFor(() => {
				expect(screen.queryByText("Incorrect password for the given email address")).not.toBeInTheDocument();
			})

		}), it('transitions to the correct state when a known yet unregistered email address is written', async () => {
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
			

			await act(async () => {
				await user.type(emailInput, "noregister@test.com");
				user.click(nextButton);
			});

			const elements = await screen.findAllByText("Sign up");
			expect(elements).toHaveLength(2);
			elements.forEach(element => {
				expect(element).toBeInTheDocument();
			});
		})
});