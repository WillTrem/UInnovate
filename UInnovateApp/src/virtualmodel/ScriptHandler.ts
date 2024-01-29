import { createContext, runInContext } from "node:vm";

class ScriptHandler {
  private context: { [key: string]: unknown };

  constructor(context: { [key: string]: unknown }) {
    this.context = context;
    createContext(this.context);
  }

  public runScript(script: string): void {
    runInContext(script, this.context);
    console.log(this.context);
  }

  public getContext(): { [key: string]: unknown } {
    return this.context;
  }
}

export default ScriptHandler;
