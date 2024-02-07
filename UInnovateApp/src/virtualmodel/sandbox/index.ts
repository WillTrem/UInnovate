import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";

import ScriptSandbox from "./ScriptSandbox";

const app: Express = express();

app.use(cors());
app.use(bodyParser.json());

app.post("/execute", (req: Request, res: Response) => {
  const { script, table, handler } = req.body;
  const sandbox = new ScriptSandbox();

  sandbox.executeScript(script, table, handler);
  res.send("Script executed successfully");
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
