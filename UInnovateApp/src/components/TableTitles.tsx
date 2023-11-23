import { Tab, Nav, Row, Col } from "react-bootstrap";
import { useState } from "react";
import { Table } from "../virtualmodel/VMD";
import TableListView from "./TableListView";
import TableEnumView from "./TableEnumView";

interface TableTitlesProps {
  tables: Table[] | undefined;
}
export default function TableTitles({ tables }: TableTitlesProps) {
  const [activeTable, setActiveTable] = useState<Table | null>(null);

  if (!tables) {
    return null;
  }

  return (
    <div>
      <Tab.Container>
        <Row>
          <Col sm={3}>
            <Nav variant="pills" className="flex-column">
              {tables.map((table: Table) => {
                return (
                  <Nav.Item key={table.table_name}>
                    <Nav.Link
                      eventKey={table.table_name}
                      onClick={() => setActiveTable(table)}
                    >
                      {table.table_name}
                    </Nav.Link>
                  </Nav.Item>
                );
              })}
            </Nav>
          </Col>
          <Col sm={9}>
            <Tab.Content>
              {tables.map((table: Table) => (
                <Tab.Pane key={table.table_name} eventKey={table.table_name}>
                  {activeTable?.table_name === table.table_name ? (
                    table.table_display_type === "list" ? (
                      <TableListView table={table}></TableListView>
                    ) : (
                      <TableEnumView table={table}></TableEnumView>
                    )
                  ) : null}
                </Tab.Pane>
              ))}
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </div>
  );
}
