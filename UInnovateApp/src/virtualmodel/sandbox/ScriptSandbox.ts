"use strict";

import ivm = require("isolated-vm");
import ScriptHandler from "../ScriptHandler";
import { Table } from "../VMD";

class ScriptSandbox {
  private isolate: ivm.Isolate;
  private context: ivm.Context;
  private global;

  constructor() {
    this.isolate = new ivm.Isolate({ memoryLimit: 8 /* MB */ });
    this.context = this.isolate.createContextSync();
    this.global = this.context.global;
  }

  executeScript(user_script: string, table: Table, handler: ScriptHandler) {
    const script = this.isolate.compileScriptSync(user_script);
    this.global.setSync("table", table);
    this.global.setSync("handler", handler);
    script.runSync(this.context);
  }
}

export default ScriptSandbox;
