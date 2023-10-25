import { NavBar } from "../components/NavBar";
import attr from "../virtualmodel/Tables";
import TableListView from "../components/TableListView";
import { useParams } from "react-router-dom";


export function Element() {

    let {table_name}= useParams();


    return(
        
        <>
        <NavBar/>
        <div style={{textAlign:'center', fontSize:'40px', paddingTop:"40px"}}> Table Information of {table_name}</div>      
        
        
        <div>
        <TableListView nameoftable={table_name} ></TableListView>
        </div>

        
        </>
        
    );
}