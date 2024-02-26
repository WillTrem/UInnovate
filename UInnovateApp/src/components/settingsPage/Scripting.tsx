import { Tab, Nav, Col, Row } from 'react-bootstrap';
import { CronJobsTab } from "./CronJobsTab";
import { ScriptingTab } from "./ScriptingTab";
import { EnvVarCreator } from "./EnvVarCreator";
import { ExecuteProcedures } from "./ExecuteProcedures";

const Scripting = () => {
    return (
        <Tab.Container defaultActiveKey="cronJobs">
        <Row>
            <Col sm={3}>
                <Nav variant="pills" className="flex-column">
                    <Nav.Item>
                        <Nav.Link eventKey="cronJobs">Cron Jobs</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="scripting">Scripts</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="envVariables">Environment Variables</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="exProcedures">Execute Procedures</Nav.Link>
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