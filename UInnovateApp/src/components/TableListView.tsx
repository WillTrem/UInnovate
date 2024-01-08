import "../styles/TableComponent.css";
import TableComponent from "react-bootstrap/Table";
import vmd, { Table, Column } from "../virtualmodel/VMD";
import { DataAccessor, Row } from "../virtualmodel/DataAccessor";
import React, { useState, useEffect } from "react";
import SlidingPanel from "react-sliding-side-panel";
import "react-sliding-side-panel/lib/index.css";
import { useConfig } from "../contexts/ConfigContext";
import { ConfigProperty } from "../virtualmodel/ConfigProperties";
import { NumericFormat } from "react-number-format";
import { DateField } from "@mui/x-date-pickers/DateField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import RRow from 'react-bootstrap/Row';
import CCol from 'react-bootstrap/Col';
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { Switch, Button, Typography, Select, MenuItem, FormControl, FormHelperText, SelectChangeEvent } from "@mui/material";
import AddRowPopup from "./AddRowPopup";
import Pagination from '@mui/material/Pagination';

import LookUpTableDetails from "./SlidingComponents/LookUpTableDetails";
import { current } from "@reduxjs/toolkit";
import { Container } from "react-bootstrap";

interface TableListViewProps {
  table: Table;
}

const buttonStyle = {
  marginTop: 20,
  backgroundColor: "#404040",
  width: "fit-content",
};

const inputStyle = {
  display: "flex",
  flexDirection: "column", // This will make the children (input elements) stack vertically
  alignItems: "flex-start",
  width: "65%",

};

