import FormControl from "@mui/material/FormControl";
import Switch from "@mui/material/Switch";
import "../../styles/TableItem.css";
import { Select } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { useConfig } from "../../contexts/ConfigContext";
import { ConfigProperty } from "../../virtualmodel/ConfigProperties";
import { ColumnDisplayTypes } from "../../virtualmodel/Config";
import { SelectChangeEvent } from "@mui/material";
import { Column, Table } from "../../virtualmodel/VMD";

interface ColumnConfigProps {
  table: Table;
}

interface ColumnConfigRowProps {
  column: Column;
  table: Table;
}

export const ColumnConfig: React.FC<ColumnConfigProps> = ({
  table,
}: ColumnConfigProps) => {
  const attributes = table.getColumns();
  const configProperties = ["Visible", "Display Component Type"]; // Add more configuration properties for columns here

  return (
    <table className="column-config-table">
      <thead>
        <tr>
          <td></td>
          {configProperties.map((property) => {
            return <td key={property}>{property}</td>;
          })}
        </tr>
      </thead>
      <tbody>
        {attributes &&
          attributes.map((attribute) => {
            return (
              <ColumnConfigRow
                column={attribute}
                table={table}
                key={attribute.column_name}
              />
            );
          })}
      </tbody>
    </table>
  );
};

const ColumnConfigRow: React.FC<ColumnConfigRowProps> = ({
  column,
  table,
}: ColumnConfigRowProps) => {
  const { updateConfig } = useConfig();

  function handleVisibilityToggle(event: React.ChangeEvent<HTMLInputElement>) {
    column.setVisibility(event.target.checked);
    updateConfig({
      property: ConfigProperty.VISIBLE,
      value: String(event.target.checked),
      column: column.column_name,
      table: table.table_name,
    });
  }

  function handleDisplayChange(event: SelectChangeEvent<string>) {
    column.setType(event.target.value);
    updateConfig({
      property: ConfigProperty.COLUMN_DISPLAY_TYPE,
      value: event.target.value,
      column: column.column_name,
      table: table.table_name,
    });
  }
  return (
    <tr>
      <td className="semi-bold">{column.column_name}</td>
      <td>
        <Switch
          data-testid="visibility-switch"
          checked={column.is_visible}
          onChange={handleVisibilityToggle}
        />
      </td>
      <td>
        <FormControl size="small">
          <Select value={column.column_type} onChange={handleDisplayChange}>
            {Object.keys(ColumnDisplayTypes).map((value) => (
              <MenuItem key={value} value={value}>
                {value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </td>
      {/* Add more configuration properties for columns here as <td> */}
    </tr>
  );
};
