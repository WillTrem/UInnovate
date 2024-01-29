import { createContext, runInContext } from "node:vm";

class ScriptHandler {
  private context: { [key: string]: unknown };

  constructor() {
    this.context = {};
    createContext(this.context);
  }

  public runScript(script: string): void {
    runInContext(script, this.context);
  }

  public getContext(): { [key: string]: unknown } {
    return this.context;
  }
}

// Making a singleton instance of ScriptHandler
const scriptHandler = new ScriptHandler();

export default scriptHandler;