const TableListView: React.FC<TableListViewProps> = ({
  table,
}: {
  table: Table;
}) => {
  const [columns, setColumns] = useState<Column[]>([]);
  const [rows, setRows] = useState<Row[] | undefined>([]);
  const { config } = useConfig();
  const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false);
  const [inputValues, setInputValues] = useState<Row>({});
  const [currentPrimaryKey, setCurrentPrimaryKey] = useState<string | null>(null);
  const defaultOrderValue = table.columns.find(column => column.is_editable === false)?.column_name;
  const [OrderValue, setOrderValue] = useState(defaultOrderValue || '');
  const [PaginationValue, setPaginationValue] = useState<number>(50);
  const [PageNumber, setPageNumber] = useState<number>(1);
  const [Plength, setLength] = useState<number>(0);
  const [showTable, setShowTable] = useState<boolean>(false);
  const name = table.table_name + "T";
  const Local = localStorage.getItem(name);
  if (Local == null) {
    const nulll = Local
  }
  const getTable = JSON.parse(Local!);


  const getRows = async () => {
    const attributes = table.getVisibleColumns();
    const schema = vmd.getTableSchema(table.table_name);

    if (!schema) {
      return;
    }

    const data_accessor: DataAccessor = vmd.getRowsDataAccessorForOrder(
      schema.schema_name,
      table.table_name,
      OrderValue,
      PaginationValue,
      PageNumber
    );

    const countAccessor: DataAccessor = vmd.getRowsDataAccessor(
      schema.schema_name,
      table.table_name
    );
    const count = await countAccessor.fetchRows();
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
    setLength(count?.length || 0);
    setColumns(attributes);
    setRows(filteredRows);
  };

  useEffect(() => {

    getRows();
  }, [table, OrderValue, PageNumber, PaginationValue]);

  const [openPanel, setOpenPanel] = useState(false);
  const [currentRow, setCurrentRow] = useState<Row>(new Row({}));
  const [inputField, setInputField] = useState<(column: Column) => JSX.Element>(
    () => <></>
  );

  const schema = vmd.getSchema("meta");
  const script_table = vmd.getTable("meta", "scripts");
  const [scripts, setScripts] = useState<Row[] | undefined>([]);

  const getScripts = async () => {
    if (!schema || !script_table) {
      throw new Error("Schema or table not found");
    }

    const data_accessor: DataAccessor = vmd.getRowsDataAccessor(
      schema?.schema_name,
      script_table?.table_name
    );

    const scripts_rows = await data_accessor?.fetchRows();
    const filteredScripts = scripts_rows?.filter(
      (script) => script.table_name === table.table_name
    );
    setScripts(filteredScripts);
  };

  useEffect(() => {
    getScripts();
  }, []);

  //For when order changes
  const handleOrderchange = (event: SelectChangeEvent) => {
    setOrderValue(event.target.value as string);

  }

  //For when pagination limitm changes
  const handlePaginationchange = (event: SelectChangeEvent) => {
    setPaginationValue(event.target.value as number);
    setPageNumber(1);


  }

  //For when page number changes
  const handlePageChange = (event, value) => {
    setPageNumber(value);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nonEditableColumn = table.columns.find(column => column.is_editable === false);
    if (nonEditableColumn) {
      setCurrentPrimaryKey(nonEditableColumn.column_name);
    }

    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      [event.target.name]: event.target.value,
    }));

  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {

    event.preventDefault();

    const schema = vmd.getTableSchema(table.table_name);
    if (!schema) {
      console.error("Schema not found");
      return;
    }

    const storedPrimaryKeyValue = localStorage.getItem('currentPrimaryKeyValue');


    const data_accessor: DataAccessor = vmd.getUpdateRowDataAccessorView(
      schema.schema_name,
      table.table_name,
      inputValues,
      currentPrimaryKey as string,
      storedPrimaryKeyValue as string
    );
    data_accessor.updateRow().then(() => getRows());
    setInputValues({});
    setOpenPanel(false);
    
  };

  // const ReadPrimaryKeyandValue = (Primekey:string, PrimekeyValue:string) => {

  // }



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





      if (
        column.is_editable == false) {

        localStorage.setItem("currentPrimaryKeyValue", currentRow.row[column.column_name]);

      }
      if (column.references_table != null) {
        const string = column.column_name + "L"
        localStorage.setItem(string, currentRow.row[column.column_name] as string);
      }
      if (!columnDisplayType || columnDisplayType.value == "text") {
        return (
          <input
            readOnly={column.is_editable === false ? true : false}
            placeholder={String(currentRow.row[column.column_name]) || ""}
            name={column.column_name}
            type="text"
            style={inputStyle}
            onChange={handleInputChange}
          />
        );
      } else if (columnDisplayType.value == "number") {
        return (
          <NumericFormat
            readOnly={column.is_editable === false ? true : false}
            placeholder={String(currentRow.row[column.column_name]) || ""}
            name={column.column_name}
            type="text"
            style={inputStyle}
            onChange={handleInputChange}
          />
        );
      } else if (columnDisplayType.value == "longtext") {
        return (
          <textarea
            readOnly={column.is_editable === false ? true : false}
            placeholder={String(currentRow.row[column.column_name]) || ""}
            name={column.column_name}
            type="text"
            style={inputStyle}
            onChange={handleInputChange}
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
    if (!table.has_details_view) {
      return;
    }
    setOpenPanel(true);
  };

  // Function to open the popup
  const handleAddRowClick = () => {
    setIsPopupVisible(true);
  };

  useEffect(() => {
    if (showTable) {
      setTimeout(() => {
        setShowTable(false);
      }, 1000); // Adjust the delay as needed
    }
  }, [openPanel]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        <div>
          <Button
            style={buttonStyle}
            variant="contained"
            onClick={() => handleAddRowClick()}
          >
            Add {table.table_name}
          </Button>
          {isPopupVisible && (
            <AddRowPopup
              onClose={() => setIsPopupVisible(false)}
              table={table}
              columns={table.getColumns()}
            />
          )}
        </div>
        <div>
          {scripts?.map((script) => {
            return (
              <Button
                key={script["id"]}
                style={buttonStyle}
                variant="contained"
              >
                {script["btn_name"]}
              </Button>
            );
          })}

        </div>
        <div>
          <FormControl size="small">
            <h6 style={{ textAlign: 'left' }}>Ordering</h6>
            <Select
              value={OrderValue}
              displayEmpty
              onChange={handleOrderchange}

            >
              {table.columns.map((column, index) => (
                <MenuItem value={column.column_name} key={index}>
                  {column.column_name}
                </MenuItem>
              ))}

            </Select>
          </FormControl>

        </div>
      </div>
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
      <div >
        <Container>
          <RRow  >
            <CCol sm={5} className="mx-auto" style={{ textAlign: 'right' }}>
              <Pagination
                count={Math.ceil(Plength / PaginationValue)}
                page={PageNumber}
                onChange={handlePageChange}
              />
            </CCol>
            <CCol sm={2} className="ml-auto" style={{ textAlign: 'right' }}>

              <FormControl size="small">
                <Select
                  value={PaginationValue}
                  displayEmpty
                  onChange={handlePaginationchange}


                >
                  <MenuItem value={1}>1 per page</MenuItem>
                  <MenuItem value={5}>5 per page</MenuItem>
                  <MenuItem value={25}>25 per page</MenuItem>
                  <MenuItem value={30}>30 per page</MenuItem>
                  <MenuItem value={50}>50 per page</MenuItem>
                </Select>
              </FormControl>
            </CCol>
          </RRow>

        </Container>

      </div>

      <SlidingPanel
        type={"right"}
        isOpen={openPanel}
        size={50}
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
          <div>
            <Button
              variant="contained"
              style={buttonStyle}
              onClick={() => setOpenPanel(false)}
            >
              close
            </Button>
            <Button
              variant="contained"
              style={{ marginTop: 20, backgroundColor: "#403eb5", width: "fit-content", marginLeft: 10 }}
              onClick={handleFormSubmit}
            >
              Save
            </Button>

          </div>

        </div>
        {localStorage.getItem(table.table_name + "T") === null || getTable[-1] == "none"? (
          <div></div>
        ) : showTable ? (
          <div style={{ paddingBottom: '2em' }}>
            <LookUpTableDetails table={table} />
          </div>
        ) : (
          <Button
            variant="contained"
            color="primary"
            style={{ marginLeft: 15 }}
            onClick={() => setShowTable(true)}
          >
            Show Look up Table
          </Button>
        )}


      </SlidingPanel>

    </div>
  );
};

export default TableListView;
