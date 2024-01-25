import axios from "axios";
import { DataAccessor, Row } from "./DataAccessor";
import { FunctionAccessor } from "./FunctionAccessor";

const API_BASE_URL = "http://localhost:3000/"; // TO CHANGE TO ENV VAR WHEN WE DEPLOY

// VMD Class
class VirtualModelDefinition {
  schemas: Schema[];
  data_fetched = false;
  config_data_fetched = false;

  // Constructor for the VMD object
  // return type : void
  constructor() {
    this.schemas = [];
  }

  // Method to add a new schema to the vmd object
  // return type : void
  addSchema(schema: Schema) {
    this.schemas.push(schema);
  }

  // Method to get a schema object from the vmd object
  // return type : Schema
  getSchema(schema_name: string) {
    return this.schemas.find((schema) => schema.schema_name === schema_name);
  }

  /* Method to return the schema of a table
  This method exists for cases where an app configurator has a duplicate name
  for a table across different schemas */
  // return type : Schema
  getTableSchema(table_name: string) {
    return this.schemas.find((schema) =>
      schema.tables.some((table) => table.table_name === table_name)
    );
  }

  // Method to get a table object from the vmd object
  // return type : Table
  getTable(schema_name: string, table_name: string) {
    return this.getSchema(schema_name)?.tables.find(
      (table) => table.table_name === table_name
    );
  }

  // Method to get all tables from a schema
  // return type : Table[]
  getTables(schema_name: string) {
    return this.getSchema(schema_name)?.tables;
  }

  // Method to get all visible tables from a schema
  // return type : Table[]
  getVisibleTables(schema_name: string) {
    return this.getSchema(schema_name)?.tables.filter(
      (table) => table.is_visible
    );
  }

  // Method to get all tables from the vmd object
  // return type : Table[]
  getAllTables() {
    const tables: Table[] = [];
    this.schemas.forEach((schema) => {
      schema.tables.forEach((table) => {
        tables.push(table);
      });
    });
    return tables;
  }

  // Method to set a table's visibility in the vmd object
  // return type : void
  setTableVisibility(
    schema_name: string,
    table_name: string,
    is_visible: boolean
  ) {
    this.getTable(schema_name, table_name)!.is_visible = is_visible;
  }

  // Method to get a table's display type from the vmd object
  // return type : string
  getTableDisplayType(schema_name: string, table_name: string) {
    return this.getTable(schema_name, table_name)?.table_display_type;
  }

  // Method to set a table's display type in the vmd object
  // return type : void
  setTableDisplayType(
    schema_name: string,
    table_name: string,
    display_type: string
  ) {
    this.getTable(schema_name, table_name)!.table_display_type = display_type;
  }

  // Method to get a column object from the vmd object
  // return type : Column
  getColumn(schema_name: string, table_name: string, column_name: string) {
    return this.getTable(schema_name, table_name)?.columns.find(
      (column) => column.column_name === column_name
    );
  }

  // Method to get all visible columns for a specific table (for list view)
  // return type : Column[]
  getVisibleColumns(schema_name: string, table_name: string) {
    return this.getTable(schema_name, table_name)?.columns.filter(
      (column) => column.is_visible
    );
  }

  // Method to return the enum view's column for a specific table
  // return type : Column
  getEnumViewColumn(schema_name: string, table_name: string) {
    const visibleColumns = this.getVisibleColumns(schema_name, table_name);
    const enumColumn = visibleColumns?.find(
      (column) =>
        column.column_name.toLowerCase() === "name" ||
        column.column_name.toLowerCase() === "type"
    );

    // If no enum column is found, return the first column
    return enumColumn || visibleColumns?.[0];
  }

  // Method to return all schemas in the vmd object
  // return type : Schema[]
  getSchemas() {
    return this.schemas;
  }

  // Method to print the vmd object
  // return type : void
  printVMD() {
    console.log(this.schemas);
  }

