import {Typography} from "@mui/material"
import { ListGroup, Row, Col } from "react-bootstrap";
import SchemaSelector from '../Schema/SchemaSelector';
import Tab from "react-bootstrap/Tab";
import DisplayType from '../Schema/DisplayType';
import { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { RootState } from "../../redux/Store";
import { fetchFunctionNames } from '../../virtualmodel/PlatformFunctions';

export const ExecuteProcedures = () => {
    const [procedures, setProcedures] = useState<string[]>([]);
    const selectedSchema = useSelector((state: RootState) => state.schema.value);
    const { schema_access } = useSelector((state: RootState) => state.auth);
    const [selectedProc, setSelectedProc] = useState('');


    const updateProcedureNames = async () => {
        if (!selectedSchema || schema_access.length == 0) return
        try {
            // wait for resolve of fetchFunctionNames promises
            const functionNames = await fetchFunctionNames(selectedSchema);
            const procedures = [...new Set(functionNames)];

            setProcedures(procedures); // update state with function names

            if (procedures.length > 0) {
                setSelectedProc(procedures[0]);
            }
        } catch (error) {
            console.error('Error fetching function names:', error);
        }
    };
    const handleProcSelection = (procName: any) => {
        setSelectedProc(procName);
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
                        <Col sm={3}>
                        <SchemaSelector displayType={DisplayType.NavDropdown}/>
                            {/* list of stored procedures */}
                            <ListGroup>
                                {procedures.map(proc => (
                                    <ListGroup.Item
                                        key={proc}
                                        action
                                        active={proc === selectedProc}
                                        onClick={() => handleProcSelection(proc)}
                                        style={{ fontSize: '1.25rem' }}
                                    >
                                        {proc}
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Col>
                        <Col sm={8}>
                            <ListGroup variant='flush'>
                            
                            </ListGroup>
                        </Col>
                    </Row>
            </Tab.Content>
        </Tab.Container>
        :
        <Typography variant="body1">You don't have access to any tables.</Typography>}
    </div>
    )
};
