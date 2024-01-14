import { useEffect, useState } from 'react';
import {Button, skeletonClasses} from "@mui/material"
import { Card, ListGroup, Form, Table, Row, Col } from "react-bootstrap";
import { DataAccessor } from "../../virtualmodel/DataAccessor";
import vmd from "../../virtualmodel/VMD";
import { scheduleProcedure, unscheduleProcedure, ProcedureSchedulingParams } from '../../virtualmodel/PlatformFunctions';
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';

interface ExecutionLogEntry {
    id: any; 
    datetime: string;
    duration: string;
    result: string;
    successful: string;
}
interface QueuedJob {
    id: any;
    name: string;
    schedule: string;
    active: string; 
}

const containerStyle = {
    display: 'flex',
    gap: '10px', 
  };
const buttonStyle = {
    marginTop: 20,
    backgroundColor: "#404040",
    width: "fit-content",
  };
export const CronJobsTab = () => {
    const [selectedProc, setSelectedProc] = useState('');
    const [cronSchedule, setCronSchedule] = useState('');
    const [executionLogs, setExecutionLogs] = useState<ExecutionLogEntry[]>([]);
    const [queuedLogs, setQueuedLogs] = useState<QueuedJob[]>([]);

    // Dummy data for procedures
    const procedures = [
        "Stored Proc 1",
        "Stored Proc 2",
        "process_updates"
    ];

    const scheduleCronJob = () => {
        const params: ProcedureSchedulingParams = {
            functionName: "schedule_job_by_name",
            stored_procedure: selectedProc,
            cron_schedule: cronSchedule,
        };
    
        return new Promise((resolve, reject) => {
            scheduleProcedure(params)
                .then(response => {
                    // Handle success here
                    console.log("Cron job scheduled successfully");
                    resolve(response);
                })
                .catch(error => {
                    // Handle error here
                    console.error("Error scheduling cron job", error);
                    reject(error);
                });
        });
    };    

    const unscheduleCronJob = () => {
        const params: ProcedureSchedulingParams = {
            functionName: "unschedule_job_by_name",
            stored_procedure: selectedProc
        };

        return new Promise((resolve, reject) => {
            unscheduleProcedure(params)
                .then(response => {
                    // Handle success here
                    console.log("Cron job unscheduled successfully");
                    resolve(response);
                })
                .catch(error => {
                    // Handle error here
                    console.error("Error unscheduling cron job", error);
                    reject(error);
                });
        });
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
        const details_table = vmd.getTable("cron", "job_run_details");
        const job_table =  vmd.getTable("cron", "job");

        if (!details_table || !job_table) {
            console.error("Table not found.");
            return;
        }
        
        const detailsDataAccessor: DataAccessor = vmd.getRowsDataAccessor(
            "cron",
            "job_run_details"
        );

        const jobDataAccessor: DataAccessor = vmd.getRowsDataAccessor(
            "cron",
            "job"
        );
        

        const jobLogs = await jobDataAccessor.fetchRows() ?? []; // get job rows
        const detailsLogs = await detailsDataAccessor.fetchRows() ?? []; // get job run details rows
        const executionLogEntries: ExecutionLogEntry[] = [];
    
        // iterate through each queued job
        jobLogs
        ?.forEach(job => {
            // find corresponding job run details
            const jobDetails = detailsLogs?.filter(detail => detail.jobid === job.jobid);
    
            jobDetails?.forEach(detail => {
                if (job.command.includes(procName)) {
                    executionLogEntries.push({
                        id: job.jobid, // Assuming the jobid is at the top level of the job object
                        datetime: detail.start_time ? new Date(detail.start_time).toLocaleString() : 'N/A',
                        duration: detail.end_time && detail.start_time
                            ? formatDuration(new Date(detail.end_time).getTime() - new Date(detail.start_time).getTime())
                            : 'N/A',
                        result: detail.return_message,
                        successful: detail.status
                    });
                }
            });
        });
        const newQueuedJobs: QueuedJob[] = jobLogs
        .filter(job => job.jobname.includes(selectedProc)) // select queued jobs dependent on selected proc
        .map(job => {
          // put in the QueuedJob format
          return {
            id: job.jobid,
            name: job.jobname,
            schedule: job.schedule,
            active: job.active === true ? 'Yes': 'No',
          };
        });
       

        setExecutionLogs(executionLogEntries);
        
        setQueuedLogs(newQueuedJobs);
    };
    useEffect(() => {
        if (procedures.length > 0 && selectedProc === '') {
            const initialProc = procedures[0];
            setSelectedProc(initialProc);
            fetchExecutionLogsForProc(initialProc);
        }
    }, []);
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
                        {/* set cron schedule for the selected procedure */}
                        <ListGroup.Item>
                        <Form.Group controlId="cronSchedule">
                            <Form.Label>
                                Cron Schedule for {selectedProc}
                            </Form.Label>
                            <div style={{ display: 'flex', alignItems: 'center', marginTop: '5px' }}>
                                <Form.Control
                                    type="text"
                                    placeholder="* * * * *"
                                    value={cronSchedule}
                                    onChange={e => setCronSchedule(e.target.value)}
                                    style={{ flexGrow: 1, marginRight: '5px' }} // Ensure the input field takes up available space
                                />
                                <Tooltip title="Use cron syntax: '* * * * *', Format: 'Minute Hour Day Month Weekday'. Each field can be a number or '*', which means every. Example: '0 5 * * *' runs daily at 5 AM. For detailed syntax, check https://crontab.guru/">
                                    <InfoIcon />
                                </Tooltip>
                            </div>
                            <div style={containerStyle}>
                                <Button variant="contained" style={buttonStyle} onClick={() => scheduleCronJob().then(() => fetchExecutionLogsForProc(selectedProc))}>Schedule Job</Button>                                    
                                <Button variant="contained" style={buttonStyle} onClick={() => unscheduleCronJob().then(() => fetchExecutionLogsForProc(selectedProc))}>Unschedule Job</Button>
                            </div>
                        </Form.Group>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <div>CRON Schedule for {selectedProc}</div>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Schedule</th>
                                        <th>Active</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {queuedLogs.map(log => (
                                        <tr key={log.id}>
                                            <td>{log.name}</td>
                                            <td>{log.schedule}</td>
                                            <td>{log.active}</td>
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
