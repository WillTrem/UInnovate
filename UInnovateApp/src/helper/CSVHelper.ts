import {ParseResult, parse} from 'papaparse';
import { Table } from '../virtualmodel/VMD';

export function validateCSV(csvObject: ParseResult<unknown>, table: Table ) : boolean {
	const csvHeaders = csvObject.meta.fields;
	
	// Reject if the csv file doesn't have columns (headers)
	if(!csvHeaders){
		return false;
	}
	
	// Rejects if the csv file doesn't have the same number of headers as the table's number of columns
	if(csvHeaders.length !== table.columns.length){
		return false;
	}

	// Rejects if the csv file has duplicate headers
	if(new Set(csvHeaders).size !== csvHeaders.length){
		return false;
	}

	// Rejects if not all the table columns are included in the csv headers
	table.columns.every((column) => {
		if(!(csvHeaders.includes(column.column_name))){
			return false;
		}
	})
	return true;
}


// export async function loadCSVToDB(csvObject: ParseResult<unknown>, table: Table): Promise<boolean>{
	
// }