import { NavBar } from "../components/NavBar";

import { Link } from "react-router-dom";

export function ObjectMenu() {
  return (
    <>
      <NavBar />
      <div
        style={{ textAlign: "center", fontSize: "40px", paddingTop: "40px" }}>
        
        Which View:
      </div>


      <div style={{textAlign:"center"}}>
      <Link to={`/app`} style={{ fontSize: "25px" , color:'black', textDecoration:'none'}}>List View</Link>
      <br />

      <Link to={`/enumview`} style={{ fontSize: "25px" , color:'black', textDecoration:'none'}}>Enum View</Link>

      
      </div>
      

    </>
  );
}
