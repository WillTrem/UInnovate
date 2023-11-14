import {vi} from 'vitest'
const table_url = "http://localhost:3000/tables";
const attr_url = "http://localhost:3000/columns";

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
				case table_url:
				return Promise.resolve({data:mock_table_data});
				case attr_url:
				return Promise.resolve({data: mock_table_attr});
				default:
				return Promise.reject(new Error("API call to this URL hasn't been mocked."))
			}	
		}
	})
};