import "../styles/TableComponent.css";
import vmd, { Table, Column } from "../virtualmodel/VMD";
import type {} from "@mui/x-date-pickers/themeAugmentation";
import { DataAccessor, Row } from "../virtualmodel/DataAccessor";
import React, { useState, useEffect, useRef, CSSProperties } from "react";
import SlidingPanel from "react-sliding-side-panel";
import "react-sliding-side-panel/lib/index.css";
import { ConfigProperty } from "../virtualmodel/ConfigProperties";
import StarterKit from "@tiptap/starter-kit";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import RRow from "react-bootstrap/Row";
import CCol from "react-bootstrap/Col";
import dayjs from "dayjs";
import { NavBar } from "./NavBar";
import Box from "@mui/material/Box";
import { IoIosArrowUp } from "react-icons/io";
import { IoIosTrash } from "react-icons/io";

import {
  Switch,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  SelectChangeEvent,
  Tooltip,
  createTheme,
  ThemeProvider,
  Menu,
  Checkbox,
} from "@mui/material";
import AddRowPopup from "./AddRowPopup";
import Pagination from "@mui/material/Pagination";
import LookUpTableDetails from "./SlidingComponents/LookUpTableDetails";
import { Container } from "react-bootstrap";
import {
  DatePicker,
  DateTimePicker,
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
import Dropzone from "./Dropzone";
import "../styles/TableListView.css";
import axios from "axios";
import ScriptLoadPopup from "./ScriptLoadPopup";
import FunctionLoadPopup from "./FunctionLoadPopup";
import { useNavigate } from "react-router-dom";
import {
  Table as MUITable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import { Delete, Store } from "@mui/icons-material";

interface TableListViewProps {
  table: Table;
}

const buttonStyle = {
  marginTop: 20,
  backgroundColor: "#404040",
  width: "fit-content",
};

const theme = createTheme({
  components: {
    MuiPickersPopper: {
      styleOverrides: {
        root: {
          zIndex: 19000,
        },
      },
    },
  },
});

const TableListView: React.FC<TableListViewProps> = ({
  table,
}: {
  table: Table;
}) => {
  const navigate = useNavigate();
  const [columns, setColumns] = useState<Column[]>([]);
  const [rows, setRows] = useState<Row[] | undefined>([]);
  const [rowsFilter, setRowsFilter] = useState<Row[] | undefined>([]);
  const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false);
  const [isScriptPopupVisible, setIsScriptPopupVisible] =
    useState<boolean>(false);
  const [isFunctionPopupVisible, setIsFunctionPopupVisible] =
    useState<boolean>(false);
  const [inputValues, setInputValues] = useState<Row>({});
  const [currentPrimaryKey, setCurrentPrimaryKey] = useState<string | null>(
    null
  );
  const [openPanel, setOpenPanel] = useState(false);
  const [currentRow, setCurrentRow] = useState<Row>(new Row({}));
  const [currentPhone, setCurrentPhone] = useState<string>("");
  const [currentCategory, setCurrentCategory] = useState<string>("");
  const [currentWYSIWYG, setCurrentWYSIWYG] = useState<string>("");
  const [showFiles, setShowFiles] = useState<boolean>(false);
  const [scripts, setScripts] = useState<Row[] | undefined>([]);
  const [functions, setFunctions] = useState<Row[] | undefined>([]);

  const [scriptDescription, setScriptDescription] = useState<string | null>("");
  const [functionDescription, setFunctionDescription] = useState<string | null>("");

  const [selectedScript, setSelectedScript] = useState<Row | null>(null);
  const [selectedFunction, setSelectedFunction] = useState<Row | null>(null);

  const [appConfigValues, setAppConfigValues] = useState<Row[] | undefined>([]);
  const rteRef = useRef<RichTextEditorRef>(null);
  const [fileGroupsView, setFileGroupsView] = useState<Row[] | undefined>([]);
  const [allFileGroups, setAllFileGroups] = useState<Row[] | undefined>([]);
  const [inputField, setInputField] =
    useState<(column: Column) => JSX.Element>();
  const meta_schema = vmd.getSchema("meta");
  const script_table = vmd.getTable("meta", "scripts");
  const function_table = vmd.getTable("meta", "function_map");

  const config_table = vmd.getTable("meta", "appconfig_values");
  let defaultOrderValue = table.columns.find(
    (column) => column.is_editable === false
  )?.column_name;
  if (defaultOrderValue == undefined) {
    defaultOrderValue = table.columns[0].column_name;
  }
  //These are all the Usestate which is used for Pagination, Sorting and Filtering for the List view of the table
  const [PaginationValue, setPaginationValue] = useState<number>(10);
  const [PageNumber, setPageNumber] = useState<number>(1);
  const [Plength, setLength] = useState<number>(0);
  const [showTable, setShowTable] = useState<boolean>(false);
  const [sortOrder, setSortOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState(defaultOrderValue);
  const [conditionFilter, setConditionFilter] = useState<string>("");
  const [FilterMenu, setFilterMenu] = useState<(null | HTMLElement)[]>(new Array(columns.length).fill(null));
  const [FilterCheckedList, setFilterCheckedList] = useState<{ [key: string]: string[] }>(() => {
    const initialCheckedState = table.columns.reduce((acc, column) => {
      acc[column.column_name] = [];
      return acc;
    }, {} as { [key: string]: string[] });

    return initialCheckedState;
  });


  const getRows = async () => {
    const attributes = table.getVisibleColumns();
    const schemas = vmd.getTableSchema(table.table_name);

    if (!schemas) {
      return;
    }

    const data_accessor: DataAccessor = vmd.getRowsDataAccessorForOrder(
      schemas.schema_name,
      table.table_name,
      orderBy,
      sortOrder,
      PaginationValue,
      PageNumber,
      conditionFilter
    );

    const countAccessor: DataAccessor = vmd.getRowsDataAccessor(
      schemas.schema_name,
      table.table_name
    );
    const count = await countAccessor.fetchRows();
    const lines = await data_accessor.fetchRows();

    // Filter the rows to only include the visible columns
    const filteredRows = lines?.map((row) => {
      const filteredRowData: { [key: string]: string | number | boolean } = {};
      attributes.forEach((column) => {
        filteredRowData[column.column_name] = row[column.column_name];
      });
      return new Row(filteredRowData);
    });
    const FilteredRowsCount = count?.map((row) => {
      const filteredRowData: { [key: string]: string | number | boolean } = {};
      attributes.forEach((column) => {
        filteredRowData[column.column_name] = row[column.column_name];
      });
      return new Row(filteredRowData);
    });
    setColumns(attributes);
    setRows(filteredRows);

    if (conditionFilter === "") {
      setRowsFilter(FilteredRowsCount);
      setLength(count?.length || 0);
    }
    else {
      setRowsFilter(filteredRows);
      setLength(lines?.length || 0);
    }

  };

  useEffect(() => {
    getRows();
  }, [table, orderBy, PageNumber, PaginationValue, sortOrder, conditionFilter]);

  const fileGroupsViewDataAccessor = vmd.getViewRowsDataAccessor(
    "filemanager",
    "filegroup_view"
  );
  const fileStorageViewDataAccessor = vmd.getViewRowsDataAccessor(
    "filemanager",
    "filestorage_view"
  );

  const getFileGroupsView = async () => {
    fileGroupsViewDataAccessor.fetchRows().then((response) => {
      setFileGroupsView(response);
    });
  };

  const getScripts = async () => {
    if (!meta_schema || !script_table) {
      throw new Error("Schema or table not found");
    }

    const scripts_data_accessor: DataAccessor = vmd.getRowsDataAccessor(
      meta_schema?.schema_name,
      script_table?.table_name
    );

    const scripts_rows = await scripts_data_accessor?.fetchRows();
    const filteredScripts = scripts_rows?.filter(
      (script) => script.table_name === table.table_name
    );

    setScripts(filteredScripts);
  };
const getFunctions = async () => {
  if (!meta_schema || !function_table) {
    throw new Error("Schema or table not found");
  }

  const functions_data_accessor: DataAccessor = vmd.getRowsDataAccessor(
    meta_schema?.schema_name,
    function_table?.table_name
  );

  const functions_rows = await functions_data_accessor?.fetchRows();
  const filteredFunctions = functions_rows?.filter(
    (func) => func.table_name === table.table_name
  );

  setFunctions(filteredFunctions);
};
  const handleScriptHover = async (description: string) => {
    setScriptDescription(description);
  };

  const handleScriptHoverExit = () => {
    setScriptDescription(null);
  };
  const handleFunctionHover = async (description: string) => {
    setFunctionDescription(description);
  };

  const handleFunctionHoverExit = () => {
    setFunctionDescription(null);
  };

  const handleConfirmForm = () => {
    setIsScriptPopupVisible(true);
  };
  const handleFunctionConfirmForm = () => {
    setIsFunctionPopupVisible(true);
  };
  useEffect(() => {
    if (selectedScript) {
      handleConfirmForm();
    }
  }, [selectedScript]);

  useEffect(() => {
    if (selectedFunction) {
      handleFunctionConfirmForm();
    }
  }, [selectedFunction]);

  const getConfigs = async () => {
    if (!meta_schema || !config_table) {
      throw new Error("Schema or table not found");
    }

    const config_data_accessor: DataAccessor = vmd.getRowsDataAccessor(
      meta_schema?.schema_name,
      config_table?.table_name
    );

    const config_rows = await config_data_accessor?.fetchRows();

    setAppConfigValues(config_rows);
  };

  useEffect(() => {
    getScripts();
    getConfigs();
    getFunctions();
    getFileGroupsView();
  }, [inputValues]);

  const inputStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    width: table.stand_alone_details_view ? "80%" : "120%",
  };
  const tableStyle = table.stand_alone_details_view
    ? "form-group-stand-alone"
    : "form-group";
  //For when order changes
  const handleSort = (column: React.SetStateAction<string>) => {
    const isAsc = orderBy === column && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setOrderBy(column);
  };

  //For sorting of rows with asc and desc
  const sortedRows = [...rows].sort((a, b) => {
    if (sortOrder === "asc") {
      return a[orderBy] < b[orderBy] ? -1 : 1;
    } else {
      return a[orderBy] > b[orderBy] ? -1 : 1;
    }
  });

  //For when pagination limit changes
  const handlePaginationchange = (event: SelectChangeEvent) => {
    setPaginationValue(event.target.value as unknown as number);
    setPageNumber(1);
  };

  //For when page number changes
  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPageNumber(value);
  };

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
      .then((response) => {
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
    const nonEditableColumn = table.columns.find(
      (column) => column.is_editable === false
    );
    if (nonEditableColumn) {
      setCurrentPrimaryKey(nonEditableColumn.column_name);
    }
    getRows();
  };

  const onItemRemoved = async (e, item, currentColumn) => {
    e.preventDefault();
    await axios
      .post(
        "http://localhost:3000/rpc/remove_file_from_group",
        {
          in_filegroupid: currentRow.row[currentColumn],
          in_fileid: item.id,
        },
        {
          headers: {
            "Content-Profile": "filemanager",
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        if (response.data) {
          let tempRow = {
            ...currentRow.row,
            [currentColumn]: null,
          };
          setCurrentRow({ row: tempRow });
        }
      });
    const newItems = allFileGroups?.filter((file) => file.id !== item.id);
    setAllFileGroups(newItems);
    getRows();
  };

  const handleShowFiles = (column: Column) => {
    fileStorageViewDataAccessor.fetchRows().then((response) => {
      setAllFileGroups(
        response?.filter(
          (file) => file.groupid == currentRow.row[column.column_name]
        )
      );
    });
    setShowFiles(true);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    columnName: string | undefined,
    type: string | undefined
  ) => {
    const nonEditableColumn = table.columns.find(
      (column) => column.is_editable === false
    );
    if (nonEditableColumn) {
      setCurrentPrimaryKey(nonEditableColumn.column_name);
    }
    let eventName: string | undefined = undefined;
    let eventValue: string | undefined = undefined;
    if (event?.target?.name !== undefined && event?.target?.name !== "") {
      eventName = event.target.name;
      eventValue = event.target.value;
    } else {
      if (type !== undefined) {
        eventName = columnName;
        eventValue = event;
      } else if (type == "phone" || type == "date") {
        eventName = columnName;
        eventValue = event.format();
      } else {
        eventName = columnName;
        eventValue = event.target.value;
      }
    }

    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      [eventName as string]: eventValue,
    }));
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
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
    setInputValues({});
    setOpenPanel(false);
  };

  //Filter Functions
  //Handle when you click on the filter button
  const handleFilterClick = (event: React.MouseEvent<HTMLElement>, index: number) => {
    const newPopup = [...FilterMenu];
    newPopup[index] = event.currentTarget;
    setFilterMenu(newPopup);
  };

  //handle when you press off the pop up or when you click confirm
  const handleFilterClose = (index: number) => {
    const newPopup = [...FilterMenu];
    newPopup[index] = null;
    setFilterMenu(newPopup);
    let Filter = "";
    Object.entries(FilterCheckedList).map(([key, value]) => {

      if (value.length > 0) {
        Filter += `&${key}=in.(${value.map((val) => `"${val}"`).join(",")}) `;
        setConditionFilter(Filter);
      }



    });
    if (Object.values(FilterCheckedList).every(value => value.length === 0)) {
      setConditionFilter("");
    }

  };

  //When a check is selected on the pop up
  const handleFilterToggle = (value: string, columnName: string) => () => {
    const currentIndex = FilterCheckedList[columnName]?.indexOf(value) ?? -1;
    const newChecked = [...(FilterCheckedList[columnName] || [])];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setFilterCheckedList({ ...FilterCheckedList, [columnName]: newChecked });
  };

  //when we click on Reset Filter
  const ResetFilter = () => {
    const resetChecked: { [key: string]: string[] } = {};
    columns.forEach((column) => {
      resetChecked[column.column_name] = [];
    });
    setFilterCheckedList(resetChecked);
    setConditionFilter("");
  };
  //End of Filter Function

  const DeleteRow =  async(row: Row) => {
    let column_name: string | undefined;
    let column_value: string | undefined;
      table.columns.forEach((column) => {
        if (column.is_editable === false) {
         // Check if the row contains the key
          column_name = column.column_name as string
          column_value = row.row?.[column.column_name] as string;
        }
      });
      const schema = vmd.getTableSchema(table.table_name);
      if (!schema) {
        console.error("Schema not found");
        return;
      }
      console.log(schema.schema_name)
      if( column_name && column_value){
      const data_accessor_delete: DataAccessor = vmd.getRemoveRowAccessor(
        schema.schema_name,
        table.table_name,
        column_name,
        column_value
      );

      data_accessor_delete.deleteRow().then((res) => {
        getRows();
      });
      console.log(data_accessor_delete)
    }
    else{
      console.error("No Primary Key Found");
    }

  }
    // Object.entries(row.row).map(([key, value]) => {


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

    if (column.references_table != null ) {
      const string = column.column_name + "L";
      localStorage.setItem(
        string,
        currentRow.row[column.column_name] as string
      );
    }
    return showFiles ? (
      <div title="Dropzone">
        <Dropzone
          onItemAdded={onItemAdded}
          onItemRemoved={onItemRemoved}
          items={allFileGroups}
          currentColumn={column.column_name}
        />
      </div>
    ) : (
      <Button
        title="Show Files Button"
        variant="contained"
        color="primary"
        style={{ marginLeft: 15 }}
        onClick={handleShowFiles.bind(this, column)}
      >
        Show Files
      </Button>
    );
  };






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

      if (column.references_table != null) {
        const string = column.column_name + "LL";
        localStorage.setItem(
          string,
          currentRow.row[column.column_name] as string
        );
      }
      if (
        !columnDisplayType ||
        columnDisplayType.value == "text" ||
        columnDisplayType.value == "email"
      ) {
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
            <ThemeProvider theme={theme}>
              <DatePicker
                value={dayjs(currentRow.row[column.column_name])}
                onChange={(date) =>
                  handleInputChange(date, column.column_name, "date")
                }
                name={column.column_name}
                className="date-time-picker"
                readOnly={column.is_editable === false ? true : false}
              />
            </ThemeProvider>
          </LocalizationProvider>
        );
      } else if (columnDisplayType.value == "datetime") {
        return (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <ThemeProvider theme={theme}>
              <DateTimePicker
                value={dayjs(currentRow.row[column.column_name])}
                onChange={(date) =>
                  handleInputChange(date, column.column_name, "date")
                }
                name={column.column_name}
                className="date-time-picker"
                readOnly={column.is_editable === false ? true : false}
              />
            </ThemeProvider>
          </LocalizationProvider>
        );
      } else if (columnDisplayType.value == "categories") {
        return (
          <Select
            value={
              currentCategory
                ? currentCategory
                : currentRow.row[column.column_name]
            }
            name={column.column_name}
            onChange={(event) => {
              handleInputChange(event, column.column_name, undefined);
              setCurrentCategory(event.target.value);
            }}
            native
            className="width"
          >
            {Object.keys(CategoriesDisplayType).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </Select>
        );
      } else if (columnDisplayType.value == "phone") {
        return (
          <MuiTelInput
            value={
              currentPhone !== "" || currentPhone
                ? currentPhone
                : currentRow.row[column.column_name]
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
          <input
            type="number"
            name={column.column_name}
            readOnly={column.is_editable === false ? true : false}
            placeholder={String(currentRow.row[column.column_name]) || ""}
            style={inputStyle}
            onChange={handleInputChange}
          />
        );
      } else if (columnDisplayType.value == "multiline_wysiwyg") {
        return (
          <RichTextEditor
            name={column.column_name}
            content={
              currentWYSIWYG
                ? currentWYSIWYG
                : currentRow.row[column.column_name]
            }
            onChange={(event) => {
              handleInputChange(event, column.column_name, undefined);
              rteRef.current?.editor.setContent(event);
            }}
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
  }, [
    currentRow,
    columns,
    table,
    appConfigValues,
    currentPhone,
    rows,
    currentCategory,
    inputValues,
    currentWYSIWYG,
    allFileGroups,
    showFiles,
  ]);
  useEffect(() => {
    getRows();
  }, [showFiles]);

  // Function to save the current row
  const handleOpenPanel = (row: Row) => {
    setCurrentRow(row);
    setCurrentPhone("");
    setCurrentCategory("");
    setCurrentWYSIWYG("");
    if (!table.has_details_view) {
      return;
    }
    if (table.stand_alone_details_view) {
      console.log("No Stand Alone Details View " + table.table_name);
    }
    const schema = vmd.getTableSchema(table.table_name);
    let detailtype = "overlay";
    if (table.stand_alone_details_view) {
      detailtype = "standalone";
    }
    navigate(
      `/${schema?.schema_name.toLowerCase()}/${table.table_name.toLowerCase()}/${row.row[table.table_name + "_id"]
      }?details=${detailtype}`
    );
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
      }, 1000);
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

        <div className="d-flex flex-column">
          {(scripts || []).length > 0 && <h6>Scripts</h6>}
          {scripts?.map((script) => {
            return (
              <Tooltip
                key={script["id"]}
                title={script["description"]}
                open={scriptDescription === script["description"]}
                placement="right"
              >
                <Button
                  key={script["id"]}
                  style={buttonStyle}
                  variant="contained"
                  onClick={() => {
                    // handleConfirmForm();
                    setSelectedScript(script);
                  }}
                  onMouseEnter={() => handleScriptHover(script["description"])}
                  onMouseLeave={handleScriptHoverExit}
                >
                  {script["btn_name"]}
                </Button>
              </Tooltip>
            );
          })}
          {isScriptPopupVisible && selectedScript && (
            <ScriptLoadPopup
              onClose={() => {
                setIsScriptPopupVisible(false);
                setSelectedScript(null);
              }}
              script={selectedScript}
            />
          )}
        </div>
        <div className="d-flex flex-column">
          {(functions || []).length > 0 && <h6>Functions</h6>}
          {functions?.map((func) => {
            return (
              <Tooltip
                key={func["id"]}
                title={func["description"]}
                open={functionDescription === func["description"]}
                placement="right"
              >
                <Button
                  key={func["id"]}
                  style={buttonStyle}
                  variant="contained"
                  onClick={() => {
                    setSelectedFunction(func);
                  }}
                  onMouseEnter={() => handleFunctionHover(func["description"])}
                  onMouseLeave={handleFunctionHoverExit}
                >
                  {func["btn_name"]}
                </Button>
              </Tooltip>
            );
          })}
          {isFunctionPopupVisible && selectedFunction && (
            <FunctionLoadPopup
              onClose={() => {
                setIsFunctionPopupVisible(false);
                setSelectedFunction(null);
              }}
              function={selectedFunction}
            />
          )}
        </div>
      </div>
      <Button
        style={{
          ...buttonStyle, marginTop: "",
          backgroundColor: conditionFilter === "" ? "#404040" : "#1976d2"
        }}
        variant="contained"
        onClick={ResetFilter}
        data-testid="reset-filter-button">
        Reset Filters</Button>

        
      <TableContainer>
        <MUITable
          className="table-container"
          size="medium"
          sx={{ border: "1px solid lightgrey" }}
          style={{ padding: '10px' }}
          data-testid="table"
        >
          <TableHead>
            <TableRow>
              {columns.map((column, index) => (
                <TableCell key={index} style={{ textAlign: "center", whiteSpace: 'nowrap' }}
                >
                  <TableSortLabel
                    active={orderBy === column.column_name}
                    direction={sortOrder as "asc" | "desc" | undefined}
                    onClick={() => handleSort(column.column_name)}
                  >
                    {column.column_name}
                  </TableSortLabel >
                  <Button size="small" style={{ color: 'black', maxWidth: '25px', minWidth: '25px' }}
                    onClick={(event) => handleFilterClick(event, index)}
                    data-testid="Button-Filtering"
                  >
                    <IoIosArrowUp /></Button>
                  <Menu
                    id={`simple-menu-${index}`}
                    anchorEl={FilterMenu[index]}
                    keepMounted
                    open={Boolean(FilterMenu[index])}
                    onClose={() => handleFilterClose(index)}
                    data-testid="filter-menu"
                    sx={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', maxHeight: '500px' }}
                  >
                    <Button variant="text"
                      style={{
                        ...buttonStyle,
                        backgroundColor: 'black',
                        textAlign: 'center',
                        color: 'white',
                        margin: '0px 10px 10px 10px',
                        position: 'sticky',
                        top: '10px',
                        cursor: 'pointer',
                        zIndex: 1
                      }}
                      onClick={() => handleFilterClose(index)}
                      data-testid="filter-confirm-button">
                      Confirm
                    </Button>

                    <div  >

                      {[...new Set(rowsFilter?.map((row) => row.row[column.column_name]))].map((value) => {
                        if (value === true || value === false) {
                          value = value.toString();
                        }
                        return (
                          <MenuItem key={value} >
                            <Checkbox
                              edge="start"
                              checked={FilterCheckedList[column.column_name]?.indexOf(value) !== -1}
                              tabIndex={-1}
                              disableRipple
                              inputProps={{ 'aria-labelledby': `checkbox-list-label-${value}` }}
                              onClick={handleFilterToggle(value, column.column_name)}
                              size="small"
                            />
                            {value}
                          </MenuItem>
                        );
                      })}
                    </div>
                  </Menu>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedRows?.map((row, rowIdx) => (
              <TableRow
                title="row"
                key={rowIdx}
                onClick={() => handleOpenPanel(row)}
                sx={{ backgroundColor: rowIdx % 2 === 0 ? "#f2f2f2" : "white" }}
              >
                {Object.values(row.row).map((cell, idx) => (
                  <TableCell key={idx}>
                    <Box sx={{ textAlign: "center" }}>
                      {typeof cell === "boolean"
                        ? cell.toString()
                        : columns[idx].references_table === "filegroup"
                          ? fileGroupsView?.find(
                            (fileGroup) => fileGroup.id === cell
                          )?.count
                          : (cell as React.ReactNode)}
                    </Box>
                  </TableCell>
                ))}
              <TableCell>
                <Button
                size="large"
                style={{ color: 'black',  }}
                data-testid="delete-row-button"
                onClick={(event) => {
                  event.stopPropagation();
                  
                DeleteRow(row);

                  
                }}
                >
                  <IoIosTrash size ="1.4em"/>
                </Button>
              </TableCell>
              
              </TableRow> 
              
            ))}
            
          </TableBody>
        </MUITable>
      </TableContainer>

      <div>
        <Container>
          <RRow>
            <CCol sm={5} className="mx-auto" style={{ textAlign: "right" }}>
              <Pagination
                count={Math.ceil(Plength / PaginationValue)}
                page={PageNumber}
                onChange={handlePageChange}
              />
            </CCol>
            <CCol sm={2} className="ml-auto" style={{ textAlign: "right" }}>
              <FormControl size="small">
                <Select
                  value={PaginationValue.toString()}
                  displayEmpty
                  onChange={handlePaginationchange}
                >

                  <MenuItem value={10}>10 per page</MenuItem>
                  <MenuItem value={20}>20 per page</MenuItem>
                  <MenuItem value={50}>50 per page</MenuItem>
                  <MenuItem value={100}>100 per page</MenuItem>
                </Select>
              </FormControl>
            </CCol>
          </RRow>
        </Container>
      </div>

      <SlidingPanel
        type={"right"}
        isOpen={openPanel}
        size={table.stand_alone_details_view ? 100 : 50}
        panelContainerClassName="panel-container"
        backdropClicked={() => {
          setCurrentPhone("");
          setCurrentCategory("");
          setCurrentWYSIWYG("");
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
                    return (
                      <div key={colIdx} className="row-details">
                        <label key={column.column_name + colIdx}>
                          {column.column_name}
                        </label>
                        {column.references_table == "filegroup" ? (
                          <FileInputField {...column} />
                        ) : (
                          inputField(column)
                        )}
                      </div>
                    );
                  })}
                </div>
              </form>
              <div>
                <Button
                  variant="contained"
                  style={buttonStyle}
                  onClick={() => {
                    setCurrentPhone("");
                    setCurrentCategory("");
                    setCurrentWYSIWYG("");
                    setInputValues({});
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
          </div>
          <div style={{ paddingBottom: "2em", paddingLeft:'1.5em'}}>
            {table.lookup_tables == "null" ? (
              <div></div>
            ) : JSON.parse(table.lookup_tables)[-1] == "none" ? (
              <div></div>
            ) : showTable ? (
              <div style={{ paddingBottom: "2em" }}>
                <LookUpTableDetails table={table} />
              </div>
            ) : (
              <Button
                variant="contained"
                style={{
                  marginTop: 20,
                  backgroundColor: "#403eb5",
                  width: "fit-content",
                  marginLeft: 10,
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

export default TableListView;
