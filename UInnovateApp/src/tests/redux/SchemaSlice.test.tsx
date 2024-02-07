/* eslint-disable @typescript-eslint/no-unused-vars */
import { SchemaState, updateSelectedSchema } from '../../redux/SchemaSlice';
import schemaReducer from '../../redux/SchemaSlice';

describe('schemaSlice', () => {
    let initialState: SchemaState;
  
    beforeEach(() => {
      initialState = { value: 'initialSchema' };
      sessionStorage.setItem('selectedSchema', initialState.value); // Set initial sessionStorage state
    });
  
    it('updates selected schema', () => {
      // Dispatch the updateSelectedSchema action
      const newState = schemaReducer(initialState, updateSelectedSchema('newSchema'));
  
      // Verify that the state value is updated
      if (newState.value !== 'newSchema') {
        throw new Error('State value not updated correctly.');
      }
  
      // Verify that sessionStorage is updated
      const sessionStorageValue = sessionStorage.getItem('selectedSchema');
      if (sessionStorageValue !== 'newSchema') {
        throw new Error('Session storage value not updated correctly.');
      }
    });
  });