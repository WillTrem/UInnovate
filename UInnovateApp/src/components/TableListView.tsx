import "../styles/TableComponent.css";
import TableComponent from "react-bootstrap/Table";
import vmd, { Table, Column } from "../virtualmodel/VMD";
import { DataAccessor, Row } from "../virtualmodel/DataAccessor";
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
import { Button, Typography } from "@mui/material";

interface TableListViewProps {
  table: Table;
}

const buttonStyle = {
  marginTop: 20,
  backgroundColor: "#404040",
  width: "fit-content",
};

const inputStyle = {
  padding: 8,
  borderRadius: 4,
  border: "1px solid #ccc",
};

const TableListView: React.FC<TableListViewProps> = ({
  table,
}: {
  table: Table;
}) => {
  const [columns, setColumns] = useState<Column[]>([]);
  const [rows, setRows] = useState<Row[] | undefined>([]);
  const { config } = useConfig();

  useEffect(() => {
    const getRows = async () => {
      const attributes = table.getVisibleColumns();
      const schema = vmd.getTableSchema(table.table_name);

      if (!schema) {
        return;
      }

      const data_accessor: DataAccessor = vmd.getRowsDataAccessor(
        schema.schema_name,
        table.table_name
      );

      const lines = await data_accessor.fetchRows();

      // Filter the rows to only include the visible columns
      const filteredRows = lines?.map((row) => {
        const filteredRowData: { [key: string]: string | number | boolean } =
          {};
        attributes.forEach((column) => {
          filteredRowData[column.column_name] = row[column.column_name];
        });
        return new Row(filteredRowData);
      });

      setColumns(attributes);
      setRows(filteredRows);
    };
    getRows();
  }, [table]);
  const [openPanel, setOpenPanel] = useState(false);
  const [currentRow, setCurrentRow] = useState<Row>(new Row({}));
  const [inputField, setInputField] = useState<(column: Column) => JSX.Element>(
    () => <></>
  );

  useEffect(() => {
    const newInputField = (column: Column) => {
      if (!config) {
        return null;
      }
      const columnDisplayType = config.find(
        (element) =>
          element.column == column.column_name &&
          element.table == table.table_name &&
          element.property == ConfigProperty.COLUMN_DISPLAY_TYPE
      );
      if (!columnDisplayType || columnDisplayType.value == "text") {
        return (
          <input
            value={(currentRow.row[column.column_name] as string) || ""}
            type="text"
            style={inputStyle}
            readOnly
          />
        );
      } else if (columnDisplayType.value == "number") {
        return (
          <NumericFormat
            value={(currentRow.row[column.column_name] as number) || ""}
            allowLeadingZeros
            thousandSeparator=","
            readOnly
          />
        );
      } else if (columnDisplayType.value == "longtext") {
        return (
          <textarea
            placeholder="Type anything…"
            value={(currentRow.row[column.column_name] as string) || ""}
            readOnly
          />
        );
      } else if (columnDisplayType.value == "datetime") {
        return (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateField
              value={dayjs(currentRow.row[column.column_name] as string) || ""}
              readOnly
            />
          </LocalizationProvider>
        );
      } else if (columnDisplayType.value == "boolean") {
        return (
          <Switch
            checked={
              currentRow.row[column.column_name] == "true"
                ? true
                : false || false
            }
            readOnly
          />
        );
      }
    };
    setInputField(() => newInputField as (column: Column) => JSX.Element);
  }, [currentRow, columns, config, table]);

  // Function to save the current row
  const handleOpenPanel = (row: Row) => {
    setCurrentRow(row);
    setOpenPanel(true);
  };

  return (
    <div>
      <TableComponent striped bordered hover>
        <thead>
          <tr>
            {columns.map((column) => {
              return <th key={column.column_name}>{column.column_name}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {rows?.map((row, rowIdx) => {
            return (
              <tr key={rowIdx} onClick={() => handleOpenPanel(row)}>
                {Object.values(row.row).map((cell, idx) => {
                  return (
                    <td key={idx}>
                      {typeof cell === "boolean" ? cell.toString() : cell}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </TableComponent>
      <SlidingPanel
        type={"right"}
        isOpen={openPanel}
        size={30}
        panelContainerClassName="panel-container"
        backdropClicked={() => setOpenPanel(false)}
      >
        <div className="form-panel-container">
          <Typography variant="h5">Details</Typography>
          <form>
            <div className="form-group">
              <label>
                {columns.map((column, colIdx) => {
                  return (
                    <div key={column.column_name} className="row-details">
                      <label key={column.column_name + colIdx}>
                        {column.column_name}
                      </label>
                      {inputField(column)}
                    </div>
                  );
                })}
              </label>
            </div>
          </form>
          <Button
            variant="contained"
            style={buttonStyle}
            onClick={() => setOpenPanel(false)}
          >
            close
          </Button>
        </div>
      </SlidingPanel>
    </div>
  );
};

export default TableListView;