  // Method to fetch schemas, tables, and columns from the API
  // return type : void
  async fetchSchemas() {
    // Check if data has already been fetched; if it has, do not fetch again
    // The fetch method should only be called once, if we want to refetch, use the refetch method
    if (this.data_fetched) {
      return;
    }
    const col_url = API_BASE_URL + "columns";
    const views_url = API_BASE_URL + "views";

    try {
      let response = await axios.get(col_url, {
        headers: { "Accept-Profile": "meta" },
      });
      let data = response.data;
      data.forEach((data: ColumnData) => {
        // Check if the specified schema already exists within the vmd object
        let schema = this.getSchema(data.schema);
        if (!schema) {
          // If schema does not exist, make it and add it to the vmd object
          schema = new Schema(data.schema);
          this.addSchema(schema);
        }

        // Check if table already exists within the schema object
        let table = schema.getTable(data.table);
        if (!table) {
          // If table does not exist, make it and add it to the schema object
          table = new Table(data.table);
          schema.addTable(table);
        }

        // Add column to the table object
        table.addColumn(
          new Column(data.column),
          data.references_table,
          data.is_editable
        );
      });

      // Fetching all the VIEWS
      response = await axios.get(views_url, {
        headers: { "Accept-Profile": "meta" },
      });

      data = response.data;

      data.forEach((data: ViewData) => {
        // Check if the specified schema already exists within the vmd object
        let schema = this.getSchema(data.schema);
        if (!schema) {
          // If schema does not exist, make it and add it to the vmd object
          schema = new Schema(data.schema);
          this.addSchema(schema);
        }

        // Check if view already exists within the schema object
        let view = schema.getView(data.view);
        if (!view) {
          // If view does not exist, make it and add it to the schema object
          view = new View(data.view);
          schema.addView(view);
        }
      });

      this.data_fetched = true;
    } catch (error) {
      console.error("Error:", error);
    }
  }

  // Method to fetch app config from the API and update the columns in the vmd object
  // return type : void
  async fetchConfig() {
    // Check if data has already been fetched; if it has, do not fetch again
    // The fetch method should only be called once, if we want to refetch, use the refetch method
    if (this.config_data_fetched) {
      return;
    }
    const config_url = API_BASE_URL + "appconfig_values";

    try {
      const response = await axios.get(config_url, {
        headers: { "Accept-Profile": "meta" },
      });
      const data: ConfigData[] = response.data;

      data.forEach((config) => {
        // Find the table's schema
        const schema = this.getTableSchema(config.table);

        if (!schema) {
          // If the schema doesn't exist, skip this config
          return;
        }

        // Find the corresponding table and column
        const table = this.getTable(schema?.schema_name, config.table);

        if (!table) {
          // If the table doesn't exist, skip this config
          return;
        }

        let column = table?.columns.find(
          (col) => col.column_name === config.column
        );

        if (!column) {
          column = new Column("Dummy Column");
        }

        // Update the column or table properties based on the config
        switch (config.property) {
          case "visible": {
            // If the config is for the table, set the table's visibility
            // Otherwise, set the column's visibility
            config.column === null
              ? (table.is_visible = config.value === "true")
              : (column.is_visible = config.value === "true");
            break;
          }
          case "column_display_type":
            column.column_type = config.value as string;
            break;
          case "table_view":
            table.table_display_type = config.value as string;
            break;
          case "details_view":
            table.has_details_view = config.value === "true";
            break;
          case "stand_alone_details_view":
            table.stand_alone_details_view = config.value === "true";
            break;
          case "lookup_tables":
            table.lookup_tables = config.value as string;
            break;
          case "lookup_counter":
            table.lookup_counter = config.value as string;
            break;
        }
      });
      this.config_data_fetched = true;
    } catch (error) {
      console.error(
        "Could not update the configurations for the columns:",
        error
      );
    }
  }

  // Method to refetch schemas, tables, columns and configs from the API when called
  // return type : void
  async refetchSchemas() {
    // In refetch we clear the schemas array and then fetch them again
    this.schemas = [];
    this.data_fetched = false;
    this.config_data_fetched = false;
    await this.fetchSchemas();
    await this.fetchConfig();
  }

