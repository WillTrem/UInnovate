import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { describe, expect } from "vitest";
import { Middleware, Store } from "@reduxjs/toolkit";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { Role } from "../../../redux/AuthSlice";
import { CronJobsTab } from "../../../components/settingsPage/CronJobsTab";
const COMPONENT_NAME = "CronJobTabs"
describe(COMPONENT_NAME, () => {
	const initialState = {
		schema: { value: "mock schema name" },
		script_table: { table_name: "script_mock" },
		auth: { dbRole: Role.ADMIN, user: "admin", token: "token", schema_access: ["mock schema name"] },
		userData: {
			users: [{ email: "mockuser123@test.com", role: "user", is_active: true, schema_access: ["mock schema name"], schemaRoles: {} },
			{ email: "mockAdmin@test.com", role: "administrator", is_active: true, schema_access: ["mock schema name"], schemaRoles: {} },
			{ email: "mockConfigurator@test.com", role: "configurator", is_active: true, schema_access: ["mock schema name"], schemaRoles: {} }]
		}
	};

	const middlewares: Middleware[] = [];
	const mockStore = configureStore(middlewares);
	let store: Store;

	it(`renders the ${COMPONENT_NAME} component`, async () => {
		store = mockStore(initialState);
		render(
			<MemoryRouter>
				<Provider store={store}>
					<CronJobsTab/>
				</Provider>
			</MemoryRouter>
		);
	}),
	it(`handles scheduling/unscheduling cron jobs`, async () => {
		store = mockStore(initialState);
		const user = userEvent.setup();
		render(
			<MemoryRouter>
				<Provider store={store}>
					<CronJobsTab/>
				</Provider>
			</MemoryRouter>
		);

		const procedureSelect = (await screen.findByText('Select a procedure')).parentElement as HTMLElement;
		await act(async () => {
			user.selectOptions(procedureSelect, "function1");
		})
		
		const timeScheduleInput = await screen.findByPlaceholderText("* * * * *");
		await act(async () => {
			await fireEvent.change(timeScheduleInput, { target: {value: "1 * * * *"}})
		})

		const scheduleButton = screen.getByText('Schedule Job');
		const unscheduleButton = screen.getByText('Unschedule Job');

		await act(async () => {
			await user.click(scheduleButton);
		});
		await act(async () => {
			await user.click(unscheduleButton);
		});
	})
	
});