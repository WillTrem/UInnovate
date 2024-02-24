import { TableItem } from "./TableConfigTab";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ConfigurationSaver from "./ConfigurationSaver";
import vmd from "../../virtualmodel/VMD";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/Store";
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material";
import React, { useState } from "react";
import { LOGIN_BYPASS } from "../../redux/AuthSlice";

const DisplayTab = () => {

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
  // Prevents error when schema_access has a length of 0
  const initialSelectedSchema = schemas.length === 0 ? "" : schemas[0]
  const [selectedSchema, setSelectedSchema] = useState(initialSelectedSchema);

  // Only show tables of the selected schema
  const tables = vmd.getSchema(selectedSchema)?.tables;
  const tableItems = tables?.map((table) => (
    <TableItem key={table.table_name} table={table} />
  ));

  const handleSchemaChange = (event: SelectChangeEvent) => {
    setSelectedSchema(event.target.value);
  };

  return (
    <div>
      
      <ConfigurationSaver />
      {schemas.length !== 0 ?
      <Tab.Container>
        <Row>
          <Col sm={3}>
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
                    <Nav.Link eventKey={table_name}>{table_name}</Nav.Link>
                  </Nav.Item>
                );
              })}
            </Nav>
          </Col>
          <Col sm={9}>
            <Tab.Content>
              {tableItems?.map((tableItem, idx) => {
                const tableName = tableItem.props.table.table_name;
                return (
                  <Tab.Pane
                    key={idx}
                    eventKey={tableName}
                    data-testid="table-settings-content"
                  >
                    {tableItem}
                  </Tab.Pane>
                );
              })}
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
      :
      <Typography variant="body1">You don't have access to any tables.</Typography>}
    </div>
  );
};

export default DisplayTab;