  // Method to return a data accessor object to fetch rows from a table
  // return type : DataAccessor
  getRowsDataAccessor(schema_name: string, table_name: string) {
    const schema = this.getSchema(schema_name);
    const table = this.getTable(schema_name, table_name);
    if (schema && table) {
      return new DataAccessor(table.url, {
        "Accept-Profile": schema.schema_name,
      });
    } else {
      throw new Error("Schema or table does not exist");
    }
  }

  // Method to return a data accessor object to fetch rows from a table with ordering and pagination involved
  // return type : DataAccessor
  getRowsDataAccessorForOrder(schema_name: string, table_name: string, order_by: string, Limit: number, Page: number) {
    const schema = this.getSchema(schema_name);
    const table = this.getTable(schema_name, table_name);
    const limit = Limit.toString();
    const page = ((Page - 1) * Limit).toString();
    if (schema && table) {
      return new DataAccessor(table.url + "?order=" + order_by + "&limit=" + limit + "&offset=" + page, {
        "Accept-Profile": schema.schema_name,
      });
    } else {
      throw new Error("Schema or table does not exist");
    }
  }
  // Method to return a data accessor object to fetch rows from a table For Look up Table
  // return type : DataAccessor
  getRowsDataAccessorForLookUpTable(schema_name: string, table_name: string, SearchKey: string, SearchValue: string) {
    const schema = this.getSchema(schema_name);
    const table = this.getTable(schema_name, table_name);

    if (schema && table) {
      return new DataAccessor(table.url + "?" + SearchKey + "=eq." + SearchValue, {
        "Accept-Profile": schema.schema_name,
      });
    } else {
      throw new Error("Schema or table does not exist");
    }
  }

  // Method to return a data accessor object to add a row to a table
  // return type : DataAccessor
  getAddRowDataAccessor(schema_name: string, table_name: string, row: Row) {
    const schema = this.getSchema(schema_name);
    const table = this.getTable(schema_name, table_name);

    if (schema && table) {
      return new DataAccessor(
        table.url,
        {
          Prefer: "return=representation",
          "Content-Type": "application/json",
          "Content-Profile": schema_name,
        },
        undefined,
        row
      );
    } else {
      throw new Error("Schema or table does not exist");
    }
  }

  // Method to return a data accessor object to update a row in a table
  // return type : DataAccessor
  getUpdateRowDataAccessor(schema_name: string, table_name: string, row: Row) {
    const schema = this.getSchema(schema_name);
    const table = this.getTable(schema_name, table_name);

    if (schema && table) {
      return new DataAccessor(
        `${table.url}?id=eq.${row["id"]}`, // PostgREST URL for updating a row from its id
        {
          Prefer: "return=representation",
          "Content-Type": "application/json",
          "Content-Profile": schema_name,
        },
        undefined,
        row
      );
    } else {
      throw new Error("Schema or table does not exist");
    }
  }

  // Method to return a data accessor object to update a row in a table
  // return type : DataAccessor
  getUpdateRowDataAccessorView(schema_name: string, table_name: string, row: Row, primarykey: string, primarykeyvalue: string) {
    const schema = this.getSchema(schema_name);
    const table = this.getTable(schema_name, table_name);

    if (schema && table) {
      return new DataAccessor(
        `${table.url}?${primarykey}=eq.${primarykeyvalue}`, // PostgREST URL for updating a row from its id
        {
          Prefer: "return=representation",
          "Content-Type": "application/json",
          "Content-Profile": schema_name,
        },
        undefined,
        row
      );
    } else {
      throw new Error("Schema or table does not exist");
    }
  }
  // Method to return a data accessor object to upsert a set of rows in a table
  // return type : DataAccessor
  getUpsertDataAccessor(
    schema_name: string,
    table_name: string,
    params: { [key: string]: string },
    row: Row
  ) {
    const schema = this.getSchema(schema_name);
    const table = this.getTable(schema_name, table_name);

    if (schema && table) {
      return new DataAccessor(
        table.url,
        {
          Prefer: "resolution=merge-duplicates",
          "Content-Type": "application/json",
          "Content-Profile": schema_name,
        },
        params,
        row
      );
    } else {
      throw new Error("Schema or table does not exist");
    }
  }

