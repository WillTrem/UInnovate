import { NavBar } from "../components/NavBar";
import attr from "../virtualmodel/Tables";
import TableTitles from "../components/TableTitles";
import { useTableVisibility } from "../contexts/TableVisibilityContext";

export function ListView() {
  const { tableVisibility } = useTableVisibility();
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
        {Object.keys(tableVisibility).map((tableName) => {
          if (tableVisibility[tableName]) {
            return (
              <TableTitles
                key={tableName}
                attr={attr.filter((table) => table.table_name === tableName)}
              />
            );
          }
          return null;
        })}
      </div>
    </>
  );
}
