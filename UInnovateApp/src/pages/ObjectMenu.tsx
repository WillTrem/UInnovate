import { NavBar } from "../components/NavBar";
import vmd from "../virtualmodel/VMD";
import { RootState } from "../redux/Store";
import { useSelector } from "react-redux";
import { Tab, Nav, Row, Col } from "react-bootstrap";
import { useState } from "react";
import { Table } from "../virtualmodel/VMD";
import TableListView from "../components/TableListView";
import TableEnumView from "../components/TableEnumView";
import UnauthorizedScreen from "../components/UnauthorizedScreen";
import { LOGIN_BYPASS } from "../redux/AuthSlice";

export function ObjectMenu() {
  const selectedSchema: string = useSelector(
    (state: RootState) => state.schema.value
  );


  const [activeTable, setActiveTable] = useState<Table | null>(null);

  // Get the visible tables from the VMD for the selected schema
  const tables = vmd.getVisibleTables(selectedSchema);

  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <>
      <NavBar />
      {(user === null && !LOGIN_BYPASS) ?
        <UnauthorizedScreen />
        :
        <div className="page-container">
          <h1 className="title">Tables</h1>
          <Tab.Container>
            <Row>
              <Col sm={3}>
                <Nav variant="pills" className="flex-column">
                  {tables?.map((table: Table) => {
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
                  {tables?.map((table: Table) => (
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
        </div>}
    </>
  );
}