  // Method to return a data accessor to get all the rows from a view of a given schema
  // return type: DataAccessor
  getViewRowsDataAccessor(
    schema_name: string,
    view_name: string
  ): DataAccessor {
    const schema = this.getSchema(schema_name);
    const view = schema?.getView(view_name);
    if (schema && view) {
      return new DataAccessor(view.url, {
        "Accept-Profile": schema.schema_name,
      });
    } else {
      throw new Error("Schema or view does not exist");
    }
  }
  // Method to return a function accessor to call a database function (stored procedure)
  // return type: FunctionAccessor
  getFunctionAccessor(
    schema_name: string,
    function_name: string
  ): FunctionAccessor {
    const schema = this.getSchema(schema_name);
    if (schema) {
      const function_url = API_BASE_URL + "rpc/" + function_name;
      return new FunctionAccessor(function_url, {
        "Content-Profile": schema.schema_name,
      });
    } else {
      throw new Error("Schema does not exist");
    }
  }
}

// Schema, Table, and Column classes
export class Schema {
  schema_name: string;
  tables: Table[];
  views: View[];

  constructor(schema_name: string) {
    this.schema_name = schema_name;
    this.tables = [];
    this.views = [];
  }

  // Method to add a new table to the schema object
  addTable(table: Table) {
    this.tables.push(table);
  }

  // Method to get a table object from the schema object
  getTable(table_name: string) {
    return this.tables.find((table) => table.table_name === table_name);
  }
  // Method to add a new view to the schema object
  addView(view: View) {
    this.views.push(view);
  }

  // Method to get a view object from the schema object
  getView(view_name: string) {
    return this.views.find((view) => view.view_name === view_name);
  }
}

export class Table {
  table_name: string;
  table_display_type: string;
  is_visible: boolean;
  has_details_view: boolean;
  columns: Column[];
  url: string;
  lookup_tables: string;
  stand_alone_details_view: boolean;
  lookup_counter: string;

  constructor(table_name: string) {
    this.table_name = table_name;
    this.table_display_type = "list";
    this.is_visible = true;
    this.has_details_view = true;
    this.columns = [];
    this.url = API_BASE_URL + table_name;
    this.lookup_tables = "null";
    this.stand_alone_details_view = false;
    this.lookup_counter = "0";
  }

  // Method to add a new column to the table object
  addColumn(column: Column, references_table: string, is_editable: boolean) {
    column.setReferenceTable(references_table);
    column.setEditability(is_editable);

    this.columns.push(column);
  }

  // Method to get a column object from the table object
  getColumn(column_name: string) {
    return this.columns.find((column) => column.column_name === column_name);
  }

  // Method to get all columns from the table object
  // return type : Column[]
  getColumns() {
    return this.columns;
  }

  // Method to get the table's required columns
  // return type : Column[]
  getRequiredColumns() {
    return this.columns.filter((column) => column.reqOnCreate === true);
  }

  // Method to get all visible columns from the table object
  // return type : Column[]
  getVisibleColumns() {
    return this.columns.filter((column) => column.is_visible);
  }

  // Method to return the enum view's column from the table object
  // return type : Column
  getEnumViewColumn() {
    const visibleColumns = this.getVisibleColumns();
    const enumColumn = visibleColumns?.find(
      (column) =>
        column.column_name.toLowerCase() === "name" ||
        column.column_name.toLowerCase() === "type"
    );
    // If no enum column is found, return the first column
    return enumColumn || visibleColumns?.[0];
  }

