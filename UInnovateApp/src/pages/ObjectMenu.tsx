import { NavBar } from "../components/NavBar";
import vmd from "../virtualmodel/VMD";
import { RootState } from "../redux/Store";
import { useDispatch, useSelector } from "react-redux";
import { Tab, Nav, Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Table } from "../virtualmodel/VMD";
import TableListView from "../components/TableListView";
import TableEnumView from "../components/TableEnumView";
import UnauthorizedScreen from "../components/UnauthorizedScreen";
import { LOGIN_BYPASS } from "../redux/AuthSlice";
import { useNavigate, useParams } from "react-router-dom";
import { updateSelectedSchema } from "../redux/SchemaSlice";

export function ObjectMenu() {
  const selectedSchema: string = useSelector(
    (state: RootState) => state.schema.value
  );
  const navigate = useNavigate()
  const handleTableSelect = (tableName: Table) => {
    setActiveTable(tableName);
    const schema = vmd.getTableSchema(tableName.table_name)
    // Navigate to the TableListView route with the selected table name
    navigate(`/${schema?.schema_name.toLowerCase()}/${tableName.table_name.toLowerCase()}`);
  };
  const dispatch = useDispatch();
  const { tableName } = useParams()
  const {schema} = useParams()

  const [activeTable, setActiveTable] = useState<Table | null>(null);
  
  // Get the visible tables from the VMD for the selected schema
  const tables = vmd.getVisibleTables(schema ?? selectedSchema);
  
  useEffect(() => {
    dispatch(updateSelectedSchema(schema ?? ""));
  }, [schema]);
  const {user, schema_access} = useSelector((state: RootState) => state.auth);


  return (
    <>
      <NavBar />
      {(user === null && !LOGIN_BYPASS) || (user !== null && schema && !schema_access.includes(schema)) ?
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
                        table.table_display_type === "list" ? (
                          <TableListView table={table}></TableListView>
                        ) : table.table_display_type === "enum" ? (
                          <TableEnumView table={table}></TableEnumView>
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
