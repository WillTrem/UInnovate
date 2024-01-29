import { NavBar } from "../components/NavBar";
import vmd from "../virtualmodel/VMD";
import { RootState } from "../redux/Store";
import { useSelector } from "react-redux";
import { Tab, Nav, Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Table } from "../virtualmodel/VMD";
import TableListView from "../components/TableListView";
import TableEnumView from "../components/TableEnumView";
import UnauthorizedScreen from "../components/UnauthorizedScreen";
import { LOGIN_BYPASS } from "../redux/AuthSlice";
import { useNavigate, useParams } from "react-router-dom";

export function ObjectMenu() {
  const selectedSchema: string = useSelector(
    (state: RootState) => state.schema.value
  );
  const navigate = useNavigate()
  const handleTableSelect = (tableName: Table) => {
    setActiveTable(tableName);
    // Navigate to the TableListView route with the selected table name
    navigate(`/objview/${tableName.table_display_type.toLowerCase()}/${tableName.table_name.toLowerCase()}`);
  };
  const { tableName } = useParams()
  const { Type } = useParams()


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
          <Tab.Container activeKey={tableName}>
            <Row>
              <Col sm={3}>
                <Nav variant="pills" className="flex-column">
                  {tables?.map((table: Table) => {
                    return (
                      <Nav.Item key={table.table_name}>
                        <Nav.Link
                          eventKey={table.table_name}
                          onClick={() => handleTableSelect(table)}
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
                      {tableName === table.table_name ? (
                        Type?.toLowerCase() === "list" || Type?.toLowerCase() === "details" ? (
                          <TableListView table={table}></TableListView>
                        ) : Type?.toLowerCase() === "enum" ? (
                          <TableEnumView />
                        ) : null
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
