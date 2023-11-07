import { Link } from "react-router-dom";
import { Table } from "../virtualmodel/Tables";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";

export default function TableTitles({ attr }: { attr: Table[] }) {
  const tableNames = Array.from(
    new Set(attr.map((table: Table) => table.table_name))
  );

  return (
    <div>
      {tableNames.map((tableName) => {
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
                  {" "}
                  {tableName}
                </MenuItem>
              </Menu>
            </Sidebar>
          </>
        );
      })}
    </div>
  );
}
