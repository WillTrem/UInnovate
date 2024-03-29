import { act, render, screen, waitFor } from '@testing-library/react';
import { describe, expect } from "vitest";
import AddRowPopup from '../../components/AddRowPopup';
import store from '../../redux/Store';
import { Provider } from 'react-redux';
import VMD, { ColumnMock, TableMock } from "../../virtualmodel/__mocks__/VMD";
import { Close } from '@mui/icons-material';

const mockTable = {
  table_name: "mock_table",
  table_display_type: "enum", // or "list"

};
const Col1 = new ColumnMock("Column1")
const Col2 =new ColumnMock("Column2")
Col1.setReferencesTable("i am not null")
Col1.setReferencesBy("Ref_by")


const mockCols= [
  Col1, Col2
]
const table = new TableMock("example");

table.addColumn(Col1)
table.addColumn(Col2)

const mockColumns = [
  {
    column_name: "column1",
    column_type: "string",
    is_visible: true,
    reqOnCreate: true,
    references_table: null,
    is_editable: false,
    references_by: null,
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

const mockColumns2 = [
  {
    column_name: "column1",
    column_type: "string",
    is_visible: true,
    reqOnCreate: true,
    references_table: null,
    is_editable: false,
    references_by: null,
    referenced_table: "",
    referenced_by: "",
  },

  {
    column_name: "column2",
    column_type: "string",
    is_visible: true,
    reqOnCreate: true,
    references_table: "filegroup",
    is_editable: false,
    references_by: "",
    referenced_table: "",
    referenced_by: ""
  },
  // Add more mock columns as needed
];




const getRows = vi.fn();
const onClose = vi.fn();


describe('AddRowPopup component', () => {
  it('renders the component with the correct title for enum type', async () => {
    render(
      <Provider store={store}>
        <AddRowPopup getRows={getRows} onClose={onClose} table={mockTable} columns={mockCols} />
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
        <AddRowPopup getRows={getRows} onClose={onClose} table={mockTableListType} columns={mockCols} />
      </Provider>
    );

    await waitFor(() => {
      const titleElement = screen.getByText("Adding a new List type");
      expect(titleElement).toBeInTheDocument();
    });
  });

  it('renders input fields and select field and when submit is clicked ', async () => {
    render(
      <Provider store={store}>
        <AddRowPopup getRows={getRows} onClose={onClose} table={table} columns={mockColumns} />
      </Provider>
    );
    await waitFor(() => expect(VMD.getTableDisplayField).toHaveBeenCalled());

    const inputElement = screen.getByTestId("input-field");
    expect(inputElement).toBeInTheDocument();

    const SelectInput = screen.getByTestId("select-field");
    expect(SelectInput).toBeInTheDocument();
    
    act(() => SelectInput.click());
    
    const SelectFieldItems = screen.getAllByTestId("select-field-item");
    expect(SelectFieldItems).toBeGreaterThanOrEqual(1);
  


    const SubmitButton = screen.getByTestId("submit-button");
    expect(SubmitButton).toBeInTheDocument();
    act(() => SubmitButton.click());
    await waitFor(() => {
      expect(VMD.getAddRowDataAccessor).toHaveBeenCalled();
      expect(getRows).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });
    
   

  });

  it('renders only input fields and when close button is clicked', async () => {
    render(
      <Provider store={store}>
        <AddRowPopup getRows={getRows} onClose={onClose} table={table} columns={mockColumns2} />
      </Provider>
    );
    const inputElements = screen.getAllByTestId("input-field");
    expect(inputElements).toHaveLength(2);
    const CloseButton = screen.getByTestId("close-button");
    expect(CloseButton).toBeInTheDocument(); 
    act(() => CloseButton.click());

    expect(onClose).toHaveBeenCalled();

    
    });
});