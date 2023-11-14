import { describe, it, vi } from 'vitest';
import TestRenderer from 'react-test-renderer'
import TableListView from '../components/TableListView';
import { MemoryRouter } from 'react-router-dom';

vi.mock('axios');
describe('TableListView component', () => {
  it('renders a table with the specified attributes', () => {
    // Sample data for testing
    const attr = [
      {
        table_name: 'Table1',
        attributes: ['Attribute1', 'Attribute2', 'Attribute3'],
      },
      {
        table_name: 'Table2',
        attributes: ['Attribute4', 'Attribute5', 'Attribute6'],
      },
    ];


    const tablelistview = TestRenderer.create(<MemoryRouter><TableListView attr={attr} /></MemoryRouter>).toJSON();
    console.log(tablelistview)
  });
});
