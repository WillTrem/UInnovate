import FormControl from "@mui/material/FormControl";
import { useTableAttributes } from "../../contexts/TablesContext";
import { useState } from "react";
import Switch from "@mui/material/Switch";
import "../../styles/TableItem.css";
import { Select } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { useConfig } from "../../contexts/ConfigContext";
import { ConfigProperty } from "../../virtualmodel/ConfigProperties";
import { ColumnDisplayTypes } from "../../virtualmodel/Config";
import { SelectChangeEvent } from "@mui/material";

interface ColumnConfigProps {
  tableName: string;
}

interface ColumnConfigRowProps {
  columnName: string;
  tableName: string;
  isVisible?: boolean;
}

export const ColumnConfig: React.FC<ColumnConfigProps> = ({
  tableName,
}: ColumnConfigProps) => {
  const attributes = useTableAttributes(tableName);
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
                columnName={attribute.column_name}
                tableName={tableName}
                key={attribute.column_name}
              />
            );
          })}
      </tbody>
    </table>
  );
};

const ColumnConfigRow: React.FC<ColumnConfigRowProps> = ({
  columnName,
  tableName,
}: ColumnConfigRowProps) => {
  const [visible, setVisible] = useState<boolean>(false);
  const { config, updateConfig } = useConfig();

  function handleVisibilityToggle(event: React.ChangeEvent<HTMLInputElement>) {
    setVisible(event.target.checked);
    updateConfig({
      property: ConfigProperty.VISIBLE,
      value: String(event.target.checked),
      column: columnName,
      table: tableName,
    });
  }

  function handleDisplayChange(event: SelectChangeEvent<string>) {
    updateConfig({
      property: ConfigProperty.COLUMN_DISPLAY_TYPE,
      value: event.target.value,
      column: columnName,
      table: tableName,
    });
  }
  return (
    <tr>
      <td className="semi-bold">{columnName}</td>
      <td>
        <Switch
          checked={
            visible
              ? visible
              : config?.find(
                  (config_value) =>
                    config_value.column == columnName &&
                    config_value.table == tableName &&
                    config_value.property == ConfigProperty.VISIBLE
                )?.value == "true"
              ? true
              : false
          }
          onChange={handleVisibilityToggle}
        />
      </td>
      <td>
        <FormControl size="small">
          <Select
            value={
              config?.find(
                (config_value) =>
                  config_value.column == columnName &&
                  config_value.table == tableName &&
                  config_value.property == ConfigProperty.COLUMN_DISPLAY_TYPE
              )?.value || ""
            }
            onChange={handleDisplayChange}
          >
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
