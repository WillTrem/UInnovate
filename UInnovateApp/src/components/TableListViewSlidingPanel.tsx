import { Typography } from "@mui/material";
import React, { useEffect } from "react";
import { Button } from "react-bootstrap";
import InputField from "./InputField";
import { NavBar } from "./NavBar";
import LookUpTableDetails from "./TableListViewComponents/LookUpTableDetails";
import { DataAccessor, Row } from "../virtualmodel/DataAccessor";
import vmd, { Column, Table } from "../virtualmodel/VMD";
import Dropzone from "./Dropzone";
import { getConfigs } from "../helper/TableListViewHelpers";
import Logger from "../virtualmodel/Logger";
import { useSelector } from "react-redux";
import { AuthState } from "../redux/AuthSlice";
import { RootState } from "../redux/Store";
import { default as ReactSlidingPanel } from "react-sliding-side-panel";
import "../styles/TableListView.css";

interface SlidingPanelProps {
  table: Table;
  currentRow: Row;
  onItemAdded: (e, item, itemExtension, itemName, currentColumn) => void;
  onItemRemoved: (e, item, currentColumn) => void;
  fileGroupFiles: object;
  openPanel: boolean;
  setOpenPanel: React.Dispatch<React.SetStateAction<boolean>>;
}

const SlidingPanel: React.FC<SlidingPanelProps> = ({
  table,
  currentRow,
  onItemAdded,
  onItemRemoved,
  fileGroupFiles,
  openPanel,
  setOpenPanel,
}: {
  table: Table;
  currentRow: Row;
  onItemAdded: (e, item, itemExtension, itemName, currentColumn) => void;
  onItemRemoved: (e, item, currentColumn) => void;
  fileGroupFiles: object;
  openPanel: boolean;
  setOpenPanel: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const tableStyle = table?.stand_alone_details_view
    ? "form-group-stand-alone"
    : "form-group";

  const buttonStyle = {
    marginTop: 20,
    backgroundColor: "#404040",
    width: "fit-content",
    color: "white",
  };

  const [appConfigValues, setAppConfigValues] = React.useState<
    Row[] | undefined
  >();
  const [inputValues, setInputValues] = React.useState<Row>({});
  const [showTable, setShowTable] = React.useState(false);
  const columns = table?.columns;

  useEffect(() => {
    getConfigs().then((configs) => {
      setAppConfigValues(configs);
    });
  }, []);

  const FileInputField = (column: Column) => {
    if (!appConfigValues) {
      return null;
    }

    return (
      <div>
        <Dropzone
          onItemAdded={onItemAdded}
          onItemRemoved={onItemRemoved}
          items={fileGroupFiles[currentRow.row[column.column_name]]}
          currentColumn={column.column_name}
        />
      </div>
    );
  };

  const { user: loggedInUser }: AuthState = useSelector(
    (state: RootState) => state.auth
  );

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const schema = vmd.getTableSchema(table?.table_name);
    if (!schema) {
      console.error("Schema not found");
      return;
    }

    Logger.logUserAction(
      loggedInUser || "",
      "Edited Row",
      //i want the edited value in the details
      "User has modified a row in the table: " + JSON.stringify(inputValues),
      schema?.schema_name || "",
      table?.table_name
    );

    const currentPrimaryKey = table?.getPrimaryKey()?.column_name;

    const storedPrimaryKeyValue = currentRow.row
      ? currentRow.row[currentPrimaryKey as string]
      : null;

    const data_accessor: DataAccessor = vmd.getUpdateRowDataAccessorView(
      schema.schema_name,
      table?.table_name,
      inputValues,
      currentPrimaryKey as string,
      storedPrimaryKeyValue as unknown as string
    );
    data_accessor.updateRow();
    setInputValues({});
    setOpenPanel(false);
  };

  return (
    <div>
      <ReactSlidingPanel
        type={"right"}
        isOpen={openPanel}
        size={table?.stand_alone_details_view ? 100 : 50}
        panelContainerClassName="panel-container"
        backdropClicked={() => {
          setOpenPanel(false);
        }}
      >
        <div>
          <div>
            {table?.stand_alone_details_view ? <NavBar /> : <div></div>}
            <div className="form-panel-container">
              <Typography variant="h5">Details</Typography>
              <form>
                <div className={tableStyle}>
                  {columns?.map((column, colIdx) => {
                    if (column.references_table != "filegroup") {
                      return (
                        <div key={colIdx} className="row-details">
                          <label key={column.column_name + colIdx}>
                            {column.column_name}
                          </label>
                          <InputField
                            column={column}
                            table={table}
                            appConfigValues={appConfigValues}
                            currentRow={currentRow}
                            setInputValues={setInputValues}
                          ></InputField>
                        </div>
                      );
                    }
                  })}
                  {columns?.map((column, colIdx) => {
                    if (column.references_table == "filegroup") {
                      return (
                        <div
                          key={colIdx}
                          className="row-details"
                          title="Dropzone"
                        >
                          <label key={column.column_name + colIdx}>
                            {column.column_name}
                          </label>
                          <FileInputField {...column} />
                        </div>
                      );
                    }
                  })}
                </div>
              </form>
              <div>
                <Button
                  variant="contained"
                  style={buttonStyle}
                  onClick={() => {
                    setInputValues({});
                    setOpenPanel(false);
                  }}
                >
                  Close
                </Button>
                <Button
                  variant="contained"
                  style={{
                    marginTop: 20,
                    backgroundColor: "#403eb5",
                    width: "fit-content",
                    marginLeft: 10,
                    color: "white",
                  }}
                  onClick={handleFormSubmit}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
          <div style={{ paddingBottom: "2em", paddingLeft: "1.5em" }}>
            {table?.lookup_tables == "null" ? (
              <div></div>
            ) : JSON.parse(table?.lookup_tables)[-1] == "none" ? (
              <div></div>
            ) : showTable ? (
              <div style={{ paddingBottom: "2em" }}>
                {currentRow.row && (
                  <LookUpTableDetails
                    table={table}
                    currentRow={currentRow.row}
                  />
                )}{" "}
              </div>
            ) : (
              <Button
                variant="contained"
                style={{
                  marginTop: 20,
                  backgroundColor: "#403eb5",
                  width: "fit-content",
                  marginLeft: "12px",
                }}
                onClick={() => setShowTable(true)}
              >
                Show Look Up Table
              </Button>
            )}
          </div>
        </div>
      </ReactSlidingPanel>
    </div>
  );
};

export default SlidingPanel;
