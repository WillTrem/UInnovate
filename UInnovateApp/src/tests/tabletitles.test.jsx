// TableTitles.test.jsx
import {describe, it} from 'vitest'
import { MemoryRouter } from 'react-router-dom'; // To wrap the component with a router context
import TableTitles from '../components/TableTitles';
import TestRenderer from 'react-test-renderer'

describe('renders table names as links', () => {
    const sampleAttr = [
        { table_name: 'Table1' },
        { table_name: 'Table2' },
        { table_name: 'Table3' },
      ];
    it("tests the children inside component", () =>{
        const tabletitles = TestRenderer.create(<MemoryRouter><TableTitles attr={sampleAttr} /></MemoryRouter>).toJSON();
        console.log(tabletitles)
    })
});
   