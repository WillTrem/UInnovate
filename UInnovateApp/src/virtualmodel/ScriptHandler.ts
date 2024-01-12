import ivm from "isolated-vm";

class ScriptHandler {
  private isolate: ivm.Isolate;
  private context?: ivm.Context;
  private jail?: ivm.Reference<Record<string | symbol | number, unknown>>;

  constructor() {
    this.isolate = new ivm.Isolate({ memoryLimit: 128 });
  }

  public async initialize(): Promise<void> {
    this.context = await this.isolate.createContext();
    this.jail = this.context.global;
    this.jail.setSync("global", this.jail.derefInto());
  }

  public async runScript(script: string): Promise<unknown> {
    if (!this.context || !this.jail) {
      throw new Error("ScriptHandler is not initialized.");
    }

    const scriptObject = await this.isolate.compileScript(script);
    const result = await scriptObject.run(this.context, { timeout: 1000 });
    return result;
  }
}

const scriptHandler = new ScriptHandler();
scriptHandler.initialize();

export default scriptHandler;
