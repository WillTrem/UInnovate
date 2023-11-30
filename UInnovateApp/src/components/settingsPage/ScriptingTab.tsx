import { Col, Row as Line, Tab, Nav } from "react-bootstrap";
import { useEffect, useState } from "react";
import { DataAccessor, Row } from "../../virtualmodel/DataAccessor";
import vmd from "../../virtualmodel/VMD";
import { ScriptEditor } from "./ScriptEditor";
import { Modal, Form } from "react-bootstrap";
import { Button } from "@mui/material";
import { IoMdAddCircle } from "react-icons/io";

const buttonStyle = {
  marginRight: 10,
  backgroundColor: "#404040",
};

export const ScriptingTab = () => {
  const schema = vmd.getSchema("meta");
  const script_table = vmd.getTable("meta", "scripts");
  const columns = script_table?.getColumns();

  const [scripts, setScripts] = useState<Row[] | undefined>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newScript, setNewScript] = useState<Row>({});

  const getScripts = async () => {
    if (!schema || !script_table) {
      return;
    }

    const data_accessor: DataAccessor = vmd.getRowsDataAccessor(
      schema?.schema_name,
      script_table?.table_name
    );

    const scripts_rows = await data_accessor?.fetchRows();
    setScripts(scripts_rows);
  };

  useEffect(() => {
    getScripts();
  });

  const handleAddScript = async () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleSave = async () => {
    const data_accessor = vmd.getAddRowDataAccessor(
      "meta",
      "scripts",
      newScript
    );

    await data_accessor?.addRow();
    getScripts();
    setShowModal(false);
  };
  return (
    <div>
      <Tab.Container>
        <Line>
          <Col sm={3}>
            <h4>Scripts</h4>
            <Modal show={showModal} onHide={handleClose}>
              <Modal.Header>
                <Modal.Title>Add New Script</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  {columns?.map((column) => {
                    if (
                      column.column_name === "id" ||
                      column.column_name === "created_at" ||
                      column.column_name === "table_name" ||
                      column.column_name === "btn_name"
                    )
                      return null;
                    return (
                      <Form.Group key={column.column_name}>
                        <Form.Label>{column.column_name}</Form.Label>
                        <Form.Control
                          type="text"
                          value={newScript[column.column_name] || ""}
                          onChange={(e) =>
                            setNewScript({
                              ...newScript,
                              [column.column_name]: e.target.value,
                            })
                          }
                        ></Form.Control>
                      </Form.Group>
                    );
                  })}
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  onClick={handleClose}
                  style={buttonStyle}
                  variant="contained"
                >
                  Close
                </Button>
                <Button
                  onClick={handleSave}
                  style={buttonStyle}
                  variant="contained"
                >
                  Add Script
                </Button>
              </Modal.Footer>
            </Modal>
            <Nav variant="pills" className="flex-column">
              {scripts?.map((script) => {
                const script_name = script["name"];
                return (
                  <Nav.Item key={script_name}>
                    <Nav.Link eventKey={script_name}>{script_name}</Nav.Link>
                  </Nav.Item>
                );
              })}
            </Nav>

            <Button
              onClick={handleAddScript}
              style={buttonStyle}
              variant="contained"
            >
              <IoMdAddCircle className="button-icon" />
            </Button>
          </Col>
          <Col sm={9}>
            <Tab.Content>
              {scripts?.map((script: Row) => {
                const script_name = script["name"];
                return (
                  <Tab.Pane key={script_name} eventKey={script_name}>
                    <ScriptEditor script={script} />
                  </Tab.Pane>
                );
              })}
            </Tab.Content>
          </Col>
        </Line>
      </Tab.Container>
    </div>
  );
};
