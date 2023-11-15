import { vi } from "vitest";
const tableURL = "http://localhost:3000/tables";
const attrURL = "http://localhost:3000/columns";
const appconfig_valuesURL = "http://localhost:3000/appconfig_values";
const tools_url = "http://localhost:3000/tools";
const customers_url = "http://localhost:3000/customers";
const rentals_url = "http://localhost:3000/rentals";

const noMockErrorMessage = "API call to this URL hasn't been mocked.";

const mock_table_data = [
  { table: "Table1", schema: "Schema1" },
  { table: "Table2", schema: "Schema1" },
];
const mock_table_attr = [
  { column: "Column1", table: "Table1", schema: "Schema1" },
  { column: "Column2", table: "Table1", schema: "Schema1" },
  { column: "Column3", table: "Table1", schema: "Schema1" },
  { column: "Column1", table: "Table2", schema: "Schema1" },
  { column: "Column2", table: "Table2", schema: "Schema1" },
  { column: "Column3", table: "Table2", schema: "Schema1" },
];
const mock_config_values = [
  {
    id: "1",
    column: "Column1",
    table: "Table1",
    property: "Property1",
    value: "Value1",
  },
  {
    id: "6",
    column: "Column2",
    table: "Table1",
    property: "Property1",
    value: "Value2",
  },
  {
    id: "4",
    column: "Column3",
    table: "Table1",
    property: "Property1",
    value: "Value3",
  },
  {
    id: "5",
    column: "Column1",
    table: "Table2",
    property: "Property1",
    value: "Value4",
  },
  {
    id: "3",
    column: "Column2",
    table: "Table2",
    property: "Property1",
    value: "Value5",
  },
  {
    id: "2",
    column: "Column3",
    table: "Table2",
    property: "Property1",
    value: "Value6",
  },
];
export default {
  get: vi.fn().mockImplementation((url, { headers }) => {
    if (headers["Accept-Profile"] === "meta") {
      switch (url) {
        case tableURL:
          return Promise.resolve({ data: mock_table_data });
        case attrURL:
          return Promise.resolve({ data: mock_table_attr });
        case appconfig_valuesURL:
          return Promise.resolve({ data: mock_config_values });
        default:
          return Promise.reject(new Error(noMockErrorMessage));
      }
    }
  }),
  post: vi.fn().mockImplementation((url, data, { headers }) => {
    if (headers["Content-Profile"] === "meta") {
      switch (url) {
        case appconfig_valuesURL:
          return Promise.resolve();
        default:
          return Promise.reject(new Error(noMockErrorMessage));
      }
    } else if (headers["Content-Profile"] === "application") {
      switch (url) {
        case tools_url:
          return Promise.resolve({
            data: { message: `Tool added: ${data.name}` },
          });
        case customers_url:
          return Promise.resolve({
            data: { message: `Tool added: ${data.firstname}` },
          });
        case rentals_url:
          return Promise.resolve({
            data: {
              message: `Tool added: ${data.toolid} for customer: ${data.customerid}`,
            },
          });
        default:
          return Promise.reject(new Error(noMockErrorMessage));
      }
    }
  }),
};
