import { describe, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { TableVisibilityProvider, TableVisibilityType, useTableVisibility } from "../../contexts/TableVisibilityContext";

vi.mock('axios');

const newTableVisibilityMock: TableVisibilityType = {
	"table1": true,
	"table2": false
}
const TableVisibilityContextMockComponent = () => {
	const { tableVisibility, setTableVisibility } = useTableVisibility();

	return (
		<div>
			<div>Config: {Object.entries(tableVisibility).map(([key, value],) => <span key={key}>{key}:{value.toString()}</span>)}</div>
			<button onClick={() => setTableVisibility(newTableVisibilityMock)}>Update Config</button>
		</div>
	)
}

describe("TableVisibilityContext", () => {

	it("provides the context value", () => {
		render(<TableVisibilityProvider>
			<TableVisibilityContextMockComponent />
		</TableVisibilityProvider>)
	}),
		it("modifies the tableVisibility state with setTableVisibility", async () => {
			// Arrange
			render(<TableVisibilityProvider>
				<TableVisibilityContextMockComponent />
			</TableVisibilityProvider>);

			// Assert: tableVisibilty should not contain "table1"
			let tableVisibilityEntry = screen.queryByText("table1:true");
			expect(tableVisibilityEntry).not.toBeInTheDocument()

			// Act: calls 
			fireEvent.click(screen.getByRole('button'));

			// Assert: a config value with value 'valueMock' should have been added to the config
			tableVisibilityEntry = await screen.findByText("table1:true");
			expect(tableVisibilityEntry).toBeInTheDocument();

		}),
		it("throws an error if the useConfig hook is used without the ConfigProvider", () => {
			// Assert
			expect(() => render(<TableVisibilityContextMockComponent />)).toThrowError();
		})
})
