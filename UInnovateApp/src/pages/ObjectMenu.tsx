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
import { updateSelectedViewList } from "../redux/AdditionalViewSlice";
import { Row as DataRow } from "../virtualmodel/DataAccessor";

import CustomViewLoader from "../components/CustomViewLoader";
import {
  getCustomViews,
  getViewsBySchema,
} from "../virtualmodel/AdditionalViewsDataAccessor";

export interface viewSelection {
  schema: string;
  tableName: string;
  selectedView: ViewTypeEnum;
}

interface customTemplate {
  id: number;
  schemaname: string;
  tablename: string;
  viewname: string;
  viewtype: number;
  template: string;
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
    p_tableName: string | undefined,
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

        dispatch(updateSelectedViewList([...selectedViewList, view]));
      } else {
        //get existing value
        viewType = selection[0].selectedView;
      }
      setViewType(viewType);

      if (viewType == ViewTypeEnum.Custom) {
        //update custom view index
        const index = findIndexByTablename(p_tableName);
        if (index > 0) {
          setselectedCustomViewIndex(index);
        } else {
          setselectedCustomViewIndex(0);
        }
      }
    }
  };

  function findIndexByTablename(tablename: string) {
    for (let i = 0; i < customViews.length; i++) {
      if (customViews[i].tablename === tablename) {
        return i; // Return the index of the object with matching tablename
      }
    }
    return -1; // Return -1 if the object is not found
  }

  const dispatch = useDispatch();
  const { tableName } = useParams();
  const { schema } = useParams();

  const selectedViewList: Array<viewSelection> = useSelector(
    (state: RootState) => state.selectedViewList.value,
  );
  const [customViews, setCustomViews] = useState<customTemplate[]>([]);
  const [selectedCustomViewIndex, setselectedCustomViewIndex] =
    useState<number>(0);

  const [viewType, setViewType] = useState<ViewTypeEnum>(ViewTypeEnum.Default);

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
    dispatch(updateSelectedViewList([...filteredList, newEntry]));
    setViewType(p_viewType);
  };

  useEffect(() => {
    dispatch(updateSelectedSchema(schema ?? ""));
    const table = tables?.filter((t) => t.table_name == tableName)[0];
    setActiveTable(table || null);
    setViewForTable(schema, tableName);
    const abortCtrl = new AbortController();
    getCustomViewForSchema(schema, abortCtrl.signal);
    return () => abortCtrl.abort();
  }, [schema]);
  const { user, schema_access } = useSelector((state: RootState) => state.auth);

  const getCustomViewForSchema = (schema: string, signal: AbortSignal) => {
    getViewsBySchema(null, schema, signal).then(
      async (data: DataRow[] | undefined) => {
        let customTemplates: customTemplate[] = [];
        const filteredData = data?.filter(
          (r) => r.viewtype == ViewTypeEnum.Custom,
        );
        let customViews: DataRow[] = [];
        await getCustomViews((data: DataRow[] | undefined) => {
          customViews = data;
        }, new AbortController().signal);

        filteredData?.map((data) => {
          const matching_template = customViews.filter(
            (x) => x.settingid == data.id,
          );
          if (matching_template.length > 0) {
            const template: customTemplate = {
              ...data,
              template: matching_template[0].template,
            };
            customTemplates = [...customTemplates, template];
          }
        });
        setCustomViews(customTemplates || []);
      },
    );
  };

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
                        {activeTable && (
                          <CustomViewLoader
                            table={activeTable}
                            templateSource={
                              customViews.length > 0
                                ? customViews[selectedCustomViewIndex].template
                                : ""
                            }
                          />
                        )}
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
