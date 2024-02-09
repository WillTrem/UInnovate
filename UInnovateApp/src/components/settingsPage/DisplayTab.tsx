import { TableItem } from "./TableConfigTab";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ConfigurationSaver from "./ConfigurationSaver";
import vmd from "../../virtualmodel/VMD";
import { FormControl, FormHelperText, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { useState } from "react";
import { c } from "vitest/dist/reporters-5f784f42.js";

const DisplayTab = () => {
  const schemas = vmd.getSchemas();


  const correctSchemas = schemas.filter((schema) => schema.schema_name !== "cron");
  const [currentSchema, SetcurrentSchema] = useState<string>(correctSchemas[0].schema_name);
  const tables = vmd.getTables(currentSchema);
  const tableItems = tables?.map((table) => (
    <TableItem key={table.table_name} table={table} />
  ));
  const handleSchemaSelect = (event: SelectChangeEvent<string>) => {
    SetcurrentSchema(event.target.value as string);
  };


  return (
    <div>
      <FormControl size="small" style={{marginBottom:'2em', marginTop:'-2em' } }>
        <h6>Schema</h6>
        <Select
          data-testid="display-type-table-config"
          value={currentSchema}
          onChange={handleSchemaSelect}
          
        >
          {correctSchemas.map((schema) => (
            <MenuItem value={schema.schema_name}>{schema.schema_name}</MenuItem>
          ))}
        </Select>
        <FormHelperText>
          Choose which schema to change the tables of
        </FormHelperText>
      </FormControl>
      <ConfigurationSaver />
      <Tab.Container>
        <Row>
          <Col sm={3}>
            <h4>Tables</h4>
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
    </div>
  );
};

export default DisplayTab;
