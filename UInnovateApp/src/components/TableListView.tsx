import "../styles/TableComponent.css";
import Table from "react-bootstrap/Table";
import attr from "../virtualmodel/Tables";
import {
  getColumnsFromTable,
  getRowsFromTable,
} from "../virtualmodel/FetchData";
import React, { useState, useEffect } from "react";
import SlidingPanel from "react-sliding-side-panel";
import "react-sliding-side-panel/lib/index.css";

interface TableListViewProps {
  nameOfTable: string;
}

const TableListView: React.FC<TableListViewProps> = ({
  nameOfTable,
}: {
  nameOfTable: string;
}) => {
  const [columns, setColumns] = useState<string[]>([]);
  const [rows, setRows] = useState<string[][]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const attributes = await getColumnsFromTable(nameOfTable);
        const lines = await getRowsFromTable(nameOfTable);

        setColumns(attributes);
        setRows(lines);
      } catch (error) {
        console.error("Could not generate the columns and rows.");
      }
    };

    fetchData();
  }, [nameOfTable]);
  const [openPanel, setOpenPanel] = useState(false);
  const [currentRow, setCurrentRow] = useState<string[]>([]);

  // Function to save the current row
  const handleOpenPanel = (row: string[]) => {
    setCurrentRow(row);
    setOpenPanel(true);
  };
  return (
    <div>
      {attr.map((table, tableIdx) => {
        if (table.table_name !== nameOfTable) {
          return null;
        } else {
          return (
            <div key={table.table_name + tableIdx}>
              <Table striped bordered hover variant="dark">
                <thead>
                  <tr>
                    {columns.map((column, colIdx) => {
                      return <th key={column + colIdx}>{column}</th>;
                    })}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, rowIdx) => {
                    return (
                      <tr id="row-click" key={rowIdx} onClick={() => handleOpenPanel(row)}>
                        {row.map((cell, cellIdx) => {
                          return <td key={cell + cellIdx}>{cell}</td>;
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
              <SlidingPanel
                type={"right"}
                isOpen={openPanel}
                size={30}
                panelContainerClassName="panel-container"
                backdropClicked={() => setOpenPanel(false)}
              >
                <div className="form-panel-container">
                  <div className="title-panel">Details</div>
                  <form>
                    <div className="form-group">
                      <label>
                        {columns.map((column, colIdx) => {
                          return (
                            <div key={column + 'div'} className="row-details">
                              <label key={column + colIdx}>{column}</label>
                              <input
                                type="text"
                                value={currentRow[columns.indexOf(column)]}
                              />
                            </div>
                          );
                        })}
                      </label>
                    </div>
                  </form>
                  <button id="button-panel"
                    className="button-side-panel"
                    onClick={() => setOpenPanel(false)}
                  >
                    close
                  </button>
                </div>
              </SlidingPanel>
            </div>
          );
        }
      })}
    </div>
  );
};

export default TableListView;
