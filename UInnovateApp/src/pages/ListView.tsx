import { NavBar } from "../components/NavBar";
import attr from "../virtualmodel/Tables";
import TableTitles from "../components/TableTitles";
import TableComponent from "../components/TableComponent";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { useSelector } from "react-redux";
import { RootState } from "../redux/Store";

export function ListView() {
  const selectedSchema: string = useSelector(
    (state: RootState) => state.schema.value
  );
  return (
    <>
      <NavBar />
      <div
        style={{ textAlign: "center", fontSize: "40px", paddingTop: "40px" }}
      >
        {" "}
        Table Names:
      </div>

      <div>
        <TableTitles attr={attr} selectedSchema={selectedSchema}></TableTitles>
      </div>
    </>
  );
}
