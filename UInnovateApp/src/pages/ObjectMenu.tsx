import { NavBar } from "../components/NavBar";
import TableTitles from "../components/TableTitles";
import { useTableVisibility } from "../contexts/TableVisibilityContext";
import attr from "../virtualmodel/Tables";

export function ObjectMenu() {
  const { tableVisibility } = useTableVisibility();
  return (
    <>
      <NavBar />
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
