import { NavBar } from "../components/NavBar";
import TableTitles from "../components/TableTitles";
import { useState } from "react";
import vmd from "../virtualmodel/VMD";
import { RootState } from "../redux/Store";
import { useSelector } from "react-redux";

export function ObjectMenu() {
  const [view, SetView] = useState("list");
  const selectedSchema: string = useSelector(
    (state: RootState) => state.schema.value
  );

  // Get the visible tables from the VMD for the selected schema
  const tables = vmd.getVisibleTables(selectedSchema);

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
        <TableTitles tables={tables} />
      </div>
    </>
  );
}
