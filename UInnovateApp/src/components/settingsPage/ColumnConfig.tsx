import FormControl from "@mui/material/FormControl";
import Switch from "@mui/material/Switch";
import "../../styles/TableItem.css";
import { Select } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";import { ConfigProperty } from "../../virtualmodel/ConfigProperties";
import { ColumnDisplayTypes } from "../../virtualmodel/Config";
import { SelectChangeEvent } from "@mui/material";
import { Column, Table } from "../../virtualmodel/VMD";
import { saveConfigToDB } from "../../helper/SettingsHelpers";
import { AuthState } from '../../redux/AuthSlice';
import { RootState } from '../../redux/Store';
import { useSelector } from 'react-redux';
import  Audits  from "../../virtualmodel/Audits";

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
          attributes.map((attribute, index) => {
            return (
              <ColumnConfigRow
                column={attribute}
                table={table}
                key={attribute.column_name + index}
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
  const {user: loggedInUser }: AuthState = useSelector((state: RootState) => state.auth);
  async function handleVisibilityToggle(event: React.ChangeEvent<HTMLInputElement>) {
    const newConfigValue = {
      property: ConfigProperty.VISIBLE,
      value: String(event.target.checked),
      column: column.column_name,
      table: table.table_name,
    }
    const success = await saveConfigToDB(newConfigValue);
    if (success) {
      column.setVisibility(event.target.checked);
    }
    else {
      event.preventDefault();
    };

    Audits.logAudits(
      loggedInUser || "",
      "Column Visibility",
      "User toggled the visibility of the column ",
      table.table_name,
      column.column_name,)

  }

  async function handleDisplayChange(event: SelectChangeEvent<string>) {
    const newConfigValue = {
      property: ConfigProperty.COLUMN_DISPLAY_TYPE,
      value: event.target.value,
      column: column.column_name,
      table: table.table_name,
    }
    const success = await saveConfigToDB(newConfigValue);
    if (success) {
      column.setType(event.target.value);
    }
    else {
      event.preventDefault();
    };

    Audits.logAudits(
      loggedInUser || "",
      "Column Display Type",
      "User changed the display type of the column " + event.target.value,
      table.table_name,
      column.column_name,)
  }
  return (
    <tr>
      <td className="semi-bold">{column.column_name}</td>
      <td>
        <Switch
          data-testid="visibility-switch"
          defaultChecked={column.is_visible}
          onChange={handleVisibilityToggle}
        />
      </td>
      <td>
        <FormControl size="small">
          <Select defaultValue={column.column_type} onChange={handleDisplayChange}>
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
