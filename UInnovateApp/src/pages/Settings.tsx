import { NavBar } from "../components/NavBar";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";
import Form from "react-bootstrap/Form";
import "../styles/settings.css";
import { Table } from "../virtualmodel/Tables";
import attr from "../virtualmodel/Tables";
import { ChangeEventHandler } from "react";
import { useState } from "react";

export function Settings() {
  const [tableData, setTableData] = useState(attr);
  // Change the view_status of a table
  const handleViewStatusChange: ChangeEventHandler<HTMLSelectElement> = (
    event
  ) => {
    const newStatus = event.target;
    const updatedData = attr.map((table) => {
      if (newStatus.id == table.table_name) {
        table.view_status = newStatus.value;
      }

      return table;
    });

    setTableData(updatedData);
  };

  return (
    <>
      <NavBar />
      <div className="page-layout">
        <h1 className="title"> Settings</h1>
        <Tab.Container id="left-tabs-example" defaultActiveKey="first">
          <Row>
            <Col sm={3}>
              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link eventKey="first">General</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="second">Display</Nav.Link>
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
                <Tab.Pane eventKey="second">
                  <div className="customization-title">Tables</div>
                  <div className="table-list">
                    {tableData.map((table: Table) => {
                      return (
                        <th id="table">
                          <div key={table.table_name} className="text-table">
                            {table.table_name}
                          </div>
                          <Form.Select
                            id={table.table_name}
                            className="form-select"
                            aria-label="View Status"
                            value={table.view_status}
                            onChange={handleViewStatusChange}
                          >
                            <option value="list">List View</option>
                            <option value="enum">Enumeration View</option>
                          </Form.Select>
                        </th>
                      );
                    })}
                  </div>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </div>
    </>
  );
}
