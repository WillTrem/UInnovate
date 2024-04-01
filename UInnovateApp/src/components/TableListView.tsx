import "../styles/TableComponent.css";
import vmd, { Table, Column } from "../virtualmodel/VMD";
import type { } from "@mui/x-date-pickers/themeAugmentation";
import { DataAccessor, Row } from "../virtualmodel/DataAccessor";
import React, { useState, useEffect, useRef } from "react";
import "react-sliding-side-panel/lib/index.css";
import RRow from "react-bootstrap/Row";
import CCol from "react-bootstrap/Col";
import Logger from "../virtualmodel/Logger";
import { useSelector } from "react-redux";
import { RootState } from "../redux/Store";
import { AuthState } from "../redux/AuthSlice";
import Box from "@mui/material/Box";
import ConfirmationPopup from "./SavePopup";
import InfoPopup from "./PrimaryKeyErrorPopup";
import { IoIosArrowUp } from "react-icons/io";
import SlidingPanel from "./TableListViewSlidingPanel.tsx";
import {
  Button,
  Select,
  MenuItem,
  FormControl,
  SelectChangeEvent,
  Tooltip,
  Menu,
  Checkbox
} from "@mui/material";
import AddRowPopup from "./AddRowPopup";
import Pagination from "@mui/material/Pagination";
import { Container } from "react-bootstrap";
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

import DeleteRowButton from "./TableListViewComponents/DeleteRowButton";
import { getConfigs } from "../helper/TableListViewHelpers";
import { set } from "lodash";
import { CloudUpload } from '@mui/icons-material'
import { VisuallyHiddenInput } from "./VisuallyHiddenInput";
import { CSVUploadButton } from "./CSVUploadButton";

interface TableListViewProps {
  table: Table;
}
interface EditingCell {
  rowIdx: number;
  columnName: string;
  value: string;
}
const buttonStyle = {
  marginTop: 20,
  backgroundColor: "#404040",
  width: "fit-content",
};

