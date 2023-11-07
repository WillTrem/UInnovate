import { NavBar } from "../components/NavBar";
import TableEnumView from "../components/TableEnumView";
import attr from "../virtualmodel/Tables";

export function EnumView() {
  return (
    <>
      <NavBar />
      <div
        style={{ textAlign: "center", fontSize: "40px", paddingTop: "40px" }}
      >
        {" "}
        Enum View
      </div>
      <div>
        <TableEnumView attr={attr}></TableEnumView>
      </div>
    </>
  );
}
