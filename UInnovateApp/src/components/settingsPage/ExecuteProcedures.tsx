import { Col, Row as Line, Tab, Nav } from "react-bootstrap";
import { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { RootState } from "../../redux/Store";
import { fetchFunctionNames, callProcedure, ProcedureSchedulingParams, fetchProcedureSource} from '../../virtualmodel/PlatformFunctions';
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";
import vmd from "../../virtualmodel/VMD";
import { DataAccessor, Row } from "../../virtualmodel/DataAccessor";
import { Modal, Form } from "react-bootstrap";
import { Button } from "@mui/material";
import { IoMdAddCircle } from "react-icons/io";
import { FunctionViewer } from "./FunctionViewer";

const buttonStyle = {
    marginRight: 10,
    backgroundColor: "#404040",
  };
  
export const ExecuteProcedures = () => {
    const [procedures, setProcedures] = useState<string[]>([]);
    const selectedSchema = useSelector((state: RootState) => state.schema.value);
    const { schema_access } = useSelector((state: RootState) => state.auth);
    const [selectedProc, setSelectedProc] = useState('');
    const [procedureSource, setProcedureSource] = useState('');
    const [numArgs, setNumArgs] = useState(0); //this could be cool but we dont need it right now, leaving it in for now.
    const schema = vmd.getSchema("meta");
    const function_table = vmd.getTable("meta", "function_map");
  
    const [functions, setFunctions] = useState<Row[] | undefined>([]);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [newFunction, setNewFunction] = useState<Row>({
      procedure: procedures[0],
    });  
    const getFunctions = async () => {
      if (!schema || !function_table) {
        return;
      }
  
      const data_accessor: DataAccessor = vmd.getRowsDataAccessor(
        schema?.schema_name,
        function_table?.table_name
      );
  
      const function_rows = await data_accessor?.fetchRows();
      setFunctions(function_rows);
    };
  
    useEffect(() => {
      getFunctions();
    }, []);
  
    const handleAddFunction = async () => {
      setShowModal(true);
    };
  
    const handleClose = () => {
      setShowModal(false);
    };
  
    const handleSave = async () => {
      const data_accessor = vmd.getAddRowDataAccessor(
        "meta",
        "function_map",
        { ...newFunction, schema: selectedSchema }
      );

      await data_accessor?.addRow();
      getFunctions();
      setShowModal(false);
    };
    const execProcedure = () => {
        const params: ProcedureSchedulingParams = {
            functionName: selectedProc,
            schema: selectedSchema
        };
        callProcedure(params)
            .then(() => {
                alert(selectedProc + ' executed successfully');
            })
            .catch(error => {
                console.error('Error executing procedure:', error);
                alert('Error executing procedure: ' + error.message);
            });
    };
    const updateProcedureNames = async () => {
        if (!selectedSchema || schema_access.length == 0) return
        try {
            // wait for resolve of fetchFunctionNames promises
            const functionNames = await fetchFunctionNames(selectedSchema);
            const procedures = [...new Set(functionNames)];

            setProcedures(procedures); // update state with function names

            if (procedures.length > 0) {
                setSelectedProc(procedures[0]);
                handleProcSelection(procedures[0]);
            }
        } catch (error) {
            console.error('Error fetching function names:', error);
        }
    };
    const handleProcSelection = (procName: any) => {
        setSelectedProc(procName);
        fetchProcedureSource(selectedSchema, procName)
            .then(response => {
                setProcedureSource(response.source_code);
                setNumArgs(response.arg_count);
            })
            .catch(error => console.error('Error fetching procedure source:', error));
    };
    useEffect(() => {
        updateProcedureNames();
    }, [selectedSchema]);
    return (
<div>
      <Tab.Container>
        <Line>
          <Col sm={3}>
            <h4>Functions</h4>
            <Modal show={showModal} onHide={handleClose}>
              <Modal.Header>
                <Modal.Title>Add New Functions</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <Form.Group>
                    <Form.Label>Procedure</Form.Label>
                    <Form.Select
                      onChange={(e) =>
                        setNewFunction({
                          ...newFunction,
                          procedure: e.target.value,
                        })
                      }
                    >
                      {procedures.map((proc) => (
                        <option key={proc} value={proc}>
                          {proc}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={newFunction.name || ""}
                      onChange={(e) =>
                        setNewFunction({
                          ...newFunction,
                          name: e.target.value,
                        })
                      }
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      type="text"
                      value={newFunction.description || ""}
                      onChange={(e) =>
                        setNewFunction({
                          ...newFunction,
                          description: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
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
                  Add Function
                </Button>
              </Modal.Footer>
            </Modal>
            <Nav variant="pills" className="flex-column">
              {functions?.map((funct) => {
                const function_name = funct["name"];
                return (
                  <Nav.Item key={function_name}>
                    <Nav.Link eventKey={function_name}>{function_name}</Nav.Link>
                  </Nav.Item>
                );
              })}
            </Nav>

            <Button
              onClick={handleAddFunction}
              style={buttonStyle}
              variant="contained"
            >
              <IoMdAddCircle className="button-icon" />
            </Button>
          </Col>
          <Col sm={9}>
            <Tab.Content>
              {functions?.map((funct: Row) => {
                const function_name = funct["name"];
                return (
                  <Tab.Pane key={function_name} eventKey={function_name}>
                      <FunctionViewer func={funct} />
                  </Tab.Pane>
                );
              })}
            </Tab.Content>
          </Col>
        </Line>
      </Tab.Container>
    </div>
    )
};
