import { NavBar } from "../components/NavBar";
import { GeneralTab } from "../components/settingsPage/GeneralTab";
import DisplayTab from "../components/settingsPage/DisplayTab";
import { ScriptingTab } from "../components/settingsPage/ScriptingTab";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "../styles/settings.css";

export function Settings() {
  return (
    <>
      <NavBar />
      <div className="page-layout">
        <h1 className="title">Settings</h1>
        <Tab.Container id="left-tabs-example" defaultActiveKey="first">
          <Row>
            <Col sm={3}>
              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link eventKey="general">General</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="display">Display</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="scripting">Scripting</Nav.Link>
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
                <Tab.Pane eventKey="scripting">
                  <ScriptingTab />
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </div>
    </>
  );
}
