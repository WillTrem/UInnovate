import { Typography } from '@mui/material';
import React from 'react';
import { Button } from 'react-bootstrap';
import InputField from './InputField';
import { NavBar } from './NavBar';
import LookUpTableDetails from './TableListViewComponents/LookUpTableDetails';
import { Row }  from '../virtualmodel/DataAccessor';
import { Column, Table } from '../virtualmodel/VMD';
import Dropzone from './Dropzone';

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

const SlidingPanel: React.FC<SlidingPanelProps> = ({ setOpenPanel, setInputValues, setShowFiles }) => {
    
    // Implement the logic for the SlidingPanel component here

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
          setInputValues({});
          setShowFiles(false);
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
                          <InputField column={column} table={table} appConfigValues={appConfigValues} currentRow={currentRow} setCurrentPrimaryKey={setCurrentPrimaryKey} setInputValues={setInputValues}></InputField>
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