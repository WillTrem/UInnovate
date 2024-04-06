import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import AuthSliceReducer, { logIn, logOut, updateSchemaAccess, updateSchemaRoles, updateDefaultRole } from '../../redux/AuthSlice';

const mockStore = configureStore([]);

describe('authSlice', () => {
    let initialState: any;

    beforeEach(() => {
        initialState = {
            user: null,
            schemaAccess: [],
            schemaRoles: [],
            defaultRole: null
        };
    });

    it('logs in', () => {
        const store = mockStore(initialState);
        store.dispatch(logIn({ user: 'testUser' }));

        const actions = store.getActions();
        const expectedPayload = { type: 'auth/logIn', payload: { user: 'testUser' } };
        expect(actions).toEqual([expectedPayload]);
    });

    it('logs out', () => {
        const store = mockStore(initialState);
        store.dispatch(logOut());

        const actions = store.getActions();
        const expectedPayload = { type: 'auth/logOut' };
        expect(actions).toEqual([expectedPayload]);
    });

    it('updates schema access', () => {
        const store = mockStore(initialState);
        store.dispatch(updateSchemaAccess(['schema1', 'schema2']));

        const actions = store.getActions();
        const expectedPayload = { type: 'auth/updateSchemaAccess', payload: ['schema1', 'schema2'] };
        expect(actions).toEqual([expectedPayload]);
    });

    it('updates schema roles', () => {
        const store = mockStore(initialState);
        store.dispatch(updateSchemaRoles(['role1', 'role2']));

        const actions = store.getActions();
        const expectedPayload = { type: 'auth/updateSchemaRoles', payload: ['role1', 'role2'] };
        expect(actions).toEqual([expectedPayload]);
    });

    it('updates default role', () => {
        const store = mockStore(initialState);
        store.dispatch(updateDefaultRole('defaultRole'));

        const actions = store.getActions();
        const expectedPayload = { type: 'auth/updateDefaultRole', payload: 'defaultRole' };
        expect(actions).toEqual([expectedPayload]);
    });
});