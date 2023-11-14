import Button from "react-bootstrap/Button";
import { useTableVisibility } from "../../contexts/TableVisibilityContext";
import { TableItem } from "./TableConfigTab";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ConfigurationSaver from "./ConfigurationSaver";
import { useTables } from "../../contexts/TablesContext";
import { updateDisplayConfig } from "../../virtualmodel/ConfigProperties";
import { useConfig } from "../../contexts/ConfigContext";

const DisplayTab = () => {
  const { tableVisibility, setTableVisibility } = useTableVisibility();
  const { config } = useConfig();

  const tables = useTables();
  const tableItems = tables?.map(({ table_name }) => (
    <TableItem
      key={table_name}
      tableName={table_name}
      isVisible={tableVisibility[table_name]}
      toggleVisibility={setTableVisibility}
    />
  ));

  //Function to update database with new config (called on Save button click)
  function updateConfigDB() {
    console.log(config);
    updateDisplayConfig(config);
  }

  return (
    <div>
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
              {tableItems?.map((tableItem) => {
                const tableName = tableItem.props.tableName;
                return (
                  <Tab.Pane
                    key={tableName}
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
      <Button
        variant="primary"
        className="save-button"
        onClick={updateConfigDB}
      >
        Save Changes
      </Button>
    </div>
  );
};

export default DisplayTab;
