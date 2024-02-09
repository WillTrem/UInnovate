import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect } from "vitest";
import LookUpTableDetails from '../../../components/SlidingComponents/LookUpTableDetails';

// Mocking the vmd module
import Table from "react-bootstrap/Table"; // Replace 'path/to/Table' with the actual path to the Table type

const mockTable: typeof Table = {
    lookup_tables: '{"1": "table1", "2": "table2"}',
    getColumns: () => [],
};

const renderComponent = () => render(<LookUpTableDetails table={mockTable} table_name="" table_display_type="" is_visible={false} has_details_view={false} />);

describe('LookUpTableDetails component', () => {

  it('renders the component with "Missing ConnectionID" state', async () => {
    globalThis.fetch = async () => ({
      json: async () => [{ /* Mock row data */ }],
    } as Response);

    renderComponent();

    // Wait for the asynchronous operations to complete
    await waitFor(() => {
      // Check for the presence of "Missing ConnectionID"
      const missingConnectionIDElement = screen.queryByText(/Missing ConnectionID/i);
      expect(missingConnectionIDElement).toBeInTheDocument();
    });
  });
});
