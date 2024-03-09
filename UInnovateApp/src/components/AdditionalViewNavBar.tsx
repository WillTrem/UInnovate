import React, { useEffect, useState } from 'react'
import { Container, Nav, Navbar } from 'react-bootstrap'
import { AdditionalViews, getCustomViews,  getViewsBySchema } from '../virtualmodel/AdditionalViewsDataAccessor';
import { Table } from "../virtualmodel/VMD";
import { ViewTypeEnum } from './settingsPage/additionalView/ViewTypeEnum';
import e from 'express';

interface AdditionalViewNavBarProp{
    selectedSchema: string;
    selectedTable?: Table;
}
const AdditionalViewNavBar = ({selectedSchema, selectedTable}: AdditionalViewNavBarProp) => {
    const [viewList, setViewList] = useState<AdditionalViews[]>([]);
    const [customViews, setCustomViews]= useState([]);

    useEffect(()=>{
        const ctrl = new AbortController();
        const signal = ctrl.signal;
        // get data from db
        getViewsBySchema(setViewList, selectedSchema, signal);
        // getCustomViews(setCustomViews, signal)

        return ()=>{ctrl.abort()};
    }
    ,[selectedSchema]);
0
    return (
        <>
        <AdditionalTableViewSelector views={viewList} selectedTable={selectedTable?.table_name}/>
        </>
    );
}
interface AdditionalTableViSelector{
    views: AdditionalViews[];
    selectedTable:string | undefined;
};
const AdditionalTableViewSelector = ({views, selectedTable}: AdditionalTableViSelector)=>{
    const [filteredViews, setFilteredViews] = useState([]);
    const [activeView, setActiveView] = useState(0);
    useEffect(()=>{
        console.log(views);
        const filteredViews = views.filter((view:AdditionalViews)=>{
            if(view.tablename === selectedTable)
                return true;
            return false;
        });
         setFilteredViews(filteredViews);

    },[selectedTable]);

    if(filteredViews.length == 0){
        return (
            <>
            </>
        );
    }

    const handleActiveView = (viewtype:ViewTypeEnum)=>{
        console.log(viewtype);
        setActiveView(viewtype);
    }

    const navLink = (viewName:string, viewtype:ViewTypeEnum, linkText:string) =>{
       
        return (<Nav.Item><Nav.Link key={viewName} eventKey={viewName} href="#" onClick={(e)=>{handleActiveView(viewtype)}} >{linkText}</Nav.Link> </Nav.Item>);
    }


    return (
    <Navbar bg="light" data-bs-theme="light" className="viewSelectionNav">
            <Container>
                <h4>views</h4>
            <Nav className="d-flex justify-content-evenly" variant='underline'>
                    {navLink("default", ViewTypeEnum.Default, "Default")}
                {
                    filteredViews.length > 0 && filteredViews.map((view: AdditionalViews)=>{
                        if(view){
                            switch(view.viewtype)
                            {
                                case ViewTypeEnum.Calendar: return (navLink(view.viewname, ViewTypeEnum.Calendar, "Calendar"))
                                case ViewTypeEnum.Timeline: return (navLink(view.viewname, ViewTypeEnum.Timeline, "Timeline"))
                                case ViewTypeEnum.TreeView: return (navLink(view.viewname, ViewTypeEnum.TreeView, "Tree View"))
                                case ViewTypeEnum.Custom: return (navLink(view.viewname, ViewTypeEnum.Custom, "Custom"))
                            }
                        }
                    }
                    )
                }
            </Nav>
            </Container>
        </Navbar>
    )
};

export default AdditionalViewNavBar