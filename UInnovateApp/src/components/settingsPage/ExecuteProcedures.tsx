import {Typography} from "@mui/material"
import { ListGroup, Row, Col } from "react-bootstrap";
import SchemaSelector from '../Schema/SchemaSelector';
import Tab from "react-bootstrap/Tab";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import DisplayType from '../Schema/DisplayType';
import { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { RootState } from "../../redux/Store";
import { fetchFunctionNames, callProcedure, ProcedureSchedulingParams, fetchProcedureSource} from '../../virtualmodel/PlatformFunctions';
import AceEditor from "react-ace";
import { Card } from "react-bootstrap";
import {FormControl, FormHelperText, TextField  } from "@mui/material";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";
export const ExecuteProcedures = () => {
    const [procedures, setProcedures] = useState<string[]>([]);
    const selectedSchema = useSelector((state: RootState) => state.schema.value);
    const { schema_access } = useSelector((state: RootState) => state.auth);
    const [selectedProc, setSelectedProc] = useState('');
    const [procedureSource, setProcedureSource] = useState('');
    const [numArgs, setNumArgs] = useState(0); //this could be cool but we dont need it right now, leaving it in for now.
    const execProcedure = () => {
        const params: ProcedureSchedulingParams = {
            functionName: selectedProc,
            schema: selectedSchema
        };
        callProcedure(params);
    }
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
    }, []);
    return (
        <div>
        {procedures.length !== 0 ?
        <Tab.Container>
            <Tab.Content>
                <Row>                                
                    <Col sm={8}>
<Card>
    <Card.Body>
        <Card.Title className="mb-3">Procedure: {selectedProc}</Card.Title>
        <SchemaSelector displayType={DisplayType.NavDropdown}/>
        {/* dropdown list of stored procedures */}
        <Select
            value={selectedProc}
            onChange={(event) => handleProcSelection(event.target.value as string)}
            style={{ fontSize: '1.25rem', width: '100%', marginBottom: '20px' }}
        >
            {procedures.map(proc => (
                <MenuItem key={proc} value={proc}>
                    {proc}
                </MenuItem>
            ))}
        </Select>
        <div className="config-pane mt-3">
            <div className="d-flex flex-column align-items-start mb-3">
                <h6>Button Name</h6>
                <TextField defaultValue={""}></TextField>
            </div>
            <div className="d-flex flex-column align-items-start mb-3">
                <h6>Description</h6>
                <TextField multiline fullWidth defaultValue={""}></TextField>
            </div>
            <FormControl size="small" className="mb-3">
                <h6>View</h6>
                <FormHelperText>
                    The View that this will be applied to.
                </FormHelperText>
            </FormControl>
            <div className="d-flex flex-column align-items-start mb-3">
                <button onClick={execProcedure}>Test Execution</button>
            </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", marginTop: "20px" }}>
            <h6>Content</h6>
            <div style={{ display: "flex", flexDirection: "row", marginTop: "10px" }}>
                <AceEditor
                    mode="sql"
                    theme="github"
                    value={procedureSource}
                    onChange={(value) => {
                        handleProcSelection(value);
                    }}
                    name="script-editor"
                    readOnly={true}
                    editorProps={{ $blockScrolling: true }}
                    style={{ width: "100%" }}
                />
            </div>
        </div>
    </Card.Body>
</Card>
                    </Col>
                </Row>
            </Tab.Content>
        </Tab.Container>
        :
        <Typography variant="body1">You don't have access to any tables.</Typography>}
    </div>
    )
};
