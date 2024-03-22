import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { Table } from "../../../virtualmodel/VMD";
import VMD from "../../../virtualmodel/__mocks__/VMD";
import LookUpTableDetails from '../../../components/TableListViewComponents/LookUpTableDetails';



const table = new Table("table");
const table2 = new Table("table");

table.setLookupTables('{"row":{},"-1":"unit_scheduler : availability_status_id"}');
table2.setLookupTables('{"row":{},"-1":"none"}');

const row = { row: { id: '1' } };


const renderComponent = () => render(<LookUpTableDetails table={table} currentRow={row} />);

describe('LookUpTableDetails component', () => {



  it('renders text and runs the accessor', async () => {

    renderComponent();
    expect(VMD.getRowsDataAccessorForLookUpTable).toHaveBeenCalled();

    await waitFor(() => {
      const tabletext = screen.getByTestId('look-up-table-text')
      expect(tabletext).toBeInTheDocument(); // Check the first button
    });
  });

  it('renders the table', async () => {
    renderComponent();
    expect(VMD.getRowsDataAccessorForLookUpTable).toHaveBeenCalled();

    await waitFor(() => {
      const tableElement = screen.getByTestId("lookUp-table");
      expect(tableElement).toBeInTheDocument();
    });
  });

  it('checks if nothing shows', async () => {
    const { container } = render(<LookUpTableDetails table={table2} currentRow={row} />);

    expect(container.firstChild).toBeEmptyDOMElement();
  });



});
