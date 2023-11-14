import { describe, it, vi, expect } from 'vitest';
import DisplayTab from '../components/settingsPage/DisplayTab';
import { render } from '@testing-library/react';
import { TablesContextProvider } from '../contexts/TablesContext';
import { ConfigProvider } from '../contexts/ConfigContext';

vi.mock('axios');
describe('DisplayTab component', () => {
	it('renders the component', () => {
		render(
			<TablesContextProvider>
				<ConfigProvider>
					<DisplayTab />
				</ConfigProvider>
			</TablesContextProvider>);
	});
	it('shows the list of tables', () => {
		const { getAllByTestId } = render(
			<TablesContextProvider>
				<ConfigProvider>
					<DisplayTab />
				</ConfigProvider>
			</TablesContextProvider>);
		const tableNavs = getAllByTestId("table-setting-nav");

		expect(tableNavs.length).toBeGreaterThan(0);
	})
});

