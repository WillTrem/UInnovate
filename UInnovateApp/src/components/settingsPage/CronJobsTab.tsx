import React, { useState } from 'react';
import { Card, ListGroup, Form, Button, Table, Row, Col } from "react-bootstrap";

export const CronJobsTab = () => {
    const [selectedProc, setSelectedProc] = useState('');
    const [cronSchedule, setCronSchedule] = useState('');
    const [executionLogs, setExecutionLogs] = useState([]);

    // Dummy data for procedures
    const procedures = [
        "Stored Proc 1",
        "Stored Proc 2",
        "Stored Proc 3"
    ];
    // Assume this function makes an API call to schedule the cron job
    const scheduleCronJob = () => {
        // Implementation here...
    };

    const cancelCronJob = () => {
        // Implementation here...
    };

    // Assume this function fetches execution logs from the backend
    const fetchExecutionLogsForProc = (procName: any) => {
        // Implementation here...
    };

    // Update selected procedure and fetch logs
    const handleProcSelection = (procName: any) => {
        setSelectedProc(procName);
        fetchExecutionLogsForProc(procName);
    };

    return (
        <Card>
            <Row>
                <Col sm={4}>
                    {/* List of stored procedures */}
                    <ListGroup>
                        {procedures.map(proc => (
                            <ListGroup.Item
                                key={proc}
                                action
                                active={proc === selectedProc}
                                onClick={() => handleProcSelection(proc)}
                                style={{ fontSize: '1.25rem' }} // Bigger font for procedure list
                            >
                                {proc}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Col>
                <Col sm={8}>
                    <ListGroup variant='flush'>
                        {/* Form to set cron schedule for the selected procedure */}
                        <ListGroup.Item>
                            <Form.Group controlId="cronSchedule">
                                <Form.Label>Cron Schedule for {selectedProc}</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder=""
                                    value={cronSchedule}
                                    onChange={e => setCronSchedule(e.target.value)}
                                />
                                <Button onClick={scheduleCronJob} className='button-side-panel '>Set Schedule</Button>
                                <Button onClick={cancelCronJob} className='button-side-panel'>Deactivate</Button>
                            </Form.Group>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <div className='customization-title'>CRON Schedule for {selectedProc}</div>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Datetime</th>
                                        <th>Duration</th>
                                        <th>Result</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Render execution logs here */}
                                </tbody>
                            </Table>
                        </ListGroup.Item>



                        {/* Table to display execution logs */}
                        
                        <ListGroup.Item>
                            <div className='customization-title'>Execution Logs for {selectedProc}</div>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Datetime</th>
                                        <th>Duration</th>
                                        <th>Result</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Render execution logs here */}
                                </tbody>
                            </Table>
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
            </Row>
        </Card>
    );
};

{/*
{executionLogs.map(log => (
                                <tr key={log.id}>
                                    <td>{log.datetime}</td>
                                    <td>{log.duration}</td>
                                    <td>{log.result}</td>
                                </tr>
                            ))} */}