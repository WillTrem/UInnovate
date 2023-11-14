import { NavBar } from "../components/NavBar";
import TableTitles from "../components/TableTitles";
// import { useTableVisibility } from "../contexts/TableVisibilityContext";
import { useState } from "react";
import attr from "../virtualmodel/Tables";
import { RootState } from "../redux/Store";
import { useSelector } from "react-redux";

export function ObjectMenu() {
  // const { tableVisibility } = useTableVisibility();
  const [view, SetView] = useState("list");
  const selectedSchema: string = useSelector(
    (state: RootState) => state.schema.value
  );
  function toggleViewStatus() {
    if (view === "list") {
      SetView("enum");
    } else {
      SetView("list");
    }
  }
  return (
    <>
      <NavBar />
      <div>
        <button onClick={() => toggleViewStatus()}>View status: {view}</button>
      </div>
      <div>
        <TableTitles attr={attr} list_display={view} selectedSchema={selectedSchema}/>
      </div>
    </>
  );
}
