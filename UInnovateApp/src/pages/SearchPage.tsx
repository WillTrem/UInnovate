import React, { useEffect, useState } from 'react';
import vmd from '../virtualmodel/VMD';
import { NavBar } from "../components/NavBar";
import { Search } from '@mui/icons-material';
import { Box, Typography, Select, MenuItem, InputLabel, FormControl, TextField, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material';

interface TableInfo {
    table_name: string;
    columns: { column_name: string, column_type: string }[];
  }


const SearchComponent: React.FC = () => {
    const [tables, setTables] = useState<string[]>([]);
    const [selectedTable, setSelectedTable] = useState<string>('');
    const [columns, setColumns] = useState<{ column_name: string, column_type: string }[]>([]);
    const [selectedColumn, setSelectedColumn] = useState<string>('');
    const [searchValue, setSearchValue] = useState<string>('');
    const [results, setResults] = useState<any[]>([]);
    const [placeholder, setPlaceholder] = useState<string>('');

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const schema = vmd.getSchema('app_rentals');
        if (schema) {
          setTables(schema.tables.map((table: any) => table.table_name));
        }
      } catch (error) {
        console.error('Error fetching tables:', error);
      }
    };

    fetchTables();
  }, []);

  useEffect(() => {
    const fetchColumns = async () => {
      if (selectedTable) {
        try {
          const table = vmd.getTable('app_rentals', selectedTable);
          if (table) {
            setColumns(table.columns.map((col: any) => ({ column_name: col.column_name, column_type: col.column_type })));
          }
        } catch (error) {
          console.error('Error fetching columns:', error);
        }
      }
    };

    fetchColumns();
  }, [selectedTable]);

  useEffect(() => {
    if (selectedColumn) {
      const column = columns.find(col => col.column_name === selectedColumn);
      const type = columns.find(col => col.column_name === selectedColumn)?.column_type;
      setPlaceholder(column ? `Enter ${column.column_name}` : '');
    } else {
      setPlaceholder('');
    }
  }, [selectedColumn, columns]);


  const handleSearch = async () => {
    if (selectedTable && selectedColumn && searchValue) {
      try {
        const table = vmd.getTable('app_rentals', selectedTable);
        if (table) {
          const dataAccessor = vmd.getRowsDataAccessor('app_rentals', table.table_name);
          const rows = await dataAccessor.fetchRows();

          const filteredRows = rows.filter((row: any) => row[selectedColumn].toString().toLowerCase().includes(searchValue.toLowerCase()));

          setResults(filteredRows);
        }
      } catch (error) {
        console.error('Error searching data:', error);
      }
    }
  };

  return (
    <>
      <NavBar />
      <Box sx={{ padding: 3 }}>
        <Typography variant="h4" align="left" gutterBottom>
          Search
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'left', flexWrap: 'wrap', gap: 2, marginBottom: 3 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="table-label">Table</InputLabel>
            <Select
              labelId="table-label"
              id="table"
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value)}
              label="Table"
            >
              <MenuItem value=""><em>Select Table</em></MenuItem>
              {tables.map((table) => (
                <MenuItem key={table} value={table}>{table}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 200 }} disabled={!selectedTable}>
            <InputLabel id="column-label">Column</InputLabel>
            <Select
              labelId="column-label"
              id="column"
              value={selectedColumn}
              onChange={(e) => setSelectedColumn(e.target.value)}
              label="Column"
            >
              <MenuItem value=""><em>Select Column</em></MenuItem>
              {columns.map((column) => (
                <MenuItem key={column.column_name} value={column.column_name}>{column.column_name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            id="value"
            label="Value"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            disabled={!selectedColumn}
            placeholder={placeholder}
            sx={{ minWidth: 200 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearch}
            disabled={!selectedTable || !selectedColumn || !searchValue}
            startIcon={<Search />}
            sx={{ alignSelf: 'center' }}
          >
            Search
          </Button>
        </Box>
        <Typography variant="h4" align="left" gutterBottom>
          Results
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {results.length > 0 && Object.keys(results[0]).map((key) => (
                  <TableCell key={key}>{key}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {results.length > 0 ? (
                results.map((row, index) => (
                  <TableRow key={index}>
                    {Object.values(row).map((value, i) => (
                      <TableCell key={i}>{value}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">No results found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

export default SearchComponent;