type ConfirmPopupContent = {
  title: string;
  message: string;
  confirmAction: () => void;
  onCancel?: () => void;
};

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
  const [scripts, setScripts] = useState<Row[] | undefined>([]);
  const [functions, setFunctions] = useState<Row[] | undefined>([]);

  const [scriptDescription, setScriptDescription] = useState<string | null>("");
  const [functionDescription, setFunctionDescription] = useState<string | null>(
    ""
  );

  const [selectedScript, setSelectedScript] = useState<Row | null>(null);
  const [selectedFunction, setSelectedFunction] = useState<Row | null>(null);

  const [fileGroupsView, setFileGroupsView] = useState<Row[] | undefined>([]);
  const [fileGroupFiles, setFileGroupFiles] = useState<object>({});
  const [allFileGroups, setAllFileGroups] = useState<Row[] | undefined>([]);
  const meta_schema = vmd.getSchema("meta");
  const script_table = vmd.getTable("meta", "scripts");
  const function_table = vmd.getTable("meta", "function_map");

  const [clickAction, setClickAction] = useState<"single" | "double" | null>(
    null
  );
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState(false);
  const [confirmPopupContent, setConfirmPopupContent] =
    useState<ConfirmPopupContent>({
      title: "",
      message: "",
      confirmAction: () => { },
    });
  const [isInfoPopupOpen, setIsInfoPopupOpen] = useState(false);
  const [infoPopupMessage, setInfoPopupMessage] = useState("");

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
  const [sortOrder, setSortOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState(defaultOrderValue);
  const [conditionFilter, setConditionFilter] = useState<string>("");
  const [FilterMenu, setFilterMenu] = useState<(null | HTMLElement)[]>(
    new Array(columns.length).fill(null)
  );
  const [FilterCheckedList, setFilterCheckedList] = useState<{
    [key: string]: string[];
  }>(() => {
    const initialCheckedState = table.columns.reduce(
      (acc, column) => {
        acc[column.column_name] = [];
        return acc;
      },
      {} as { [key: string]: string[] }
    );

    return initialCheckedState;
  });
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null);

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

    let tempFileColumn: string = "";

    const tempAllFileGroups: Row[] | undefined =
      await fileStorageViewDataAccessor.fetchRows();

    attributes.forEach((column) => {
      if (column.references_table == "filegroup") {
        tempFileColumn = column.column_name;
      }
    });
    // Filter the rows to only include the visible columns
    const filteredRows = lines?.map((row) => {
      const allFiles = tempAllFileGroups?.filter(
        (fileGroup) => fileGroup.groupid == row[tempFileColumn]
      );
      const tempFileGroupFiles = fileGroupFiles;
      tempFileGroupFiles[row[tempFileColumn]] = allFiles;
      setFileGroupFiles(tempFileGroupFiles);
      const filteredRowData: { [key: string]: string | number | boolean } = {};
      attributes.forEach((column) => {
        filteredRowData[column.column_name] = row[column.column_name];
      });
      return new Row(filteredRowData);
    });
    const FilteredRowsCount = count?.map((row) => {
      const filteredRowData: { [key: string]: string | number | boolean } = {};
      attributes.forEach((column) => {
        if (column.is_editable === false) {
          setCurrentPrimaryKey(column.column_name);
        }
        filteredRowData[column.column_name] = row[column.column_name];
      });
      return new Row(filteredRowData);
    });
    setColumns(attributes);
    setRows(filteredRows);

    if (conditionFilter === "") {
      setRowsFilter(FilteredRowsCount);
      setLength(count?.length || 0);
    } else {
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

  const getAppConfigs = async () => {
    getConfigs();
  };

  useEffect(() => {
    getRows();
    getFileGroupsView();
  }, [openPanel]);

  useEffect(() => {
    getScripts();
    getAppConfigs();
    getFunctions();
    getFileGroupsView();
  }, [inputValues]);

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
  const handleUserConfirm = () => {
    confirmPopupContent.confirmAction();
    setIsConfirmPopupOpen(false);
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

  const { user: loggedInUser }: AuthState = useSelector(
    (state: RootState) => state.auth
  );
  //Filter Functions
  //Handle when you click on the filter button
  const handleFilterClick = (
    event: React.MouseEvent<HTMLElement>,
    index: number
  ) => {
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
    if (Object.values(FilterCheckedList).every((value) => value.length === 0)) {
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

  // Object.entries(row.row).map(([key, value]) => {

  const handleDoubleClick = (rowIndex: number, column: Column) => {
    const newRow = rows[rowIndex];
    setCurrentRow(newRow);
    // clear timeout on double click
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
    }
    if (!column.is_editable) {
      setInfoPopupMessage(
        `${column.column_name} is not editable because it's a primary key.`
      );
      setIsInfoPopupOpen(true);
      return false;
    }
    const columnName = column.column_name;
    // Set state indicating the action is a double click
    setClickAction("double");
    const cellValue = newRow.row[columnName];
    const valueAsString = String(cellValue);
    setEditingCell({
      rowIdx: rowIndex,
      columnName: columnName,
      value: valueAsString,
    });
  };

  const handleClick = (row: Row) => {
    if (editingCell !== null) {
      return;
    }
    // Clear any existing timeout to start fresh
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }

    // Set a timeout for a single click
    clickTimeoutRef.current = setTimeout(() => {
      if (clickAction !== "double") {
        // It's a single click
        handleOpenPanel(row);
      }
      setClickAction(null);
    }, 200);
  };

  const handleSave = async (e, rowIdx: number, columnName: string) => {
    const confirmAction = async () => {
      if (e.preventDefault) e.preventDefault();

      const newValue = e.target.value;
      const updatedRow = { [columnName]: newValue };

      const schema = vmd.getTableSchema(table.table_name);
      if (!schema) {
        console.error("Schema not found");
        return;
      }

      Logger.logUserAction(
        loggedInUser || "",
        "Edited Cell",
        `User has modified cell ${columnName} in row ${rowIdx}: from ${currentRow.row[columnName]} to ${newValue}`,
        schema.schema_name,
        table.table_name
      );

      const primaryKeyValue = Object.keys(currentRow.row)[0];
      // Use the primary key for the row to identify which row to update
      const storedPrimaryKeyValue = currentRow.row[primaryKeyValue];
      // Call the update API
      try {
        const data_accessor: DataAccessor = vmd.getUpdateRowDataAccessorView(
          schema.schema_name,
          table.table_name,
          updatedRow,
          primaryKeyValue as string,
          storedPrimaryKeyValue as string
        );
        data_accessor.updateRow().then((res) => {
          getRows();
        });
        // Reflect the update locally
        const updatedRows = [...rows];
        updatedRows[rowIdx] = new Row(updatedRow);
        setRows(updatedRows);

        // Exit editing mode
      } catch (error) {
        console.error("Failed to update row", error);
      }
      setEditingCell(null);
    };

    setConfirmPopupContent({
      title: "Confirm Save",
      message: "Are you sure you want to save these changes?",
      confirmAction: confirmAction,
      onCancel: handleCancelConfirm,
    });
    setIsConfirmPopupOpen(true);
  };
  const handleKeyDown = (e, rowIdx: number, columnName: string) => {
    if (e.key === "Enter") {
      handleSave(e, rowIdx, columnName);
    }
  };
  const handleCancelConfirm = () => {
    setIsConfirmPopupOpen(false);
    setEditingCell(null);
  };

  useEffect(() => {
    getRows();
  }, []);

  // Function to save the current row
  const handleOpenPanel = (row: Row) => {
    setCurrentRow(row);
    if (!table.has_details_view) {
      return;
    }
    if (!table.stand_alone_details_view) {
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
              getRows={getRows}
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
      <Box display={"flex"} justifyContent={"space-between"} width={"100%"}>
        <Button
          style={{
            ...buttonStyle,
            marginTop: "",
            backgroundColor: conditionFilter === "" ? "#404040" : "#1976d2",
          }}
          variant="contained"
          onClick={ResetFilter}
          data-testid="reset-filter-button"
        >
          Reset Filters
        </Button>
        <CSVUploadButton table={table} getRows={getRows}/>
      </Box>
      <TableContainer>
        <MUITable
          className="table-container"
          size="medium"
          sx={{ border: "1px solid lightgrey" }}
          style={{ padding: "10px" }}
          data-testid="table"
        >
          <TableHead>
            <TableRow>
              {columns.map((column, index) => (
                <TableCell
                  key={index}
                  style={{ textAlign: "center", whiteSpace: "nowrap" }}
                >
                  <TableSortLabel
                    active={orderBy === column.column_name}
                    direction={sortOrder as "asc" | "desc" | undefined}
                    onClick={() => handleSort(column.column_name)}
                  >
                    {column.column_name}
                  </TableSortLabel>
                  <Button
                    size="small"
                    style={{
                      color: "black",
                      maxWidth: "25px",
                      minWidth: "25px",
                    }}
                    onClick={(event) => handleFilterClick(event, index)}
                    data-testid="Button-Filtering"
                  >
                    <IoIosArrowUp />
                  </Button>
                  <Menu
                    id={`simple-menu-${index}`}
                    anchorEl={FilterMenu[index]}
                    keepMounted
                    open={Boolean(FilterMenu[index])}
                    onClose={() => handleFilterClose(index)}
                    data-testid="filter-menu"
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      flexWrap: "wrap",
                      maxHeight: "500px",
                    }}
                  >
                    <Button
                      variant="text"
                      style={{
                        ...buttonStyle,
                        backgroundColor: "black",
                        textAlign: "center",
                        color: "white",
                        margin: "0px 10px 10px 10px",
                        position: "sticky",
                        top: "10px",
                        cursor: "pointer",
                        zIndex: 1,
                      }}
                      onClick={() => handleFilterClose(index)}
                      data-testid="filter-confirm-button"
                    >
                      Confirm
                    </Button>

                    <div>
                      {[
                        ...new Set(
                          rowsFilter?.map((row) => row.row[column.column_name])
                        ),
                      ].map((value) => {
                        if (value === true || value === false) {
                          value = value.toString();
                        }
                        return (
                          <MenuItem key={value}>
                            <Checkbox
                              edge="start"
                              checked={
                                FilterCheckedList[column.column_name]?.indexOf(
                                  value
                                ) !== -1
                              }
                              tabIndex={-1}
                              disableRipple
                              inputProps={{
                                "aria-labelledby": `checkbox-list-label-${value}`,
                              }}
                              onClick={handleFilterToggle(
                                value,
                                column.column_name
                              )}
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
            {sortedRows?.map((row: Row, rowIdx) => (
              <TableRow
                title="row"
                key={rowIdx}
                onClick={() => handleClick(row)}
                onDoubleClick={() => setCurrentRow(row)}
                sx={{ backgroundColor: rowIdx % 2 === 0 ? "#f2f2f2" : "white" }}
              >
                {Object.values(row.row).map((cell, idx) => (
                  <TableCell
                    key={idx}
                    onDoubleClick={() =>
                      handleDoubleClick(rowIdx, columns[idx])
                    }
                  >
                    {editingCell &&
                      editingCell.rowIdx === rowIdx &&
                      editingCell.columnName === columns[idx].column_name ? (
                      <input
                        type="text"
                        defaultValue={editingCell.value}
                        onBlur={(e) =>
                          handleSave(e, rowIdx, columns[idx].column_name)
                        }
                        onKeyDown={(e) =>
                          handleKeyDown(e, rowIdx, columns[idx].column_name)
                        }
                        autoFocus
                      />
                    ) : (
                      <Box sx={{ textAlign: "center" }}>
                        {typeof cell === "boolean"
                          ? cell.toString()
                          : columns[idx].references_table === "filegroup"
                            ? (
                              fileGroupsView?.find(
                                (fileGroup) => fileGroup.id === cell
                              )?.count || 0
                            ).toString() + " file(s)"
                            : (cell as React.ReactNode)}
                      </Box>
                    )}
                  </TableCell>
                ))}
                <TableCell>
                  <DeleteRowButton getRows={getRows} table={table} row={row} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </MUITable>
      </TableContainer>
      {isConfirmPopupOpen && (
        <ConfirmationPopup
          open={isConfirmPopupOpen}
          title={confirmPopupContent.title}
          message={confirmPopupContent.message}
          onConfirm={handleUserConfirm}
          onCancel={handleCancelConfirm}
        />
      )}
      {isInfoPopupOpen && (
        <InfoPopup
          open={isInfoPopupOpen}
          message={infoPopupMessage}
          onClose={() => setIsInfoPopupOpen(false)}
        />
      )}

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
        table={table}
        currentRow={currentRow}
        onItemAdded={onItemAdded}
        onItemRemoved={onItemRemoved}
        fileGroupFiles={fileGroupFiles}
        openPanel={openPanel}
        setOpenPanel={setOpenPanel}
      ></SlidingPanel>
    </div>
  );
};

export default TableListView;
