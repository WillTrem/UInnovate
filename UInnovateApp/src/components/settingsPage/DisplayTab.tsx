import { TableItem } from "./TableConfigTab";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ConfigurationSaver from "./ConfigurationSaver";
import vmd from "../../virtualmodel/VMD";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/Store";

const DisplayTab = () => {

 const selectedSchema = useSelector((state: RootState) => state.schema.value);

  // Only show tables of the selected schema
  const tables = vmd.getSchema(selectedSchema)?.tables;
  const tableItems = tables?.map((table) => (
    <TableItem key={table.table_name} table={table} />
  ));


  return (
    <div>
      
      {/* <ConfigurationSaver /> */}
      <Tab.Container>
        <Row>
          <Col sm={3}>
                <h4 style={{ marginBottom: 0 }}>Tables</h4>
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
