import Switch from "@mui/material/Switch";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Card from "react-bootstrap/Card";
import vmd, { Table, TableDisplayType } from "../../virtualmodel/VMD";
import "../../styles/TableItem.css";
import { ColumnConfig } from "./ColumnConfig";
import { useConfig } from "../../contexts/ConfigContext";
import { ConfigProperty } from "../../virtualmodel/ConfigProperties";
import { ConfigValueType } from "../../contexts/ConfigContext";

interface TableItemProps {
  table: Table;
}

export const TableItem: React.FC<TableItemProps> = ({ table }) => {
  const schema = vmd.getTableSchema(table.table_name);

  if (!schema) {
    throw new Error("Schema not found for table: " + table.table_name);
  }

  const displayType = table.getDisplayType();
  const { updateConfig } = useConfig();

  // Updates the local configuration with a table-specific configuration value
  const updateTableConfig = (property: ConfigProperty, value: string) => {
    const newConfigValue: ConfigValueType = {
      property,
      table: table.table_name,
      value,
    };
    updateConfig(newConfigValue);
  };

  // Handle the change event for the toggle switch
  const handleToggle = async () => {
    const isVisible = table.getVisibility();
    table.setVisibility(!isVisible);
    await updateTableConfig(ConfigProperty.VISIBLE, (!isVisible).toString());
  };

  const handleDisplayTypeSelect = async (event: SelectChangeEvent<string>) => {
    const newDisplayType = event.target.value;
    table.setDisplayType(newDisplayType);
    await updateTableConfig(ConfigProperty.TABLE_VIEW, newDisplayType);
  };

  return (
    <>
      {/* Table Specific Pane  */}
      <Card>
        <Card.Body>
          <Card.Title>Table specific configuration </Card.Title>
          <div className="config-pane">
            <div className="d-flex flex-row align-items-center">
              <span className="px-3">Visible</span>
              <Switch
                defaultChecked={table.getVisibility()}
                onChange={handleToggle}
                data-testid="visibility-switch"
              />
            </div>
            <FormControl size="small">
              <h6>Display Type</h6>
              <Select
                data-testid="display-type-table-config"
                value={displayType}
                onChange={handleDisplayTypeSelect}
                displayEmpty
              >
                {/* Temporary fix for the tests, but these should be accessed with
                TableDisplayType.listView */}
                <MenuItem value={"list"}>List View</MenuItem>
                <MenuItem value={"enum"}>Enum View</MenuItem>
              </Select>
              <FormHelperText>
                To customize the default layout of the table
              </FormHelperText>
            </FormControl>
          </div>
        </Card.Body>
      </Card>
      <br />
      {/* Column Specific configuration pane */}
      <Card>
        <Card.Body>
          <Card.Title>Column specific configuration</Card.Title>
          <div className="config-pane">
            <ColumnConfig table={table} />
          </div>
        </Card.Body>
      </Card>
    </>
  );
};
