import { Typography } from "@mui/material";
import React from "react";
import { Button } from "react-bootstrap";
import InputField from "./InputField";
import { NavBar } from "./NavBar";
import LookUpTableDetails from "./TableListViewComponents/LookUpTableDetails";
import { Row } from "../virtualmodel/DataAccessor";
import vmd, { Column, Table } from "../virtualmodel/VMD";
import Dropzone from "./Dropzone";
import axios from "axios";

interface SlidingPanelProps {
  // Define the props for the SlidingPanel component here
  setOpenPanel: React.Dispatch<React.SetStateAction<boolean>>;
  setInputValues: React.Dispatch<React.SetStateAction<Row>>;
  setShowFiles: React.Dispatch<React.SetStateAction<boolean>>;
  handleFormSubmit: () => void;
  columns: Column[];
  table: Table;
  currentRow: Row;
  appConfigValues: Row[];
}

const SlidingPanel: React.FC<SlidingPanelProps> = ({
  setOpenPanel,
  setInputValues,
  setShowFiles,
  handleFormSubmit,
  columns,
  table,
  currentRow,
  appConfigValues,
}) => {
  // Implement the logic for the SlidingPanel component here

  const onItemAdded = async (
    e,
    item,
    itemExtension,
    itemName,
    currentColumn
  ) => {
    e.preventDefault();
    await axios
      .post(
        "http://localhost:3000/rpc/add_file_to_group",
        {
          in_filegroupid: currentRow.row[currentColumn]
            ? currentRow.row[currentColumn]
            : null,
          in_blob: item,
          in_filename: itemName,
          in_extension: itemExtension,
        },
        {
          headers: {
            "Content-Profile": "filemanager",
            "Content-Type": "application/json",
          },
        }
      )
      ?.then((response) => {
        let tempRow = {
          ...currentRow.row,
          [currentColumn]: response.data[0].groupid,
        };
        setCurrentRow({ row: tempRow });
        vmd
          .getUpdateRowDataAccessor(
            vmd.getTableSchema(table.table_name)?.schema_name,
            table.table_name,
            { ...currentRow.row, [currentColumn]: response.data[0].groupid }
          )
          .updateRow();
        setAllFileGroups((prevItems) => [...prevItems, response.data[0]]);
      });
    getRows();
  };

  const FileInputField = (column: Column) => {
    if (!appConfigValues) {
      return null;
    }

    if (column.is_editable == false) {
      localStorage.setItem(
        "currentPrimaryKeyValue",
        currentRow.row[column.column_name]
      );
    }

    if (column.references_table != null) {
      const string = column.column_name + "L";
      localStorage.setItem(
        string,
        currentRow.row[column.column_name] as string
      );
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

  return (
    <div>
      <SlidingPanel
        type={"right"}
        isOpen={openPanel}
        size={table.stand_alone_details_view ? 100 : 50}
        panelContainerClassName="panel-container"
        backdropClicked={() => {
          setOpenPanel(false);
        }}
      >
        <div>
          <div>
            {table.stand_alone_details_view ? <NavBar /> : <div></div>}
            <div className="form-panel-container">
              <Typography variant="h5">Details</Typography>
              <form>
                <div className={tableStyle}>
                  {columns.map((column, colIdx) => {
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
                            setCurrentPrimaryKey={setCurrentPrimaryKey}
                            setInputValues={setInputValues}
                          ></InputField>
                        </div>
                      );
                    }
                  })}
                  {columns.map((column, colIdx) => {
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
                    setShowFiles(false);
                  }}
                >
                  close
                </Button>
                <Button
                  variant="contained"
                  style={{
                    marginTop: 20,
                    backgroundColor: "#403eb5",
                    width: "fit-content",
                    marginLeft: 10,
                  }}
                  onClick={handleFormSubmit}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
          <div style={{ paddingBottom: "2em", paddingLeft: "1.5em" }}>
            {table.lookup_tables == "null" ? (
              <div></div>
            ) : JSON.parse(table.lookup_tables)[-1] == "none" ? (
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
      </SlidingPanel>
    </div>
  );
};

export default SlidingPanel;
