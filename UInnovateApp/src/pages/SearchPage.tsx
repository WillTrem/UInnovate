import React, { useEffect, useState } from 'react';
import vmd from '../virtualmodel/VMD';
import { NavBar } from "../components/NavBar";

interface TableInfo {
  table_name: string;
  columns: string[];
}

const SearchComponent: React.FC = () => {
  const [tables, setTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [columns, setColumns] = useState<string[]>([]);
  const [selectedColumn, setSelectedColumn] = useState<string>('');
  const [searchValue, setSearchValue] = useState<string>('');
  const [results, setResults] = useState<any[]>([]);

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
            setColumns(table.columns.map((col: any) => col.column_name));
          }
        } catch (error) {
          console.error('Error fetching columns:', error);
        }
      }
    };

    fetchColumns();
  }, [selectedTable]);

  const handleSearch = async () => {
    if (selectedTable && selectedColumn && searchValue) {
      try {
        const table = vmd.getTable('app_rentals', selectedTable);
        if (table) {
          const dataAccessor = vmd.getRowsDataAccessor('app_rentals', table.table_name);
          const rows = await dataAccessor.fetchRows();

          const filteredRows = rows.filter((row: any) => row[selectedColumn].toString().includes(searchValue));
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
    
      <h2>Search</h2>
      <div>
        <label htmlFor="table">Table:</label>
        <select id="table" value={selectedTable} onChange={(e) => setSelectedTable(e.target.value)}>
          <option value="">Select Table</option>
          {tables.map((table) => (
            <option key={table} value={table}>{table}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="column">Column:</label>
        <select id="column" value={selectedColumn} onChange={(e) => setSelectedColumn(e.target.value)} disabled={!selectedTable}>
          <option value="">Select Column</option>
          {columns.map((column) => (
            <option key={column} value={column}>{column}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="value">Value:</label>
        <input id="value" type="text" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} disabled={!selectedColumn} />
      </div>
      <button onClick={handleSearch} disabled={!selectedTable || !selectedColumn || !searchValue}>Search</button>
      <div>
        <h3>Results</h3>
        {results.length > 0 ? (
          <table>
            <thead>
              <tr>
                {Object.keys(results[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value, i) => (
                    <td key={i}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No results found</p>
        )}
      </div>
    </>
  );
};

export default SearchComponent;
