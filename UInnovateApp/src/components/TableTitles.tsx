import { Tab, Nav, Row, Col } from "react-bootstrap";
import {
  useTableVisibility,
  TableVisibilityType,
} from "../contexts/TableVisibilityContext";
import { Table } from "../virtualmodel/Tables";
import TableListView from "./TableListView";
import TableEnumView from "./TableEnumView";

interface TableTitlesProps {
  attr: Table[];
  selectedSchema: string;
  list_display: string;
}
export default function TableTitles({
  attr,
  selectedSchema,
  list_display,
}: TableTitlesProps) {
  const { tableVisibility } = useTableVisibility();

  return (
    <div>
      <Tab.Container>
        <Row>
          <Col sm={3}>
            <Nav variant="pills" className="flex-column">
              {attr
                .filter((table: Table) => table.schema == selectedSchema)
                .map((table: Table) => {
                  if (
                    tableVisibility[
                      table.table_name as keyof TableVisibilityType
                    ]
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
              {attr.map((table: Table) => (
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
              ))}
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </div>
  );
}
