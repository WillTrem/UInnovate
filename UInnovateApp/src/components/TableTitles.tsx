import { Link } from "react-router-dom";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import {
  useTableVisibility,
  TableVisibilityType,
} from "../contexts/TableVisibilityContext";
import { Table } from "../virtualmodel/Tables";

export default function TableTitles({ attr }: { attr: Table[] }) {
  const tableNames = Array.from(
    new Set(attr.map((table: Table) => table.table_name))
  );
  const { tableVisibility } = useTableVisibility(); // Only use the visibility state

  return (
    <div>
      {tableNames.map((tableName: string) => {
        // Check if the table is visible
        if (tableVisibility[tableName as keyof TableVisibilityType]) {
          return (
            <>
              <Sidebar>
                <Menu>
                  <MenuItem
                    component={
                      <Link
                        to={`/app/${tableName}`}
                        style={{
                          fontSize: "25px",
                          color: "black",
                          textDecoration: "none",
                        }}
                      />
                    }
                  >
                    {tableName}
                  </MenuItem>
                </Menu>
              </Sidebar>
            </>
          );
        }
        // If table not visible, don't render anything (or customize as needed)
        else {
          return null;
        }
      })}
    </div>
  );
}
