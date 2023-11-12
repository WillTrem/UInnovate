import { Tab, Nav, Row, Col } from "react-bootstrap";
import {
  useTableVisibility,
  TableVisibilityType,
} from "../contexts/TableVisibilityContext";
import { Table } from "../virtualmodel/Tables";
import TableListView from "./TableListView";
import TableEnumView from "./TableEnumView";
import { useState, useEffect } from "react";

export default function TableTitles({
  attr,
  list_display,
}: {
  attr: Table[];
  list_display: string;
}) {
  const { tableVisibility } = useTableVisibility(); // Only use the visibility state
  const [selectedTable, setSelectedTable] = useState(null);
  return (
    <div className="page-layout">
      <Tab.Container
        id="left-tabs-example"
        activeKey={selectedTable}
        onSelect={(key) => setSelectedTable(key)}
      >
        <Row>
          <Col sm={3}>
            <Nav variant="pills" className="flex-column">
              {attr.map((table: Table) => {
                if (
                  tableVisibility[table.table_name as keyof TableVisibilityType]
                ) {
                  return (
                    <Nav.Item key={table.table_name}>
                      <Nav.Link eventKey={table.table_name}>
                        {table.table_name}
                      </Nav.Link>
                    </Nav.Item>
                  );
                }
              })}
            </Nav>
          </Col>
          <Col sm={9}>
            <Tab.Content>
              {attr.map((table: Table) => {
                return (
                  <Tab.Pane key={table.table_name} eventKey={table.table_name}>
                    {list_display === "list" ? (
                      <TableListView
                        nameOfTable={table.table_name}
                      ></TableListView>
                    ) : (
                      <TableEnumView
                        nameOfTable={table.table_name}
                      ></TableEnumView>
                    )}
                  </Tab.Pane>
                );
              })}
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </div>
  );
}
