import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";

import ScriptSandbox from "./ScriptSandbox";

const app: Express = express();

app.use(cors());
app.use(bodyParser.json());

app.post("/execute", (req: Request, res: Response) => {
  const { script, table, primary_key } = req.body;

  const sandbox = new ScriptSandbox();
  const new_table_data = sandbox.executeScript(script, table, primary_key);

  console.log("New table data:", new_table_data);

  res.send(new_table_data);
});

app.listen(3001, () => {
  console.log("Sandbox server is running on port 3001");
});
