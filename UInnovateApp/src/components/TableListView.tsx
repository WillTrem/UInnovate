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
import { useConfig } from "../contexts/ConfigContext";
import { ConfigProperty } from "../virtualmodel/ConfigProperties";
import { Switch } from "@mui/material";
import { NumericFormat } from "react-number-format";
import { DateField } from "@mui/x-date-pickers/DateField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";

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
  const { config } = useConfig();

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

  const inputField = (column: string) => {
    const columnDisplayType = config.find(
      (element) =>
        element.column == column &&
        element.table == nameOfTable &&
        element.property == ConfigProperty.COLUMN_DISPLAY_TYPE
    );
    if (!columnDisplayType || columnDisplayType.value == "text") {
      return (
        <input
          value={currentRow[columns.indexOf(column)]}
          type="text"
          readOnly
        />
      );
    } else if (columnDisplayType.value == "number") {
      return (
        <NumericFormat
          value={currentRow[columns.indexOf(column)]}
          allowLeadingZeros
          thousandSeparator=","
          readOnly
        />
      );
    } else if (columnDisplayType.value == "longtext") {
      return (
        <textarea
          placeholder="Type anything…"
          value={currentRow[columns.indexOf(column)]}
          readOnly
        />
      );
    } else if (columnDisplayType.value == "datetime") {
      return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateField
            value={dayjs(currentRow[columns.indexOf(column)])}
            readOnly
          />
        </LocalizationProvider>
      );
    } else if (columnDisplayType.value == "boolean") {
      return (
        <Switch
          checked={currentRow[columns.indexOf(column)] == "true" ? true : false}
          readOnly
        />
      );
    }
  };

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
                      <tr key={rowIdx} onClick={() => handleOpenPanel(row)}>
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
                            <div className="row-details">
                              <label key={column + colIdx}>{column}</label>
                              {inputField(column)}
                            </div>
                          );
                        })}
                      </label>
                    </div>
                  </form>
                  <button
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
