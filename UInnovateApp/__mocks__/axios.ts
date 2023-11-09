import {vi} from 'vitest'
const tableURL = "http://localhost:3000/tables";
const attrURL = "http://localhost:3000/columns";
const appconfig_valuesURL = "http://localhost:3000/appconfig_values";

const noMockErrorMessage = "API call to this URL hasn't been mocked.";

const mock_table_data = [{table: 'Table1', schema: 'Schema1'}, {table: 'Table2', schema: 'Schema1'}]
const mock_table_attr = [
  {column: 'Column1', table: 'Table1', schema: 'Schema1'},
  {column: 'Column2', table: 'Table1', schema: 'Schema1'},
  {column: 'Column3', table: 'Table1', schema: 'Schema1'},
  {column: 'Column1',table: 'Table2', schema: 'Schema1'},
  {column: 'Column2',table: 'Table2', schema: 'Schema1'},
  {column: 'Column3',table: 'Table2', schema: 'Schema1'},
]
export default {
	get: vi.fn().mockImplementation((url, {headers}) => {
		if(headers["Accept-Profile"] === "meta"){
			switch (url) {
				case tableURL:
				return Promise.resolve({data:mock_table_data});
				case attrURL:
				return Promise.resolve({data: mock_table_attr});
				default:
				return Promise.reject(new Error(noMockErrorMessage))
			}	
		}
	}),
	post: vi.fn().mockImplementation((url, data, {headers}) => {
		if(headers["Content-Profile"] === "meta"){
			switch(url){
				case appconfig_valuesURL:
					return Promise.resolve();
				default:
					return Promise.reject(new Error(noMockErrorMessage))
			}
		}
	})
};