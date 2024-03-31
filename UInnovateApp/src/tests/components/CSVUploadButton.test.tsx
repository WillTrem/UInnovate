import { CSVUploadButton } from '../../components/CSVUploadButton';
import { render, fireEvent, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from "redux-mock-store";
import { loadCSVToDB, validateCSV } from '../../helper/CSVHelper';
// import { displayError, displayNotification } from '../../redux/NotificationSlice';
import * as NotificationSlice from '../../redux/NotificationSlice';
import { Middleware, Store } from '@reduxjs/toolkit';
import { Role } from '../../redux/AuthSlice';
import { TableMock } from '../../virtualmodel/__mocks__/VMD';
import { MockInstance, describe, expect } from "vitest";

vi.mock('../../helper/CSVHelper', () => ({
	validateCSV: vi.fn(),
	loadCSVToDB: vi.fn(),
}));


describe('CSVUploadButton', () => {

	let mockDisplayError: MockInstance;
	let mockDisplayNotification: MockInstance;

	beforeEach(() => {
		mockDisplayError = vi.spyOn(NotificationSlice, 'displayError');
		mockDisplayNotification = vi.spyOn(NotificationSlice, 'displayNotification');
	});

	afterEach(() => {
		mockDisplayError.mockRestore();
		mockDisplayNotification.mockRestore();
	});
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
	it('dispatches error when file is not CSV', () => {
		store = mockStore(initialState);
		const file = new File([''], 'test.txt', { type: 'text/plain' });
		const { getByLabelText } = render(
			<Provider store={store}>
				<CSVUploadButton table={new TableMock('table')} getRows={() => Promise.resolve()} />
			</Provider>
		);
		const input = getByLabelText('Upload CSV');
		fireEvent.change(input, { target: { files: [file] } });
		expect(mockDisplayError).toHaveBeenCalledWith(`ERROR: 'test.txt' is not in CSV format.`);
	});

	it('validates and loads CSV data when file is CSV', async () => {
		store = mockStore(initialState);
		const file = new File(['id,name\n1,test'], 'test.csv', { type: 'text/csv' });
		const { getByLabelText } = render(
			<Provider store={store}>
				<CSVUploadButton table={new TableMock('table')} getRows={() => Promise.resolve()} />
			</Provider>
		);
		const input = getByLabelText('Upload CSV');
		await act(()=>fireEvent.change(input, { target: { files: [file] } }));
		await new Promise(resolve => setImmediate(resolve));  // Wait for promises to resolve
		expect(validateCSV).toHaveBeenCalled();
		expect(loadCSVToDB).toHaveBeenCalled();
	});
});