import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect } from 'vitest'
import { ConfigProvider } from '../../../contexts/ConfigContext'
import { TablesContextProvider } from '../../../contexts/TablesContext'
import { ColumnConfig } from '../../../components/settingsPage/ColumnConfig'
vi.mock("axios");
describe("TableItem component", (() => {
	it("renders the component", () => {
		render(
			<TablesContextProvider>
				<ConfigProvider>
					<ColumnConfig tableName='Table1' />
				</ConfigProvider>
			</TablesContextProvider>)
	}),
		it("modifies the config on visibility toggle", async () => {
			// Arrange
			render(
				<TablesContextProvider>
					<ConfigProvider>
						<ColumnConfig tableName='Table1' />
					</ConfigProvider>
				</TablesContextProvider>)

			// Act - toggle the visibility off for the first column
			fireEvent.click(screen.getAllByRole('checkbox')[0]);

			// Assert
			await waitFor(() => {
				const updatedToggle = screen.getAllByRole('checkbox')[0] as HTMLInputElement;
				expect(updatedToggle.checked).toBeFalsy();
			})
		})
}))