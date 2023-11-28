import { Row } from "../../virtualmodel/DataAccessor";
import { Card } from "react-bootstrap";
import { useState } from "react";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { MenuItem, TextField } from "@mui/material";
import vmd from "../../virtualmodel/VMD";
import AceEditor from "react-ace";
import ace from "ace-builds";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";

ace.config.set("basePath", "../../../node_modules/ace-builds/src-noconflict");
interface ScriptEditorProps {
  script: Row;
}

interface ScriptRow {
  id: string;
  name?: string;
  description?: string;
  content?: string;
  table: string;
}

export const ScriptEditor: React.FC<ScriptEditorProps> = ({ script }) => {
  const tables = vmd.getAllTables();
  const [content, setContent] = useState<string>(script["content"] || "");
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const handleTableChange = (event: SelectChangeEvent) => {
    const row: ScriptRow = {
      id: script["id"],
      table: event.target.value,
    };

    const data_accessor = vmd.getUpsertDataAccessor(
      "meta",
      "scripts",
      {
        columns: "table",
        on_conflict: "id",
      },
      row
    );
    console.log(data_accessor);

    data_accessor?.upsert();
  };

  return (
    <div>
      <Card>
        <Card.Body>
          <TextField defaultValue="Do a magic trick!" variant="outlined">
            Apply Code Button
          </TextField>
          <Select value={script["table"]} onChange={handleTableChange}>
            {tables.map((table) => {
              return (
                <MenuItem key={table.table_name} value={table.table_name}>
                  {table.table_name}
                </MenuItem>
              );
            })}
          </Select>
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
          />
          <button onClick={() => setIsEditing(!isEditing)}>Edit</button>
        </Card.Body>
      </Card>
    </div>
  );
};
