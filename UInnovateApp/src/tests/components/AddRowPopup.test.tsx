import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect } from "vitest";
import AddRowPopup from '../../components/AddRowPopup';
import store from '../../redux/Store';
import { Provider } from 'react-redux';
import { ColumnMock, TableMock } from "../../virtualmodel/__mocks__/VMD";

const mockTable = {
  table_name: "mock_table",
  table_display_type: "enum", // or "list"

};


const mockColumns = [
  {
    column_name: "column1",
    column_type: "string",
    is_visible: true,
    reqOnCreate: true,
    references_table: "",
    is_editable: false,
    references_by: "",
    referenced_table: "",
    referenced_by: "",
  },

  {
    column_name: "column2",
    column_type: "string",
    is_visible: true,
    reqOnCreate: true,
    references_table: "Ref table",
    is_editable: false,
    references_by: "",
    referenced_table: "",
    referenced_by: ""
  },
  // Add more mock columns as needed
];

const table = new TableMock("example");


const onCloseMock = () => console.log("onCloseMock was called");
const getRowsMock = () => console.log("getRowsMock was called");

describe('AddRowPopup component', () => {
  it('renders the component with the correct title for enum type', async () => {
    render(
      <Provider store={store}>
        <AddRowPopup getRows={getRowsMock} onClose={onCloseMock} table={mockTable} columns={mockColumns} />
      </Provider>
    );

    await waitFor(() => {
      const titleElement = screen.getByText("Adding a new Enumerated type");
      expect(titleElement).toBeInTheDocument();
    });
  });

  it('renders the component with the correct title for list type', async () => {
    const mockTableListType = { ...mockTable, table_display_type: "list" };

    render(
      <Provider store={store}>
        <AddRowPopup getRows={getRowsMock} onClose={onCloseMock} table={mockTableListType} columns={mockColumns} />
      </Provider>
    );

    await waitFor(() => {
      const titleElement = screen.getByText("Adding a new List type");
      expect(titleElement).toBeInTheDocument();
    });
  });

  it('renders input fields for each column', async () => {
    render(
      <Provider store={store}>
        <AddRowPopup getRows={getRowsMock} onClose={onCloseMock} table={mockTable} columns={mockColumns} />
      </Provider>
    );
    const inputElement1 = screen.getByTestId("select-field");
    expect(inputElement1).toBeInTheDocument();

    const inputElement = screen.getByTestId("input-field");
    expect(inputElement).toBeInTheDocument();

    
  });
});