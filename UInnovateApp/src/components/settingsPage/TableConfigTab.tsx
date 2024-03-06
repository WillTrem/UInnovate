import Switch from "@mui/material/Switch";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Card from "react-bootstrap/Card";
import vmd, { ConfigData, Table, TableDisplayType } from "../../virtualmodel/VMD";
import "../../styles/TableItem.css";
import { ColumnConfig } from "./ColumnConfig";
import { ConfigProperty } from "../../virtualmodel/ConfigProperties";
import LookUpTable from "./LookupSetting";
import { saveConfigToDB } from "../../helper/SettingsHelpers";

interface TableItemProps {
  table: Table;
}

export const TableItem: React.FC<TableItemProps> = ({ table }) => {
  const schema = vmd.getTableSchema(table.table_name);

  if (!schema) {
    throw new Error("Schema not found for table: " + table.table_name);
  }

  const displayType = table.getDisplayType();

  // Updates the local configuration with a table-specific configuration value
  const updateTableConfig = async (property: ConfigProperty, value: string) => {
    const newConfigValue: ConfigData = {
      property,
      table: table.table_name,
      value,
    };
    const success = await saveConfigToDB(newConfigValue);
    return success;
  };

  // Handle the change event for the toggle switch
  const handleToggle = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const isVisible = table.getVisibility();
    const success = await updateTableConfig(ConfigProperty.VISIBLE, (!isVisible).toString());
    if (success) {
      table.setVisibility(!isVisible);
    }
    else {
      event.preventDefault();
    }
  };

  const handleToggleDetails = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const isVisible = table.getHasDetailsView();
    const success = await updateTableConfig(ConfigProperty.DETAILS_VIEW, (!isVisible).toString());
    if (success) {
      table.setHasDetailsView(!isVisible);
    }
    else {
      event.preventDefault();
    }
  };

  const handleToggleStandAloneDetails = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const isVisible = table.getStandAloneDetailsView();
    const success = await updateTableConfig(ConfigProperty.STAND_ALONE_DETAILS_VIEW, (!isVisible).toString());
    if (success) {
      table.setStandAloneDetailsView(!isVisible);
    }
    else {
      event.preventDefault();
    }
  };


  const handleDisplayTypeSelect = async (event: SelectChangeEvent<string>) => {
    const newDisplayType = event.target.value;
    const success = await updateTableConfig(ConfigProperty.TABLE_VIEW, newDisplayType);
    if (success) {
      table.setDisplayType(newDisplayType);
    }
    else {
      event.preventDefault();
    }
  };


  return (
    <>
      {/* Table Specific Pane  */}
      <Card>
        <Card.Body>
          <Card.Title>Table specific configuration </Card.Title>
          <div className="overall-config-panel">

            <div className="config-pane">
              <div className="d-flex flex-row align-items-center">
                <span className="px-5" style={{ width: '200px' }}>Visible</span>
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
                  defaultValue={displayType}
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

            <div className="details-views">
              <span className="px-1" style={{ width: '180px' }}>Details View</span>
              <Switch
                defaultChecked={table.getHasDetailsView()}
                onChange={handleToggleDetails}
                data-testid="detail-visibility-switch"
              />

            </div>
            <div className="details-views">
              <span className="px-1" style={{ width: '180px' }}>Stand Alone Detail view</span>
              <Switch
                defaultChecked={table.getStandAloneDetailsView()}
                onChange={handleToggleStandAloneDetails}
                data-testid="Stand_Alone_detail-visibility-switch"
              />

            </div>
            <div className="details-view">
              <LookUpTable table={table} />
            </div>

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
