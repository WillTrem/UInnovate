import { Link } from "react-router-dom";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Table } from "../virtualmodel/ITable";

interface TableTitlesProps {
  attr: Table[];
  selectedSchema: string;
}
export default function TableTitles({
  attr,
  selectedSchema,
}: TableTitlesProps) {
  const tableNames = Array.from(
    new Set(
      attr
        .filter((table: Table) => table.schema == selectedSchema)
        .map((table: Table) => table.table_name)
    )
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
