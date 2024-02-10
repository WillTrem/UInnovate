import { render, screen } from '@testing-library/react';
import TableEnumView from '../components/TableEnumView';
import { MemoryRouter } from 'react-router-dom';
import { ConfigProvider } from '../contexts/ConfigContext';
import { Column, Table } from "../virtualmodel/VMD";



vi.mock("axios");
vi.mock("DataAccessor");
vi.mock("../contexts/ConfigContext)");
describe('TableEnumView', () => {
  it("renders a table with the specified attributes", async () => {
    // Sample data for testing
    // Making a mock single mock table
    const table = new Table("Table1");
    // Making a mock column array of three columns
    const columns = [
      new Column("Column1"),
      new Column("Column2"),
      new Column("Column3"),
    ];

    // Adding the columns to the table
    columns.forEach((column) => {
      table.addColumn(column);
    });

    render(
      <ConfigProvider>
        <MemoryRouter>
          <TableEnumView table={table} />
        </MemoryRouter>
      </ConfigProvider>
    );
});
});