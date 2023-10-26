import { NavBar } from "../components/NavBar";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";
import Form from "react-bootstrap/Form";
import "../styles/settings.css";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export function Settings() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <NavBar />
      <div className="page-layout">
        <div className="title"> Settings</div>{" "}
        <Tab.Container id="left-tabs-example" defaultActiveKey="first">
          <Row>
            <Col sm={3}>
              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link eventKey="first">General</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="second">Future Tab</Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col sm={9}>
              <Tab.Content>
                <Tab.Pane eventKey="first">
                  <Card>
                    <ListGroup variant="flush">
                      <ListGroup.Item>
                        <div className="customization-title">
                          Default Layout
                        </div>
                        <p>
                          To customize the default layout of the application.
                        </p>
                        <div className="form-container">
                          <Form.Select aria-label="Default select example">
                            <option>Select the default layout</option>
                            <option value="1">Enum View</option>
                            <option value="2">List View</option>
                          </Form.Select>
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={handleShow}
                          >
                            Save
                          </button>

                          {/* <!-- Modal --> */}
                          <Modal show={show} onHide={handleClose}>
                            <Modal.Header closeButton>
                              <Modal.Title>Confirmation</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                              You have succesfully selected a default layout
                            </Modal.Body>
                            <Modal.Footer>
                              <Button variant="secondary" onClick={handleClose}>
                                Close
                              </Button>
                            </Modal.Footer>
                          </Modal>
                        </div>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <div className="customization-title">
                          Layout Personalization
                        </div>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <div className="customization-title">
                          Color Customization
                        </div>
                      </ListGroup.Item>
                    </ListGroup>
                  </Card>
                </Tab.Pane>
                <Tab.Pane eventKey="second">Future tab content</Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </div>
    </>
  );
}
