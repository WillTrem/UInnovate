import { describe, it, vi, expect } from 'vitest';
import axios from 'axios';
import { getRowsFromTable, getColumnsFromTable } from '../virtualmodel/FetchData';
import schemas from '../virtualmodel/FetchData';

vi.mock('axios');


describe('FetchData should fetch us tables with their schemas, table and data', () => {
it('should fetch us schemas and table titles',  () => {
    const schematable =  schemas;
    expect(schematable.length).toBeGreaterThan(0);
    expect(schematable[0].tables.length).toBeGreaterThan(0);

});

it('should get rows to return an array ', async () => {
    console.log()
    const schematable =  schemas;
    const nameOfTable = schematable[0].tables[0].name;
    console.log(nameOfTable);

    const rows = await getRowsFromTable(nameOfTable);
    expect(rows.length).toBeGreaterThanOrEqual(0);


    
});

it('should get columns to return an array ', async () => {
    const schematable = await schemas;
    const nameOfTable = schematable[0].tables[0].name;
    const columns = await getColumnsFromTable(nameOfTable);
    expect(columns.length).toBeGreaterThanOrEqual(0);


    
});
});
