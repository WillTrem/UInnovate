import { useEffect, useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import {
  AdditionalView,
  getViewsBySchema,
} from "../virtualmodel/AdditionalViewsDataAccessor";
import { ViewTypeEnum } from "../enums/ViewTypeEnum";
import { useNavigate } from "react-router-dom";

interface AdditionalViewNavBarProp {
  selectedSchema: string;
  selectedView: string;
  selectViewHandler: (
    p_schema: string,
    p_tableName: string,
    p_viewName: string,
    p_viewType: ViewTypeEnum
  ) => void;
}
const AdditionalViewNavBar = ({
  selectedSchema,
  selectedView,
  selectViewHandler,
}: AdditionalViewNavBarProp) => {
  const [viewList, setViewList] = useState<AdditionalView[]>([]);

  useEffect(() => {
    const ctrl = new AbortController();
    const signal = ctrl.signal;
    // get data from db
    getViewsBySchema(setViewList, selectedSchema, signal);

    return () => {
      ctrl.abort();
    };
  }, [selectedSchema]);

  return (
    <>
      <AdditionalTableViewSelector
        views={viewList}
        selectedSchema={selectedSchema}
        selectedView={selectedView}
        selectedViewHandler={selectViewHandler}
      />
    </>
  );
};
interface AdditionalTableViewSelectorProp {
  views: AdditionalView[];
  selectedSchema: string;
  selectedView: string;
  selectedViewHandler: (
    p_schema: string,
    p_tableName: string,
    p_viewName: string,
    p_viewType: ViewTypeEnum
  ) => void;
}
const AdditionalTableViewSelector = ({
  views,
  selectedSchema,
  selectedViewHandler,
}: AdditionalTableViewSelectorProp) => {
  const [filteredViews, setFilteredViews] = useState<AdditionalView[]>(views);

  const navigate = useNavigate();
  useEffect(() => {
    setFilteredViews(views);
  }, [views]);

  //hide bar if no views
  if (views.length == 0) {
    return <></>;
  }

  const handleActiveView = (view: AdditionalView) => {
    selectedViewHandler(
      view.schemaname,
      view.tablename,
      view.viewname,
      view.viewtype
    );
  };

  const navLink = (view: AdditionalView) => {
    return (
      <Nav.Item key={view.viewname}>
        <Nav.Link
          eventKey={view.viewname}
          onClick={() => {
            handleActiveView(view);
            if (view.viewtype === ViewTypeEnum.Kpi) {
              navigate(`/${view.schemaname}/${view.viewname}`);
            } else {
              navigate(
                `/${view.schemaname}/${view.tablename}/${view.viewname}`
              );
            }
          }}
        >
          {view.viewname}
        </Nav.Link>{" "}
      </Nav.Item>
    );
  };

  const defaultViewname = "default";
  return (
    <Navbar bg="light" data-bs-theme="light" className="viewSelectionNav">
      <Container>
        <h4>views</h4>
        <Nav className="d-flex justify-content-evenly" variant="underline">
          <Nav.Item key={defaultViewname}>
            <Nav.Link
              eventKey={defaultViewname}
              onClick={() => {
                const defaultView: AdditionalView = {
                  id: 0,
                  schemaname: selectedSchema,
                  viewtype: ViewTypeEnum.Default,
                  viewname: defaultViewname,
                  tablename: "",
                };
                handleActiveView(defaultView);
                navigate(`/${selectedSchema}/`);
              }}
            >
              {defaultViewname}
            </Nav.Link>{" "}
          </Nav.Item>
          {filteredViews.length > 0 &&
            filteredViews.map((view: AdditionalView) => {
              if (view) {
                return navLink(view);
              }
            })}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default AdditionalViewNavBar;
