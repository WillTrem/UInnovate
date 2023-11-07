import { Menu, MenuItem, Sidebar } from "react-pro-sidebar";
import { Table } from "../virtualmodel/Tables";
import { Link } from "react-router-dom";

export default function TableEnumView({ attr }: { attr: Table[] }) {
  const tableNames: string[] = [];

  attr.forEach((table) => {
    tableNames.push(table.table_name);
  });

  return (
    <div>
      {tableNames.map((tableName) => {
        return (
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
                {""}
                {tableName}
              </MenuItem>
            </Menu>
          </Sidebar>
        );
      })}
    </div>
  );
}
