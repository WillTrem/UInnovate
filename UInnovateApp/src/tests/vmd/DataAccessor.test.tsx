/* eslint-disable @typescript-eslint/no-unused-vars */
import { DataAccessor, Row } from '../../virtualmodel/DataAccessor';
import { describe, it, beforeAll, afterAll } from 'vitest';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

let mock: MockAdapter;

describe('DataAccessor', () => {
    beforeAll(() => {
        // Initialize axios-mock-adapter
        mock = new MockAdapter(axios);

        // Mock responses for your endpoints
        mock.onGet('/api/data').reply(200, /* mock response data for fetchRows */);
        mock.onPost('/api/data').reply(201, /* mock response data for addRow */);
    });

    afterAll(() => {
        // Restore axios to its original functionality
        mock.restore();
    });

    it('fetchRows should fetch data successfully', async () => {
        const dataAccessor = new DataAccessor('/api/data', { Authorization: 'Bearer token' });

        const rows = await dataAccessor.fetchRows();

        // Your test assertions for fetching rows
        // For example: expect(rows).toEqual(/* Your expected result here */);
    });

    it('addRow should add a row successfully', async () => {
        const dataAccessor = new DataAccessor('/api/data', { Authorization: 'Bearer token' }, undefined, new Row({ column1: 'value1' }));

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const response = await dataAccessor.addRow();

        // Your test assertions for adding a row
        // For example: expect(response).toEqual(/* Your expected result here */);
    });

    // Other tests 
});