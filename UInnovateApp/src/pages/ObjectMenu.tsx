import { NavBar } from "../components/NavBar";
import TableTitles from "../components/TableTitles";
import { useTableVisibility } from "../contexts/TableVisibilityContext";
import { useState, useEffect } from "react";
import attr from "../virtualmodel/Tables";

export function ObjectMenu() {
  const { tableVisibility } = useTableVisibility();
  const [view, SetView] = useState("list");

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
        {Object.keys(tableVisibility).map((tableName) => {
          if (tableVisibility[tableName]) {
            return (
              <TableTitles
                key={tableName}
                attr={attr.filter((table) => table.table_name === tableName)}
                list_display={view}
              />
            );
          }
          return null;
        })}
      </div>
    </>
  );
}
