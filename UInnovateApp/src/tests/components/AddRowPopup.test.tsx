import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect } from "vitest";
import AddRowPopup from '../../components/AddRowPopup'; 

const mockTable = {
    table_name: "mock_table",
    table_display_type: "enum", // or "list"
  };
  
  const mockColumns = [
    { column_name: "Column1" },
    { column_name: "Column2" },
    // Add more mock columns as needed
  ];
  
  const onCloseMock = () => console.log("onCloseMock was called");
  
  describe('AddRowPopup component', () => {
    it('renders the component with the correct title for enum type', async () => {
      render(
        <AddRowPopup onClose={onCloseMock} table={mockTable} columns={mockColumns} />
      );
  
      await waitFor(() => {
        const titleElement = screen.getByText("Adding a new Enumerated type");
        expect(titleElement).toBeInTheDocument();
      });
    });
  
    it('renders the component with the correct title for list type', async () => {
      const mockTableListType = { ...mockTable, table_display_type: "list" };
  
      render(
        <AddRowPopup onClose={onCloseMock} table={mockTableListType} columns={mockColumns} />
      );
  
      await waitFor(() => {
        const titleElement = screen.getByText("Adding a new List type");
        expect(titleElement).toBeInTheDocument();
      });
    });
  
    it('renders input fields for each column', async () => {
      render(
        <AddRowPopup onClose={onCloseMock} table={mockTable} columns={mockColumns} />
      );
  
      // Check if input fields are rendered for each column
      mockColumns.forEach((column) => {
        const inputElement = screen.getByLabelText(column.column_name);
        expect(inputElement).toBeInTheDocument();
      });
    });
  });