import "../styles/TableComponent.css";
import TableComponent from "react-bootstrap/Table";
import vmd, { Table, Column } from "../virtualmodel/VMD";
import { DataAccessor, Row } from "../virtualmodel/DataAccessor";
import React, { useState, useEffect, useRef } from "react";
import SlidingPanel from "react-sliding-side-panel";
import "react-sliding-side-panel/lib/index.css";
import { ConfigProperty } from "../virtualmodel/ConfigProperties";
import StarterKit from "@tiptap/starter-kit";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { Switch, Button, Typography, MenuItem, Select } from "@mui/material";
import AddRowPopup from "./AddRowPopup";
import LookUpTableDetails from "./SlidingComponents/LookUpTableDetails";
import "../styles/TableListViewStyle.css";
import {
  LocalizationProvider,
  StaticDateTimePicker,
} from "@mui/x-date-pickers";
import { CategoriesDisplayType } from "../virtualmodel/Config";
import { MuiTelInput } from "mui-tel-input";
import {
  MenuButtonBold,
  MenuButtonItalic,
  MenuControlsContainer,
  MenuDivider,
  MenuSelectHeading,
  RichTextEditor,
  type RichTextEditorRef,
} from "mui-tiptap";

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
  const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false);
  const [inputValues, setInputValues] = useState<Row>({});
  const [currentPrimaryKey, setCurrentPrimaryKey] = useState<string | null>(
    null
  );
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
      const filteredRowData: { [key: string]: string | number | boolean } = {};
      attributes.forEach((column) => {
        filteredRowData[column.column_name] = row[column.column_name];
      });
      return new Row(filteredRowData);
    });

    setColumns(attributes);
    setRows(filteredRows);
  };

  useEffect(() => {
    getRows();
  }, [table]);

  const [openPanel, setOpenPanel] = useState(false);
  const [currentRow, setCurrentRow] = useState<Row>(new Row({}));
  const [currentPhone, setCurrentPhone] = useState<string>("");
  const [inputField, setInputField] = useState<(column: Column) => JSX.Element>(
    () => <></>
  );
  const schema = vmd.getSchema("meta");
  const script_table = vmd.getTable("meta", "scripts");
  const config_table = vmd.getTable("meta", "appconfig_values");
  const [scripts, setScripts] = useState<Row[] | undefined>([]);
  const [appConfigValues, setAppConfigValues] = useState<Row[] | undefined>([]);
  const rteRef = useRef<RichTextEditorRef>(null);

  const getScripts = async () => {
    if (!schema || !script_table) {
      throw new Error("Schema or table not found");
    }

    const scripts_data_accessor: DataAccessor = vmd.getRowsDataAccessor(
      schema?.schema_name,
      script_table?.table_name
    );

    const scripts_rows = await scripts_data_accessor?.fetchRows();
    const filteredScripts = scripts_rows?.filter(
      (script) => script.table_name === table.table_name
    );

    setScripts(filteredScripts);
  };

  const getConfigs = async () => {
    if (!schema || !config_table) {
      throw new Error("Schema or table not found");
    }

    const config_data_accessor: DataAccessor = vmd.getRowsDataAccessor(
      schema?.schema_name,
      config_table?.table_name
    );

    const config_rows = await config_data_accessor?.fetchRows();

    setAppConfigValues(config_rows);
  };

  useEffect(() => {
    getScripts();
    getConfigs();
  }, [inputValues]);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    name: string,
    isPhone: string
  ) => {
    const nonEditableColumn = table.columns.find(
      (column) => column.is_editable === false
    );
    if (nonEditableColumn) {
      setCurrentPrimaryKey(nonEditableColumn.column_name);
    }
    let eventName: string | undefined = undefined;
    let eventValue: string | undefined = undefined;
    if (event.target !== undefined) {
      eventName = event.target.name;
      eventValue = event.target.value;
    } else {
      if (isPhone !== undefined) {
        eventName = name;
        eventValue = event;
      } else {
        eventName = name;
        eventValue = event.format();
      }
    }

    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      [eventName]: eventValue,
    }));
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const schema = vmd.getTableSchema(table.table_name);
    if (!schema) {
      console.error("Schema not found");
      return;
    }

    const storedPrimaryKeyValue = localStorage.getItem(
      "currentPrimaryKeyValue"
    );

    const data_accessor: DataAccessor = vmd.getUpdateRowDataAccessorView(
      schema.schema_name,
      table.table_name,
      inputValues,
      currentPrimaryKey as string,
      storedPrimaryKeyValue as string
    );
    data_accessor.updateRow().then((res) => {
      getRows();
    });
    setOpenPanel(false);
  };

  // const ReadPrimaryKeyandValue = (Primekey:string, PrimekeyValue:string) => {

  // }
  useEffect(() => {
    const newInputField = (column: Column) => {
      if (!appConfigValues) {
        return null;
      }
      const columnDisplayType = appConfigValues?.find(
        (element) =>
          element.column == column.column_name &&
          element.table == table.table_name &&
          element.property == ConfigProperty.COLUMN_DISPLAY_TYPE
      );

      if (column.is_editable == false) {
        localStorage.setItem(
          "currentPrimaryKeyValue",
          currentRow.row[column.column_name]
        );
      }
      if (!columnDisplayType || columnDisplayType.value == "text") {
        return (
          <input
            readOnly={column.is_editable === false ? true : false}
            placeholder={String(currentRow?.row[column.column_name]) || ""}
            name={column.column_name}
            type="text"
            style={inputStyle}
            onChange={handleInputChange}
          />
        );
      } else if (columnDisplayType.value == "number") {
        return (
          <input
            type="number"
            name={column.column_name}
            readOnly={column.is_editable === false ? true : false}
            placeholder={String(currentRow.row[column.column_name]) || ""}
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
      } else if (columnDisplayType.value == "boolean") {
        return (
          <Switch
            checked={
              currentRow?.row[column.column_name] == "true"
                ? true
                : false || false
            }
            name={column.column_name}
          />
        );
      } else if (columnDisplayType.value == "date") {
        return (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <StaticDatePicker
              value={dayjs(currentRow.row[column.column_name])}
              onChange={(date) => handleInputChange(date, column.column_name)}
              name={column.column_name}
              className="date-time-picker"
              readOnly={column.is_editable === false ? true : false}
            />
          </LocalizationProvider>
        );
      } else if (columnDisplayType.value == "datetime") {
        return (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <StaticDateTimePicker
              value={dayjs(currentRow.row[column.column_name])}
              onChange={(date) => handleInputChange(date, column.column_name)}
              name={column.column_name}
              className="date-time-picker"
              readOnly={column.is_editable === false ? true : false}
            />
          </LocalizationProvider>
        );
      } else if (columnDisplayType.value == "categories") {
        return (
          <Select
            value={"category1"}
            onChange={handleInputChange}
            className="popUp"
          >
            {Object.keys(CategoriesDisplayType).map((value) => (
              <MenuItem key={value} value={value}>
                {value}
              </MenuItem>
            ))}
          </Select>
        );
      } else if (columnDisplayType.value == "phone") {
        return (
          <MuiTelInput
            value={
              currentPhone ? currentPhone : currentRow.row[column.column_name]
            }
            onChange={(phone) => {
              handleInputChange(phone, column.column_name, "phone");
              setCurrentPhone(phone);
            }}
            name={column.column_name}
          />
        );
      } else if (columnDisplayType.value == "currency") {
        return (
          <div>
            <input
              type="number"
              name={column.column_name}
              className="input"
              value={currentRow.row[column.column_name]}
              onChange={handleInputChange}
            />
            <select value={"Hello"} onChange={onChangeCurrency}>
              {currencyOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        );
      } else if (columnDisplayType.value == "multiline_wysiwyg") {
        return (
          <RichTextEditor
            name={column.column_name}
            content={currentRow.row[column.column_name]}
            onChange={handleInputChange}
            ref={rteRef}
            extensions={[StarterKit]} // Or any Tiptap extensions you wish!
            // Optionally include `renderControls` for a menu-bar atop the editor:
            renderControls={() => (
              <MenuControlsContainer>
                <MenuSelectHeading />
                <MenuDivider />
                <MenuButtonBold />
                <MenuButtonItalic />
                {/* Add more controls of your choosing here */}
              </MenuControlsContainer>
            )}
          />
        );
      }
    };
    setInputField(() => newInputField as (column: Column) => JSX.Element);
  }, [currentRow, columns, table, appConfigValues, currentPhone]);

  // Function to save the current row
  const handleOpenPanel = (row: Row) => {
    setCurrentRow(row);
    setCurrentPhone("");
    if (!table.has_details_view) {
      return;
    }
    setOpenPanel(true);
  };

  // Function to open the popup
  const handleAddRowClick = () => {
    setIsPopupVisible(true);
  };

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
      <SlidingPanel
        type={"right"}
        isOpen={openPanel}
        size={30}
        panelContainerClassName="panel-container"
        backdropClicked={() => {
          setOpenPanel(false);
        }}
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
              onClick={() => {
                setCurrentPhone("");
                setOpenPanel(false);
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

        <LookUpTableDetails table={table} />
      </SlidingPanel>
    </div>
  );
};

export default TableListView;
