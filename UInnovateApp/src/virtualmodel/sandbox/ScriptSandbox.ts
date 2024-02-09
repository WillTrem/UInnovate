"use strict";

// import ivm = require("isolated-vm");
import ivm from "isolated-vm";
import { Row } from "../DataAccessor";

/* This class will be used to create a sandbox for the user's script */
class ScriptSandbox {
  private isolate: ivm.Isolate;
  private context: ivm.Context;
  private jail;

  constructor() {
    this.isolate = new ivm.Isolate({ memoryLimit: 8 /* MB */ });
    this.context = this.isolate.createContextSync();
    this.jail = this.context.global;
  }

  // This method will be used to execute the user's script
  executeScript(user_script: string, table_data: Row[]) {
    // Defining the global variables inside the sandbox
    this.jail.setSync("global", this.jail.derefInto());
    this.jail.setSync("log", function (...args: string[]): void {
      console.log(...args);
    });
    this.jail.setSync("user_script", user_script);

    // Serialize the table data to pass it to the sandbox
    const serializedTableData = JSON.stringify(table_data);

    // Parse the serialized table data in the sandbox
    this.context.evalSync(
      `global.table_data = JSON.parse(${JSON.stringify(serializedTableData)})`
    );

    // Define the addRow, removeRow, and updateRow functions inside the sandbox
    const addRow = function (row: Partial<Row>) {
      // Check if the row with the same id already exists
      const exists = table_data.some((r) => r.id === row.id);
      if (exists) {
        throw new Error("Row with the same id or name already exists");
      }

      // Create a new row with default values
      const newRow: Row = {
        id: row.id,
        name: row.name,
        description: row.description,
        content: row.content,
        table_name: row.table_name ?? "scripts",
        btn_name: row.btn_name ?? "Do a magic trick!",
        created_at: null,
      };

      // Add the new row to the table_data array
      table_data.push(newRow);
    };

    const removeRow = function (id: number) {
      // Find the index of the row with the given id
      const index = table_data.findIndex((row) => row.id === id);
      if (index === -1) {
        throw new Error("Row not found");
      }

      // Remove the row from the table_data array
      table_data.splice(index, 1);
    };

    const updateRow = function (id: number, updatedRow: Partial<Row>) {
      // Find the row with the given id
      const row = table_data.find((row) => row.id === id);
      if (!row) {
        throw new Error("Row not found");
      }

      // Update the row
      row.name = updatedRow.name ?? row.name;
      row.description = updatedRow.description ?? row.description;
      row.content = updatedRow.content ?? row.content;
      row.table_name = updatedRow.table_name ?? row.table_name;
      row.btn_name = updatedRow.btn_name ?? row.btn_name;
    };

    this.jail.setSync("addRow", addRow);
    this.jail.setSync("removeRow", removeRow);
    this.jail.setSync("updateRow", updateRow);

    this.context.evalSync("log(table_data)");

    // const script = this.isolate.compileScriptSync(user_script);
    // script.run(this.context);
    const trial = this.isolate.compileScriptSync(
      `console.log("Trial succeeded.");`
    );
    trial.run(this.context).catch((err) => console.error(err));

    // Serialize the table data back into a string inside the sandbox
    const serializedResult = this.context.evalSync(
      "JSON.stringify(table_data)"
    );

    // Parse the serialized result outside the sandbox
    const result = JSON.parse(serializedResult);

    return result;
  }

  // This method will be used to dispose of the sandbox
  dispose() {
    this.isolate.dispose();
  }
}

export default ScriptSandbox;
