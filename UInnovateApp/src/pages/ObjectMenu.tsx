import { NavBar } from "../components/NavBar";
import TableComponent from "../components/TableComponent";
import tables from "../virtualmodel/Tables";

export function ObjectMenu() {
  return (
    <>
      <NavBar />
      <div
        style={{ textAlign: "center", fontSize: "60px", paddingTop: "40px" }}
      >
        {" "}
        Tables would go under here
      </div>
      <div>
        <TableComponent columnNames={tables}></TableComponent>
      </div>
    </>
  );
}
