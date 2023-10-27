import { NavBar } from "../components/NavBar";
import attr from "../virtualmodel/Tables";
import TableListView from "../components/TableListView";
import { useParams } from "react-router-dom";
import TableTitles from "../components/TableTitles";
import "./page.css";

export function Element() {

    let {table_name}= useParams();

    return(
        
        <>
        <NavBar/>
        <div style={{textAlign:'center', fontSize:'40px', paddingTop:"40px", paddingBottom:'40px'}}> Table Information of {table_name}</div>      
        
        
        <div className="sidebar">
        <TableTitles attr={attr}></TableTitles>
        <TableListView nameoftable={table_name} ></TableListView>
        </div>

        
        </>
        
    );
}