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
import AdditionalViewNavBar from "../components/AdditionalViewNavBar";
import { ViewTypeEnum } from "../enums/ViewTypeEnum";

interface viewSelection {
  schema: string;
  tableName: string;
  selectedView: ViewTypeEnum;
}

export function ObjectMenu() {
  const selectedSchema: string = useSelector(
    (state: RootState) => state.schema.value,
  );
  const navigate = useNavigate();
  const handleTableSelect = (table: Table) => {
    setActiveTable(table);
    const schema = vmd.getTableSchema(table.table_name);
    // Navigate to the TableListView route with the selected table name

    setViewForTable(schema?.schema_name, table.table_name);

    navigate(
      `/${schema?.schema_name.toLowerCase()}/${table.table_name.toLowerCase()}`,
    );
  };

  const setViewForTable = (
    p_schema: string | undefined,
    p_tableName: string,
  ) => {
    if (p_schema && p_tableName) {
      //retrieve view selection from list
      let selection = selectedViewList.filter((v) => {
        if (v.schema == p_schema && v.tableName == p_tableName) return true;
        return false;
      });

      let viewType = ViewTypeEnum.Default;
      //add default if it dosen't exist
      if (selection.length == 0) {
        const view: viewSelection = {
          schema: p_schema,
          tableName: p_tableName,
          selectedView: viewType,
        };

        setSelectedViewList([...selectedViewList, view]);
      } else {
        //get existing value
        viewType = selection[0].selectedView;
      }
      console.log(`view type: ${viewType}`);
      setViewType(viewType);
    }
  };
  const dispatch = useDispatch();
  const { tableName } = useParams();
  const { schema } = useParams();

  const [selectedViewList, setSelectedViewList] = useState<
    Array<viewSelection>
  >([]);
  const [viewType, setViewType] = useState<ViewTypeEnum>(ViewTypeEnum.Default);
  const selectViewsStorageKey = "objectMenu_selectedViews";

  const [activeTable, setActiveTable] = useState<Table | null>(null);

  // Get the visible tables from the VMD for the selected schema
  const tables = vmd.getVisibleTables(schema ?? selectedSchema);

  const handleViewTypeSelection = (
    p_schema: string,
    p_tableName: string,
    p_viewType: ViewTypeEnum,
  ) => {
    //get list without schema table
    const filteredList = selectedViewList.filter((v) => {
      if (v.schema == p_schema && v.tableName == p_tableName) return false;
      return true;
    });
    const newEntry = {
      schema: p_schema,
      tableName: p_tableName,
      selectedView: p_viewType,
    };
    setSelectedViewList([...filteredList, newEntry]);
    setViewType(p_viewType);
  };

  useEffect(() => {
    dispatch(updateSelectedSchema(schema ?? ""));
    setActiveTable(null);

    const storedState = localStorage.getItem(selectViewsStorageKey);
    if (storedState) {
      setSelectedViewList(JSON.parse(storedState));
    }

    return () => {
      // Save your state when navigating away
      localStorage.setItem(
        selectViewsStorageKey,
        JSON.stringify(selectedViewList),
      );
    };
  }, [schema]);
  const { user, schema_access } = useSelector((state: RootState) => state.auth);

  return (
    <>
      <NavBar />
      {(user === null && !LOGIN_BYPASS) ||
      (user !== null && schema && !schema_access.includes(schema)) ? (
        <UnauthorizedScreen />
      ) : (
        <>
          <AdditionalViewNavBar
            selectedSchema={selectedSchema}
            selectedTable={activeTable}
            selectedViewType={viewType}
            selectViewHandler={handleViewTypeSelection}
          />
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
                    {viewType == ViewTypeEnum.Default && (
                      <>
                        {tables?.map((table: Table) => (
                          <Tab.Pane
                            key={table.table_name}
                            eventKey={table.table_name}
                          >
                            {tableName === table.table_name ? (
                              table.table_display_type === "list" ? (
                                <TableListView table={table}></TableListView>
                              ) : table.table_display_type === "enum" ? (
                                <TableEnumView table={table}></TableEnumView>
                              ) : null
                            ) : null}
                          </Tab.Pane>
                        ))}
                      </>
                    )}
                    {viewType == ViewTypeEnum.Calendar && (
                      <>
                        <span>Calendar view</span>
                      </>
                    )}
                    {viewType == ViewTypeEnum.Timeline && (
                      <>
                        <span>Timeline view</span>
                      </>
                    )}
                    {viewType == ViewTypeEnum.TreeView && (
                      <>
                        <span>TreeView view</span>
                      </>
                    )}
                    {viewType == ViewTypeEnum.Custom && (
                      <>
                        <span>Custom view</span>
                      </>
                    )}
                  </Tab.Content>
                </Col>
              </Row>
            </Tab.Container>
          </div>
        </>
      )}
    </>
  );
}
