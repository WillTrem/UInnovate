import Switch from "@mui/material/Switch";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Card from "react-bootstrap/Card";
import vmd, {
  ConfigData,
  Table,
  TableDisplayType,
} from "../../virtualmodel/VMD";
import "../../styles/TableItem.css";
import { ColumnConfig } from "./ColumnConfig";
import { ConfigProperty } from "../../virtualmodel/ConfigProperties";
import LookUpTableSetting from "./LookupSetting";
import { saveConfigToDB } from "../../helper/SettingsHelpers";
import { AuthState } from "../../redux/AuthSlice";
import { RootState } from "../../redux/Store";
import { useSelector } from "react-redux";
import Audits from "../../virtualmodel/Audits";
import { I18n, i18n } from "../../helper/i18nHelpers";
import { useEffect, useState } from "react";

interface TableItemProps {
  table: Table;
}

export const TableItem: React.FC<TableItemProps> = ({ table }) => {
  const schema = vmd.getTableSchema(table.table_name);

  if (!schema) {
    throw new Error("Schema not found for table: " + table.table_name);
  }

  //labels
  const selectedLanguage: string = useSelector(
    (state: RootState) => state.languageSelection.lang,
  );
  const [tableSpecificConfiguration_lbl, setTableSpecificConfiguration_lbl] =
    useState("");
  const [displayType_lbl, setDisplayType_lbl] = useState("");
  const [listView_lbl, setListView_lbl] = useState("");
  const [enumView_lbl, setEnumView_lbl] = useState("");
  const [detailsView_lbl, setDetailsView_lbl] = useState("");
  const [standAloneDetail_lbl, setStandAloneDetail_lbl] = useState("");
  const [columnSpecificConfiguration_lbl, setColumnSpecificConfiguration_lbl] =
    useState("");
  //display.columnSpecificConfiguration
  const translations = useSelector(
    (state: RootState) => state.languageSelection.translations,
  );
  const [i18n] = useState(new I18n(translations));

  useEffect(() => {
    i18n.setLanguage(selectedLanguage).then(() => updateLabels());
  }, [selectedLanguage]);

  const updateLabels = () => {
    setTableSpecificConfiguration_lbl(
      i18n.get("display.tableSpecificConfig", "Table specific configuration"),
    );
    setDisplayType_lbl(i18n.get("display.displayType", "Display Type"));
    setListView_lbl(i18n.get("display.displayType.listView", "List View"));
    setEnumView_lbl(
      i18n.get("display.tableSpecificConfig.enumView", "Enum View"),
    );
    setDetailsView_lbl(i18n.get("display.detailsView", "Details View"));
    setStandAloneDetail_lbl(
      i18n.get("display.standAloneDetail", "Stand Alone Detail View"),
    );
    setColumnSpecificConfiguration_lbl(
      i18n.get(
        "display.columnSpecificConfiguration",
        "Column specific configuration",
      ),
    );
  };

  const displayType = table.getDisplayType();
  const { user: loggedInUser }: AuthState = useSelector(
    (state: RootState) => state.auth,
  );
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
    const success = await updateTableConfig(
      ConfigProperty.VISIBLE,
      (!isVisible).toString(),
    );
    if (success) {
      table.setVisibility(!isVisible);
    } else {
      event.preventDefault();
    }

    Audits.logAudits(
      loggedInUser || "",
      "Table Visibility",
      "User toggled the visibility of the table ",
      schema.schema_name,
      table.table_name,
    );
  };

  const handleToggleDetails = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const isVisible = table.getHasDetailsView();
    const success = await updateTableConfig(
      ConfigProperty.DETAILS_VIEW,
      (!isVisible).toString(),
    );
    if (success) {
      table.setHasDetailsView(!isVisible);
    } else {
      event.preventDefault();
    }

    Audits.logAudits(
      loggedInUser || "",
      "Details View",
      "User toggled the Details View of the table ",
      schema.schema_name,
      table.table_name,
    );
  };

  const handleToggleStandAloneDetails = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const isVisible = table.getStandAloneDetailsView();
    const success = await updateTableConfig(
      ConfigProperty.STAND_ALONE_DETAILS_VIEW,
      (!isVisible).toString(),
    );
    if (success) {
      table.setStandAloneDetailsView(!isVisible);
    } else {
      event.preventDefault();
    }

    Audits.logAudits(
      loggedInUser || "",
      "Stand Alone Details View",
      "User toggled the Stand Alone Details View of the table ",
      schema.schema_name,
      table.table_name,
    );
  };

  const handleDisplayTypeSelect = async (event: SelectChangeEvent<string>) => {
    const newDisplayType = event.target.value;
    const success = await updateTableConfig(
      ConfigProperty.TABLE_VIEW,
      newDisplayType,
    );
    if (success) {
      table.setDisplayType(newDisplayType);
    } else {
      event.preventDefault();
    }

    Audits.logAudits(
      loggedInUser || "",
      "Display Type",
      "User changed the display type of the table to " + newDisplayType,
      schema.schema_name,
      table.table_name,
    );
  };

  return (
    <>
      {/* Table Specific Pane  */}
      <Card>
        <Card.Body>
          <Card.Title>{tableSpecificConfiguration_lbl} </Card.Title>
          <div className="overall-config-panel">
            <div className="config-pane">
              <div className="d-flex flex-row align-items-center">
                <span className="px-5" style={{ width: "200px" }}>
                  Visible
                </span>
                <Switch
                  defaultChecked={table.getVisibility()}
                  onChange={handleToggle}
                  data-testid="visibility-switch"
                />
              </div>
              <FormControl size="small">
                <h6>{displayType_lbl}</h6>
                <Select
                  data-testid="display-type-table-config"
                  defaultValue={displayType}
                  onChange={handleDisplayTypeSelect}
                  displayEmpty
                >
                  {/* Temporary fix for the tests, but these should be accessed with
                TableDisplayType.listView */}
                  <MenuItem value={"list"}>{listView_lbl}</MenuItem>
                  <MenuItem value={"enum"}>{enumView_lbl}</MenuItem>
                </Select>
                <FormHelperText>
                  To customize the default layout of the table
                </FormHelperText>
              </FormControl>
            </div>

            <div className="details-views">
              <span className="px-1" style={{ width: "180px" }}>
                {detailsView_lbl}
              </span>
              <Switch
                defaultChecked={table.getHasDetailsView()}
                onChange={handleToggleDetails}
                data-testid="detail-visibility-switch"
              />
            </div>
            <div className="details-views">
              <span className="px-1" style={{ width: "180px" }}>
                {standAloneDetail_lbl}
              </span>
              <Switch
                defaultChecked={table.getStandAloneDetailsView()}
                onChange={handleToggleStandAloneDetails}
                data-testid="Stand_Alone_detail-visibility-switch"
              />
            </div>
            <div className="details-view">
              <LookUpTableSetting table={table} />
            </div>
          </div>
        </Card.Body>
      </Card>
      <br />
      {/* Column Specific configuration pane */}
      <Card>
        <Card.Body>
          <Card.Title>{columnSpecificConfiguration_lbl}</Card.Title>
          <div className="config-pane">
            <ColumnConfig table={table} />
          </div>
        </Card.Body>
      </Card>
    </>
  );
};
