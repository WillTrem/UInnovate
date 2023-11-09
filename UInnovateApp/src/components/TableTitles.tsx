import { Link } from "react-router-dom";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import {
  useTableVisibility,
  TableVisibilityType,
} from "../contexts/TableVisibilityContext";
import { Table } from "../virtualmodel/Tables";

export default function TableTitles({ attr }: { attr: Table[] }) {
  const { tableVisibility } = useTableVisibility(); // Only use the visibility state

  return (
    <div>
      {attr.map((table: Table) => {
        // Check if the table is visible
        if (tableVisibility[table.table_name as keyof TableVisibilityType]) {
          return (
            <>
              <Sidebar>
                <Menu>
                  <MenuItem
                    component={
                      <Link
                        to={`/app/${table.table_name}`}
                        style={{
                          fontSize: "25px",
                          color: "black",
                          textDecoration: "none",
                        }}
                      />
                    }
                  >
                    {table.table_name}
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
