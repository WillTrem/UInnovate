import { Table as MUITable, TableContainer, TableHead, TableRow, TableCell, TableSortLabel, Menu, MenuItem, Checkbox, TableBody, Box } from '@mui/material';
import { orderBy } from 'lodash';
import React from 'react';
import { Button, Row } from 'react-bootstrap';
import { IoIosArrowUp } from 'react-icons/io';
import DeleteRowButton from './TableListViewComponents/DeleteRowButton';

interface TableListViewTableProps {
    // Define the props for the component here
}

const TableListViewTable: React.FC<TableListViewTableProps> = () => {
    // Implement the component logic here

    return (
        <div>
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
        </div>
    );
};

export default TableListViewTable;