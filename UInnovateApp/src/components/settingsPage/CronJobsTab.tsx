import React, { useEffect, useState } from 'react';
import {Button, Typography} from "@mui/material"
import { Card, ListGroup, Form, Table, Row, Col } from "react-bootstrap";
import { DataAccessor } from "../../virtualmodel/DataAccessor";
import vmd from "../../virtualmodel/VMD";

interface ExecutionLogEntry {
    id: number; // or string, depending on your ID type
    datetime: string;
    duration: string;
    result: string; // Assuming 'log' is a string
    successful: string;
  }

const buttonStyle = {
    marginTop: 20,
    backgroundColor: "#404040",
    width: "fit-content",
  };
export const CronJobsTab = () => {
    const [selectedProc, setSelectedProc] = useState('');
    const [cronSchedule, setCronSchedule] = useState('');
    const [executionLogs, setExecutionLogs] = useState<ExecutionLogEntry[]>([]);
    const [queuedLogs, setQueuedLogs] = useState<ExecutionLogEntry[]>([]);

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

    const formatDuration = (ms: number | 'N/A') => {
        if (ms === 'N/A') return 'N/A';
    
        let seconds = Math.floor(ms / 1000);
        let minutes = Math.floor(seconds / 60);
        let hours = Math.floor(minutes / 60);
    
        seconds = seconds % 60;
        minutes = minutes % 60;
    
        // Padding the numbers with zero if less than 10 for a more consistent display
        const padTo2Digits = (num: number) => num.toString().padStart(2, '0');
    
        return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`;
    };
    
    const fetchExecutionLogsForProc = async (procName: string) => {
        const table = vmd.getTable("application", "task_queue");
        
        if (!table) {
            console.error("Table 'task_queue' not found.");
            return;
        }
        
        const dataAccessor: DataAccessor = vmd.getRowsDataAccessor(
            "application",
            "task_queue"
        );
        
        const logs = await dataAccessor.fetchRows(); // Assuming fetchRows returns the rows from the task_queue table

        // Transform the fetched rows into the format expected by the component's state
        const formattedLogs: ExecutionLogEntry[] = logs
        ?.filter((logRow) => logRow['name'] === selectedProc)
        .map((logRow) => {
            const startTime = new Date(logRow['start_time']);
            const endTime = logRow['end_time'] ? new Date(logRow['end_time']) : null;
            const duration = endTime ? endTime.getTime() - startTime.getTime() : 'N/A';
            return {
                id: logRow['id'], // Ensure this is a number if your ID type is a number
                datetime: startTime.toLocaleString(),
                duration:  formatDuration(duration),
                result: logRow['log'],
                successful: logRow['successful'] ? 'Yes' : 'No'
              };
            }) ?? [];

            const queuedTasks: ExecutionLogEntry[] = logs
            ?.filter((logRow) => logRow['name'] === procName && logRow['successful'] === null)
            .map((logRow) => {
              const startTime = logRow['start_time'] ? new Date(logRow['start_time']).toLocaleString() : 'N/A';
              const duration = 'N/A';
              return {
                  id: logRow['id'],
                  datetime: startTime,
                  duration: duration,
                  result: logRow['log'] || 'Pending', // Assuming log is empty for pending tasks
                  successful: 'Pending' // Since the task hasn't run yet
              };
          }) ?? [];

        setExecutionLogs(formattedLogs);
        setQueuedLogs(queuedTasks);
    };

    useEffect(() => {
        if (selectedProc) {
            fetchExecutionLogsForProc(selectedProc);
        }
    }, [selectedProc]);
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
                        {/* set cron schedule for the selected procedure */}
                        <ListGroup.Item>
                            <Form.Group controlId="cronSchedule">
                                <Form.Label>Cron Schedule for {selectedProc}</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder=""
                                    value={cronSchedule}
                                    onChange={e => setCronSchedule(e.target.value)}
                                />
                                <div>
                                    <Button variant="contained" style={buttonStyle} onClick={scheduleCronJob} >Set Schedule</Button>
                                    <Button variant="contained" style={buttonStyle} onClick={cancelCronJob} >Deactivate</Button>
                                </div>
                            </Form.Group>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <div>CRON Schedule for {selectedProc}</div>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Datetime</th>
                                        <th>Duration</th>
                                        <th>Result</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {queuedLogs.map(log => (
                                        <tr key={log.id}>
                                            <td>{log.datetime}</td>
                                            <td>{log.duration}</td>
                                            <td>{log.result}</td>
                                        </tr>
                                    ))} 
                                </tbody>
                            </Table>
                        </ListGroup.Item>



                        {/* Table for execution logs */}
                        
                        <ListGroup.Item>
                            <div>Execution Logs for {selectedProc}</div>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Datetime</th>
                                        <th>Duration</th>
                                        <th>Result</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {executionLogs.map(log => (
                                        <tr key={log.id}>
                                            <td>{log.datetime}</td>
                                            <td>{log.duration}</td>
                                            <td>{log.result}</td>
                                        </tr>
                                    ))} 
                                </tbody>
                            </Table>
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
            </Row>
        </Card>
    );
};
