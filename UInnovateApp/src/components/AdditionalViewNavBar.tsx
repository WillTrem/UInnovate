import React, { useEffect, useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import {
  AdditionalViews,
  getCustomViews,
  getViewsBySchema,
} from "../virtualmodel/AdditionalViewsDataAccessor";
import { Table } from "../virtualmodel/VMD";
import { ViewTypeEnum } from "../enums/ViewTypeEnum";
import e from "express";

interface AdditionalViewNavBarProp {
  selectedSchema: string;
  selectedTable?: Table | null;
  selectedViewType: ViewTypeEnum;
  selectViewHandler: (
    p_schema: string,
    p_tableName: string,
    p_viewType: ViewTypeEnum,
  ) => void;
}
const AdditionalViewNavBar = ({
  selectedSchema,
  selectedTable,
  selectedViewType,
  selectViewHandler,
}: AdditionalViewNavBarProp) => {
  const [viewList, setViewList] = useState<AdditionalViews[]>([]);
  const [customViews, setCustomViews] = useState([]);

  useEffect(() => {
    const ctrl = new AbortController();
    const signal = ctrl.signal;
    // get data from db
    getViewsBySchema(setViewList, selectedSchema, signal);
    // getCustomViews(setCustomViews, signal)

    return () => {
      ctrl.abort();
    };
  }, [selectedSchema]);
  0;
  return (
    <>
      <AdditionalTableViewSelector
        views={viewList}
        selectedSchema={selectedSchema}
        selectedTable={selectedTable?.table_name}
        selectedView={selectedViewType}
        selectedViewHandler={selectViewHandler}
      />
    </>
  );
};
interface AdditionalTableViewSelectorProp {
  views: AdditionalViews[];
  selectedSchema: string;
  selectedTable: string | undefined;
  selectedView: ViewTypeEnum;
  selectedViewHandler: (
    p_schema: string,
    p_tableName: string,
    p_viewType: ViewTypeEnum,
  ) => void;
}
const AdditionalTableViewSelector = ({
  views,
  selectedSchema,
  selectedTable,
  selectedView,
  selectedViewHandler,
}: AdditionalTableViewSelectorProp) => {
  const [filteredViews, setFilteredViews] = useState<AdditionalViews[]>([]);
  const [activeView, setActiveView] = useState(0);

  useEffect(() => {
    setActiveView(selectedView);
    const filteredViews = views.filter((view: AdditionalViews) => {
      if (view.tablename === selectedTable) return true;
      return false;
    });
    setFilteredViews(filteredViews);
  }, [activeView, selectedTable]);

  if (filteredViews.length == 0) {
    return <></>;
  }

  const handleActiveView = (viewtype: ViewTypeEnum) => {
    selectedViewHandler(selectedSchema, selectedTable, viewtype);
    setActiveView(viewtype);
  };

  const navLink = (
    viewName: string,
    viewtype: ViewTypeEnum,
    linkText: string,
  ) => {
    return (
      <Nav.Item key={viewName}>
        <Nav.Link
          eventKey={viewName}
          href="#"
          className={viewtype == activeView ? "active" : ""}
          onClick={(e) => {
            handleActiveView(viewtype);
          }}
        >
          {linkText}
        </Nav.Link>{" "}
      </Nav.Item>
    );
  };

  return (
    <Navbar bg="light" data-bs-theme="light" className="viewSelectionNav">
      <Container>
        <h4>views</h4>
        <Nav className="d-flex justify-content-evenly" variant="underline">
          {navLink("default", ViewTypeEnum.Default, "Default")}
          {filteredViews.length > 0 &&
            filteredViews.map((view: AdditionalViews) => {
              if (view) {
                switch (view.viewtype) {
                  case ViewTypeEnum.Calendar:
                    return navLink(
                      view.viewname,
                      ViewTypeEnum.Calendar,
                      "Calendar",
                    );
                  case ViewTypeEnum.Timeline:
                    return navLink(
                      view.viewname,
                      ViewTypeEnum.Timeline,
                      "Timeline",
                    );
                  case ViewTypeEnum.TreeView:
                    return navLink(
                      view.viewname,
                      ViewTypeEnum.TreeView,
                      "Tree View",
                    );
                  case ViewTypeEnum.Custom:
                    return navLink(
                      view.viewname,
                      ViewTypeEnum.Custom,
                      "Custom",
                    );
                }
              }
            })}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default AdditionalViewNavBar;
