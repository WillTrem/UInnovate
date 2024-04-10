import { Tab, Nav, Col, Row } from "react-bootstrap";
import { CronJobsTab } from "./CronJobsTab";
import { ScriptingTab } from "./ScriptingTab";
import { EnvVarCreator } from "./EnvVarCreator";
import { ExecuteProcedures } from "./ExecuteProcedures";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/Store";
import { I18n } from "../../helper/i18nHelpers";
import { useEffect, useState } from "react";

const Scripting = () => {
  const selectedLanguage: string = useSelector(
    (state: RootState) => state.languageSelection.lang,
  );
  const translations = useSelector(
    (state: RootState) => state.languageSelection.translations,
  );
  const [i18n] = useState(new I18n(translations, selectedLanguage));

  const [cronJobs_lbl, setCronJobs_lbl] = useState("");
  const [envVariable_lbl, setEnvVariable_lbl] = useState("");
  //const [cronJobs_lbl, setCronJobs_lbl] = useState("");
  const [executeProcedures_lbl, setExecuteProcedures_lbl] = useState("");

  const updateLabels = () => {
    setCronJobs_lbl(i18n.get("scripting.cronJobs", "Cron Jobs"));
    setEnvVariable_lbl(
      i18n.get("scripting.EnvVariable", "Environment Variables"),
    );

    setExecuteProcedures_lbl(
      i18n.get("ExecuteProcedures", "Execute Procedures"),
    );
  };

  useEffect(() => {
    i18n.setLanguage(selectedLanguage).then(() => updateLabels());
  }, [selectedLanguage]);

  return (
    <Tab.Container defaultActiveKey="cronJobs">
      <Row>
        <Col sm={3}>
          <Nav variant="pills" className="flex-column">
            <Nav.Item>
              <Nav.Link eventKey="cronJobs">{cronJobs_lbl}</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="scripting">Scripts</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="envVariables">{envVariable_lbl}</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="exProcedures">
                {executeProcedures_lbl}
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
        <Col sm={9}>
          <Tab.Content>
            <Tab.Pane eventKey="cronJobs">
              <CronJobsTab />
            </Tab.Pane>
            <Tab.Pane eventKey="scripting">
              <ScriptingTab />
            </Tab.Pane>
            <Tab.Pane eventKey="envVariables">
              <EnvVarCreator />
            </Tab.Pane>
            <Tab.Pane eventKey="exProcedures">
              <ExecuteProcedures />
            </Tab.Pane>
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>
  );
};

export default Scripting;
