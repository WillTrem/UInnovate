import { NavBar } from "../components/NavBar";
import { GeneralTab } from "../components/settingsPage/GeneralTab";
import { CronJobsTab } from "../components/settingsPage/CronJobsTab";
import DisplayTab from "../components/settingsPage/DisplayTab";
import { EnvVarCreator } from "../components/settingsPage/EnvVarCreator";
import Scripting from "../components/settingsPage/Scripting";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "../styles/settings.css";
import UserManagementTab from "../components/settingsPage/Users/UserManagementTab";
import InternationalizationTab from "../components/settingsPage/InternationalizationTab";
import UserLogs from "../components/settingsPage/UserLogs";
import AuditTrails from "../components/settingsPage/AuditTrails";
import UnauthorizedScreen from "../components/UnauthorizedScreen";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/Store";
import { LOGIN_BYPASS, Role } from "../redux/AuthSlice";
import { useNavigate, useParams } from "react-router-dom";
import AdditionalViewTab from "../components/settingsPage/additionalView/AdditionalViewTab";
import { Box } from "@mui/material";
import vmd from "../virtualmodel/VMD";
import { useEffect, useState } from "react";
import { updateSelectedSchema } from "../redux/SchemaSlice";
import SchemaSelector from "../components/Schema/SchemaSelector";
import DisplayType from "../components/Schema/DisplayType";
import { I18n } from "../helper/i18nHelpers";
// import { i18n } from "../helper/i18nHelpers";

