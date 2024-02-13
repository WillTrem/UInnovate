import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent} from "@mui/material";
import React, { useEffect, useState } from 'react'
import vmd from '../../virtualmodel/VMD'
import { LOGIN_BYPASS } from '../../redux/AuthSlice'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/Store'
import { Nav } from "react-bootstrap";

interface SchemaTableSelectorProp{
    setTable: React.Dispatch<React.SetStateAction<string>>;
    setSchema: React.Dispatch<React.SetStateAction<string>>;
}
const SchemaTableSelector = ({setTable, setSchema}:SchemaTableSelectorProp) => {
    const { user, schema_access } = useSelector((state: RootState) => state.auth);
    
    const schemas = [
        ...new Set(vmd.getApplicationSchemas()
          .map((schema) => schema.schema_name)
          .filter((schema_name) => {
            // Ensures that on LOGIN_BYPASS without being logged in, all the schemas show
            if ((LOGIN_BYPASS && user === null) || schema_access.includes(schema_name)) {
              return schema_name;
            }
          })),
      ];


    const initialSelectedSchema = schemas.length === 0 ? "" : schemas[0]
    const [selectedSchema, setSelectedSchema] = useState(initialSelectedSchema);

      const handleSchemaChange = (event: SelectChangeEvent) => {
        setSchema(event.target.value);
        setSelectedSchema(event.target.value);
        setTable('');
        console.log(event.target.value);
      };
  // Only show tables of the selected schema
  const tables = vmd.getSchema(selectedSchema)?.tables;

  useEffect(()=>{
  //initial values of passed functions
  setSchema(schemas[0]);
  setTable('');
  }, [])

const handleClick = (table_name: string): void => {
    setTable(table_name);
    }
  
  return (
    <>
        <Box display="flex" gap="1rem" alignItems={"center"} >
            <h4 style={{ marginBottom: 0 }}>Tables</h4>
            <FormControl fullWidth disabled={schemas.length === 0}>
                <InputLabel id="schema-label">Schema</InputLabel>
                <Select
                labelId="schema-label"
                name="schema"
                value={selectedSchema}
                onChange={(event) => handleSchemaChange(event)}
                variant="outlined"
                label="Schema"
                size="small"
                >
                {schemas.map((schema) => {
                    return <MenuItem key={schema} value={schema}>{schema}</MenuItem>
                })};
                </Select>
            </FormControl>
        </Box>
        <Nav variant="pills" className="flex-column">
              {tables?.map(({ table_name }) => {

                return (
                  <Nav.Item key={table_name} data-testid="table-setting-nav">
                    <Nav.Link eventKey={table_name} onClick={(e)=>{e.preventDefault(); handleClick(table_name);}} >{table_name}</Nav.Link>
                  </Nav.Item>
                );
              })}
            </Nav>
    </>
  )
}

export default SchemaTableSelector