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
    const script = this.isolate.compileScriptSync(user_script);

    this.jail.setSync("global", this.jail.derefInto());
    this.jail.setSync("log", function (...args: string[]): void {
      console.log(...args);
    });

    // Serialize the table data to pass it to the sandbox
    const serializedTableData = JSON.stringify(table_data);

    // Parse the serialized table data in the sandbox
    this.context.evalSync(
      `global.table_data = JSON.parse(${JSON.stringify(serializedTableData)})`
    );

    this.context.evalSync('log("hello world")');
    this.context.evalSync("log(table_data)");
    script.runSync(this.context);

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