export function Settings() {
  //labels
  const selectedLanguage: string = useSelector(
    (state: RootState) => state.languageSelection.lang,
  );
  const [settings_lbl, setSettings_lbl] = useState("");

  const [general_lbl, setGeneral_lbl] = useState("");
  const [display_lbl, setDisplay_lbl] = useState("");
  const [scripting_lbl, setScripting_lbl] = useState("");
  const [internationalization_lbl, setInternationalization_lbl] = useState("");
  const [additionalViews_lbl, setAdditionalViews_lbl] = useState("");
  const [userActionLoggingAndTracing_lbl, setUserActionLoggingAndTracing_lbl] =
    useState("");
  const [auditTrails_lbl, setAuditTrails_lbl] = useState("");

  // labels
  const translations = useSelector(
    (state: RootState) => state.languageSelection.translations,
  );
  const [i18n] = useState(new I18n(translations));

  useEffect(() => {
    i18n.setLanguage(selectedLanguage).then(() => updateLabels());
  }, [selectedLanguage]);

  const updateLabels = () => {
    setSettings_lbl(i18n.get("settings", "Settings"));
    setGeneral_lbl(i18n.get("general", "General"));
    setDisplay_lbl(i18n.get("display", "Display"));
    setScripting_lbl(i18n.get("scripting", "Scripting"));
    setInternationalization_lbl(
      i18n.get("internationalization", "Internationalization"),
    );
    setAdditionalViews_lbl(i18n.get("additionalViews", "Additional Views"));
    setUserActionLoggingAndTracing_lbl(
      i18n.get("userActionLoggingTracing", "User Action Logging and Tracing"),
    );
    setSettings_lbl(i18n.get("AuditTrails", "Audit Trails"));
    setSettings_lbl(i18n.get("Settings", "Settings"));
  };

  const dispatch = useDispatch();
  const { user, schema_access, dbRole, defaultRole, schemaRoles } = useSelector(
    (state: RootState) => state.auth,
  );
  const schemas = [
    ...new Set(
      vmd
        .getApplicationSchemas()
        .map((schema) => schema.schema_name)
        .filter((schema_name) => {
          // Ensures that on LOGIN_BYPASS without being logged in, all the schemas show
          if (
            (LOGIN_BYPASS && user === null) || // Include if LOGIN_BYPASS enabled with no user logged in
            (schema_access.includes(schema_name) && // Schema must be in schema_access list
              (dbRole === Role.ADMIN || // AND User must be an admin
                schemaRoles[schema_name] === Role.CONFIG || // OR User must have role configurator for schema in schema roles
                (!schemaRoles[schema_name] && defaultRole === Role.CONFIG))) // OR User doesn't have any role set for schema and its default role is configurator
          ) {
            return schema_name;
          }
        }),
    ),
  ];
  console.log(schemas);
  // Prevents error when schema_access has a length of 0
  const initialSelectedSchema = schemas.length === 0 ? "" : schemas[0];
  const [selectedSchema, setSelectedSchema] = useState(initialSelectedSchema);

  useEffect(() => {
    dispatch(updateSelectedSchema(selectedSchema));
  }, [selectedSchema]);

  const navigate = useNavigate();
  const { option } = useParams();

  const handleNavClick = (val: string) => {
    navigate(`/settings/${val.toLowerCase()}`);
  };

  return (
    <>
      <NavBar />
      {dbRole === Role.USER || (dbRole === null && !LOGIN_BYPASS) ? (
        <UnauthorizedScreen />
      ) : (
        <div className="page-container">
          <div className="save-config-container">
            <Box display="flex" gap={"2rem"} alignItems={"center"}>
              <h1 className="title">{settings_lbl}</h1>
              <SchemaSelector
                displayType={DisplayType.MuiDropDown}
                schemas={schemas}
                selectedSchema={selectedSchema}
                setSelectedSchema={setSelectedSchema}
              />
            </Box>
            {/* <ButtonConfigurationSaver /> */}
          </div>
          <Tab.Container activeKey={option} id="left-tabs-example">
            <Row>
              <Col sm={3}>
                <Nav variant="pills" className="flex-column">
                  <Nav.Item>
                    <Nav.Link
                      eventKey="general"
                      onClick={() => handleNavClick("general")}
                    >
                      {general_lbl}
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      eventKey="display"
                      onClick={() => handleNavClick("display")}
                    >
                      {display_lbl}
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      eventKey="scripting"
                      onClick={() => handleNavClick("scripting")}
                    >
                      {scripting_lbl}
                    </Nav.Link>
                  </Nav.Item>
                  {(dbRole === Role.ADMIN ||
                    (LOGIN_BYPASS && dbRole === null)) && (
                    <Nav.Item>
                      <Nav.Link
                        eventKey="users"
                        onClick={() => handleNavClick("users")}
                      >
                        Users
                        {/* {users_lbl} */}
                      </Nav.Link>
                    </Nav.Item>
                  )}
                  <Nav.Item>
                    <Nav.Link
                      eventKey="internationalization"
                      onClick={() => handleNavClick("internationalization")}
                    >
                      {internationalization_lbl}
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      eventKey="additionalviews"
                      onClick={() => handleNavClick("additionalviews")}
                    >
                      {additionalViews_lbl}
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      eventKey="userlogs"
                      onClick={() => handleNavClick("userlogs")}
                    >
                      {userActionLoggingAndTracing_lbl}
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      eventKey="audittrails"
                      onClick={() => handleNavClick("audittrails")}
                    >
                      {auditTrails_lbl}
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Col>
              <Col sm={9}>
                <Tab.Content>
                  <Tab.Pane eventKey="general">
                    <GeneralTab />
                  </Tab.Pane>
                  <Tab.Pane eventKey="display">
                    <DisplayTab />
                  </Tab.Pane>
                  <Tab.Pane eventKey="schedule">
                    <CronJobsTab />
                  </Tab.Pane>
                  <Tab.Pane eventKey="scripting">
                    <Scripting />
                  </Tab.Pane>
                  <Tab.Pane eventKey="envvar">
                    <EnvVarCreator />
                  </Tab.Pane>
                  {(dbRole === Role.ADMIN ||
                    (LOGIN_BYPASS && dbRole === null)) && (
                    <Tab.Pane eventKey="users">
                      <UserManagementTab />
                    </Tab.Pane>
                  )}
                  <Tab.Pane eventKey="internationalization">
                    <InternationalizationTab />
                  </Tab.Pane>
                  <Tab.Pane eventKey="additionalviews">
                    <AdditionalViewTab
                      schema={selectedSchema}
                      setSchema={(schema: string) => {
                        setSelectedSchema(schema);
                      }}
                    />
                  </Tab.Pane>
                  <Tab.Pane eventKey="userlogs">
                    <UserLogs />
                  </Tab.Pane>
                  <Tab.Pane eventKey="audittrails">
                    <AuditTrails />
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </div>
      )}
    </>
  );
}
