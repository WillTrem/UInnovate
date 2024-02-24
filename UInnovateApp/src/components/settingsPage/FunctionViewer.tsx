import { Row } from "../../virtualmodel/DataAccessor";
import { Card } from "react-bootstrap";
import { useEffect, useState } from "react";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import {
  FormControl,
  FormHelperText,
  MenuItem,
  TextField,
} from "@mui/material";
import vmd from "../../virtualmodel/VMD";
import "../../styles/TableItem.css";
import AceEditor from "react-ace";
import ace from "ace-builds";
import {fetchProcedureSource} from '../../virtualmodel/PlatformFunctions';

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";

ace.config.set("basePath", "../../../node_modules/ace-builds/src-noconflict");

interface FunctionViewerProps {
    func: Row;
}

export const FunctionViewer: React.FC<FunctionViewerProps> = ({ func }) => {
  const function_name = func["name"];
  const tables = vmd.getAllTables();

  const [updateScript, setUpdateScript] = useState<Row>(func);
  const [procedure, setProcedure] = useState<string>(func["procedure"] || "");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [procedureSourceCode, setProcedureSourceCode] = useState<string>("");

  useEffect(() => {
    const fetchSourceCode = async () => {
      const response = await fetchProcedureSource(func["schema"], procedure);
      setProcedureSourceCode(response.source_code);
    };
  
    fetchSourceCode();
  }, [func, procedure]);
  const handleChange = (event: SelectChangeEvent, changed_property: string) => {
    let updatedScript = updateScript;

    switch (changed_property) {
      case "table_name":
        updatedScript = { ...updateScript, table_name: event.target.value };
        break;
      case "procedure":
        updatedScript = { ...updateScript, procedure: event.target.value };
        break;
      case "btn_name":
        updatedScript = { ...updateScript, btn_name: event.target.value };
        break;
      case "description":
        updatedScript = { ...updateScript, description: event.target.value };
        break;
    }

    setUpdateScript(updatedScript);

    const data_accessor = vmd.getUpdateRowDataAccessor(
      "meta",
      "function_map",
      updatedScript
    );

    data_accessor?.updateRow();
  };

  return (
    <div>
      <Card>
        <Card.Body>
          <Card.Title>Function: {function_name}</Card.Title>
          <div className="config-pane mt-3">
            <div className="d-flex flex-column align-items-start">
              <h6>Button Name</h6>
              <TextField
                defaultValue={func["btn_name"]}
                onChange={(event) =>
                  handleChange(event as SelectChangeEvent, "btn_name")
                }
              ></TextField>
            </div>
            <FormControl size="small">
              <h6>Function View</h6>
              <Select
                value={updateScript["table_name"]}
                onChange={(event) => handleChange(event, "table_name")}
              >
                {tables.map((table) => {
                  return (
                    <MenuItem key={table.table_name} value={table.table_name}>
                      {table.table_name}
                    </MenuItem>
                  );
                })}
              </Select>
              <FormHelperText>
                The table that this function will be applied to.
              </FormHelperText>
            </FormControl>
          </div>
          <div className="d-flex flex-column align-items-start mb-5">
            <h6>Description</h6>
            <TextField
              multiline
              fullWidth
              defaultValue={func["description"]}
              onChange={(event) =>
                handleChange(event as SelectChangeEvent, "description")
              }
            ></TextField>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <h6>Content</h6>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <AceEditor
                    mode="sql"
                    theme="github"
                    value={procedureSourceCode}
                    onChange={(value) => {
                        setProcedure(value);
                    }}
                    name="function-editor"
                    readOnly={true}
                    editorProps={{ $blockScrolling: true }}
                    style={{ width: "100%" }}
                />
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};