  // Method to get the table's display type
  // return type : string
  getDisplayType() {
    return this.table_display_type;
  }

  // Method to set the table's display type
  // return type : void
  setDisplayType(table_display_type: string) {
    this.table_display_type = table_display_type;
  }

  // Method to get the table's visibility
  // return type : boolean
  getVisibility() {
    return this.is_visible;
  }

  // Method to set the table's visibility
  // return type : void
  setVisibility(is_visible: boolean) {
    this.is_visible = is_visible;
  }

  // Method to get the table's details view
  // return type : boolean
  getHasDetailsView() {
    return this.has_details_view;
  }

  // Method to set the table's details view
  // return type : void
  setHasDetailsView(has_details_view: boolean) {
    this.has_details_view = has_details_view;
  }

  // Method to get the table's url
  // return type : string
  getURL() {
    return this.url;
  }

  // Method to set the table's url
  // return type : void
  setURL(url: string) {
    this.url = url;
  }

  // Method to get the table's lookup tables
  // return type : Row
  getLookupTables() {
    return this.lookup_tables;
  }

  // Method to set the table's lookup tables
  // return type : void
  setLookupTables(lookup_tables: string) {
    this.lookup_tables = lookup_tables;
  }

  // Method to get the table's stand alone details view
  // return type : boolean
  getStandAloneDetailsView() {
    return this.stand_alone_details_view;
  }

  // Method to set the table's stand alone details view
  // return type : void
  setStandAloneDetailsView(stand_alone_details_view: boolean) {
    this.stand_alone_details_view = stand_alone_details_view;
  }

  // Method to get the table's lookup counter
  // return type : number
  getLookupCounter() {
    return this.lookup_counter;
  }

  // Method to set the table's lookup counter
  // return type : void
  setLookupCounter(lookup_counter: string) {
    this.lookup_counter = lookup_counter;
  }

}

export class Column {
  column_name: string;
  column_type: string;
  is_visible: boolean;
  reqOnCreate: boolean;
  references_table: string;
  is_editable: boolean;

  constructor(column_name: string) {
    this.column_name = column_name;
    this.column_type = "";
    this.is_visible = true;
    this.reqOnCreate = false;
    this.references_table = "";
    this.is_editable = false;
  }

  // Method to set the column type
  // return type : void
  setType(column_type: string) {
    this.column_type = column_type;
  }

  // Method to set the column visibility
  // return type : void
  setVisibility(is_visible: boolean) {
    this.is_visible = is_visible;
  }

  // Method to set the column's reference table
  // return type : void
  setReferenceTable(references_table: string) {
    this.references_table = references_table;
  }

  // Method to get the column's reference table
  // return type : string
  getReferenceTable() {
    return this.references_table;
  }

  // Method to set the column's editability
  // return type : void
  setEditability(is_editable: boolean) {
    this.is_editable = is_editable;
  }

  // Method to get the column's editability
  // return type : boolean
  getEditability() {
    return this.is_editable;
  }
}

export class View {
  view_name: string;
  url: string;

  constructor(view_name: string) {
    this.view_name = view_name;
    this.url = API_BASE_URL + view_name;
  }
}

export enum TableDisplayType {
  listView = "list",
  enumView = "enum",
}

// Defining ColumnData interface for type checking when calling /columns with the API
interface ColumnData {
  schema: string;
  table: string;
  column: string;
  references_table: string;
  is_editable: boolean;
}
// Defining ViewData interface for type checking when calling /views with the API
interface ViewData {
  schema: string;
  view: string;
}

// Defining ConfigData interface for type checking when calling /appconfig_values with the API
interface ConfigData {
  id: number;
  table: string;
  column: string | null;
  property: string;
  value: string | boolean;
}
// Defining UserData interface for type checking when calling /user_info with the API
export interface UserData {
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  is_active: boolean;
}

// Creating a VMD object and exporting it
const vmd = new VirtualModelDefinition();
await vmd.fetchSchemas();
await vmd.fetchConfig();
export default vmd;
