import { Row } from "../../virtualmodel/DataAccessor";
import { Card } from "react-bootstrap";
import { useState } from "react";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
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

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";

ace.config.set("basePath", "../../../node_modules/ace-builds/src-noconflict");
interface ScriptEditorProps {
  script: Row;
}

export const ScriptEditor: React.FC<ScriptEditorProps> = ({ script }) => {
  const script_name = script["name"];
  const tables = vmd.getAllTables();

  const [updateScript, setUpdateScript] = useState<Row>(script);
  const [content, setContent] = useState<string>(script["content"] || "");
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const handleChange = (event: SelectChangeEvent, changed_property: string) => {
    let updatedScript = updateScript;

    switch (changed_property) {
      case "table_name":
        updatedScript = { ...updateScript, table_name: event.target.value };
        break;
      case "content":
        updatedScript = { ...updateScript, content: event.target.value };
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
      "scripts",
      updatedScript
    );

    data_accessor?.updateRow();
  };

  return (
    <div>
      <Card>
        <Card.Body>
          <Card.Title>Script: {script_name}</Card.Title>
          <div className="config-pane mt-3">
            <div className="d-flex flex-column align-items-start">
              <h6>Button Name</h6>
              <TextField
                defaultValue={script["btn_name"]}
                onChange={(event) =>
                  handleChange(event as SelectChangeEvent, "btn_name")
                }
              ></TextField>
            </div>
            <FormControl size="small">
              <h6>Script Table</h6>
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
                The table that this script will be applied to.
              </FormHelperText>
            </FormControl>
          </div>
          <div className="d-flex flex-column align-items-start mb-5">
            <h6>Description</h6>
            <TextField
              multiline
              fullWidth
              defaultValue={script["description"]}
              onChange={(event) =>
                handleChange(event as SelectChangeEvent, "description")
              }
            ></TextField>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <h6>Content</h6>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <IconButton onClick={() => setIsEditing(!isEditing)}>
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => {
                    handleChange(
                      { target: { value: content } } as SelectChangeEvent,
                      "content"
                    );
                    setIsEditing(false);
                  }}
                >
                  <SaveIcon />
                </IconButton>
              </div>
              <AceEditor
                mode="javascript"
                theme="github"
                value={content}
                onChange={(value) => {
                  setContent(value);
                }}
                name="script-editor"
                readOnly={!isEditing}
                editorProps={{ $blockScrolling: true }}
                setOptions={{
                  enableBasicAutocompletion: true,
                  enableLiveAutocompletion: true,
                  enableSnippets: true,
                }}
                style={{ opacity: isEditing ? 1 : 0.5 }}
              />
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};
