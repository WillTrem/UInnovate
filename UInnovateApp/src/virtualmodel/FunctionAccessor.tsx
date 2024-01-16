import axios from "axios"
import { Row } from "./DataAccessor";

export class FunctionAccessor {
	function_url: string;
	params?: { [key: string]: string };
	headers: { [key: string]: string };
	values?: Row;

	constructor(
		function_url: string,
		headers: { [key: string]: string },
		params?: { [key: string]: string },
		values?: Row
	) {
		this.function_url = function_url;
		this.headers = headers;
		this.params = params;
		this.values = values;
	}

	// Method to execute a database function
	// return type: AxiosResponse
	async executeFunction(config?: {}) {
		try {
			const response = await axios.post(this.function_url, this.values, {
				headers: this.headers,
				...config
			});

			return response;
		} catch (error) {
			// console.error("Error while executing function at " + this.function_url + " :", error.response.database);
			throw error;
		}
	}

	// Method to set the body of the function API call
	// return type: void
	setBody(body: Row) {
		this.values = body;
	}
}