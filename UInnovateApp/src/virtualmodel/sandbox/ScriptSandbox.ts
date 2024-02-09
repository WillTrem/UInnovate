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
  executeScript(user_script: string, table_data: Row[], primary_key: string) {
    // Defining the global variable inside the sandbox
    this.jail.setSync("global", this.jail.derefInto());

    // Defining the table_data and primary_key variables inside the sandbox
    this.jail.setSync("user_script", user_script);
    this.jail.setSync("primary_key", primary_key);

    // Defining the log method inside the sandbox
    this.jail.setSync("log", function (...args: string[]): void {
      console.log(...args);
    });

    // Serializing the table data to pass it to the sandbox
    const serializedTableData = JSON.stringify(table_data);

    // Parsing the serialized table data in the sandbox
    this.context.evalSync(
      `table_data = JSON.parse(${JSON.stringify(serializedTableData)})`
    );

    // Adding the console.log method to the sandbox
    this.context.evalSync(`
      global.console = { 
        log: function() { 
          const args = Array.prototype.slice.call(arguments);
          global.log.apply(null, args);
          } 
        }   
    `);

    // Define the addRow function inside the sandbox
    this.context.evalSync(`
      const addRow = function (row) {
        // Check if the row with the same id already exists
        const exists = table_data.some(
          (r) => r[primary_key] === row[primary_key]
        );
        if (exists) {
          throw new Error("Row with the same key already exists");
        }

        // We can't check for constraints here. We can only check for the primary key
        // The checking will be done when the changes will be tried to be committed to the database
        console.log("Row added:", row);
        table_data.push(row);
      };
    `);

    // Define the removeRow function inside the sandbox
    this.context.evalSync(`
      const removeRow = function (key_value) {
        // Find the index of the row with the given primary key
        const index = table_data.findIndex((row) => row[primary_key] === key_value);
        if (index === -1) {
          throw new Error("Row not found");
        }

        // Remove the row from the table_data array
        table_data.splice(index, 1);
      };
    `);

    // Define the updateRow function inside the sandbox
    this.context.evalSync(`
      const updateRow = function (key_value, updatedRow) {
        // Find the row with the given primary key
        const row = table_data.find((r) => r[primary_key] === key_value);
        if (!row) {
          throw new Error("Row not found");
        }

        // Update the row
        for (let key in updatedRow) {
          if (updatedRow.hasOwnProperty(key)) {
            row[key] = updatedRow[key];
          }
        }
      };
    `);

    const script = this.isolate.compileScriptSync(user_script);
    script.runSync(this.context);

    // Serialize the table data back into a string inside the sandbox and parse it outside the sandbox
    const serializedResult = this.context.evalSync(
      "JSON.stringify(table_data)"
    );
    const result = JSON.parse(serializedResult);

    return result;
  }

  // This method will be used to dispose of the sandbox
  dispose() {
    this.isolate.dispose();
  }
}

export default ScriptSandbox;
