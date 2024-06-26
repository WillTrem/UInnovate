import { useEffect, useState } from 'react';
import {Button, Typography} from "@mui/material"
import { ListGroup, Form, Table, Row, Col } from "react-bootstrap";
import { DataAccessor } from "../../virtualmodel/DataAccessor";
import { scheduleProcedure, unscheduleProcedure, ProcedureSchedulingParams, fetchProcedureNamesWithNoArgs } from '../../virtualmodel/PlatformFunctions';
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';
import { useSelector } from "react-redux";
import { RootState } from "../../redux/Store";
import Tab from "react-bootstrap/Tab";
import vmd from "../../virtualmodel/VMD";
import { AuthState } from '../../redux/AuthSlice';
import  Audits  from "../../virtualmodel/Audits";
import InfoPopup from '../PrimaryKeyErrorPopup';
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
    const [refreshInterval, setRefreshInterval] = useState(60000); // Refresh every 60 seconds
    const [selectedProc, setSelectedProc] = useState('');
    const [cronSchedule, setCronSchedule] = useState('');
    const [procedures, setProcedures] = useState<string[]>([]); // list of stored procedures
    const [executionLogs, setExecutionLogs] = useState<ExecutionLogEntry[]>([]);
    const [queuedLogs, setQueuedLogs] = useState<QueuedJob[]>([]);
    const selectedSchema = useSelector((state: RootState) => state.schema.value);
    const { schema_access } = useSelector((state: RootState) => state.auth);
    const {user: loggedInUser }: AuthState = useSelector((state: RootState) => state.auth);
    const [isInfoPopupOpen, setIsInfoPopupOpen] = useState(false);
    const [infoPopupMessage, setInfoPopupMessage] = useState('');

    const updateProcedureNames = async () => {
        if (!selectedSchema || schema_access.length == 0) return
        try {
            // wait for resolve of fetchFunctionNames promises
            const functionNames = await fetchProcedureNamesWithNoArgs(selectedSchema);
            const procedures = [...new Set(functionNames)];

            setProcedures(procedures); // update state with function names
        } catch (error) {
            console.error('Error fetching function names:', error);
        }
    };
    const isValidCron = (cronSchedule) => {
        const parts = cronSchedule.split(' ');
        if (parts.length !== 5) {
            return false;
        }
    
        // Regex for validating each part of the cron expression
        // This is a simple validation and might not cover all edge cases
        const regex = /^(\*|(\d+(,\d+)*|\d+(\/|-)\d+)|(SUN|MON|TUE|WED|THU|FRI|SAT))+$/i;
    
        for (const part of parts) {
            if (!regex.test(part)) {
                return false;
            }
        }
    
        return true;
    };
    const scheduleCronJob = () => {
        const params: ProcedureSchedulingParams = {
            functionName: "schedule_job_by_name",
            stored_procedure: selectedProc,
            cron_schedule: cronSchedule,
            schema: selectedSchema
        };
        if (!cronSchedule || selectedProc == '' || selectedProc == 'Select a procedure') {
            setInfoPopupMessage('Please specify a cron schedule and procedure before attempting to schedule a job.');
            setIsInfoPopupOpen(true);
            return; 
        }
        if (!isValidCron(cronSchedule)) {
            setInfoPopupMessage('The specified cron schedule is invalid. Please enter a valid cron schedule.');
            setIsInfoPopupOpen(true);
            return; 
        }
        return new Promise((resolve, reject) => {
            scheduleProcedure(params)
                .then(response => {
                    
                    resolve(response);

                    Audits.logAudits(
                        loggedInUser || "",
                        "Cron Job",
                        "Cron job scheduled successfully",
                        "",
                        ""
                    )
                })
                .catch(error => {
                   
                    console.error("Error scheduling cron job", error);
                    reject(error);
                });
        });
    };    

    const unscheduleCronJob = () => {
        const params: ProcedureSchedulingParams = {
            functionName: "unschedule_job_by_name",
            stored_procedure: selectedProc,
            schema: selectedSchema
        };
        if (selectedProc == '' || selectedProc == 'Select a procedure') {
            setInfoPopupMessage('Please specify a procedure before attempting to unschedule a job.');
            setIsInfoPopupOpen(true);
            return; 
        }
        return new Promise((resolve, reject) => {
            unscheduleProcedure(params)
                .then(response => {
                    resolve(response);

                    Audits.logAudits(
                        loggedInUser || "",
                        "Cron Job",
                        "Cron job unscheduled successfully",
                        "",
                        ""
                    )
                })
                .catch(error => {
                    setInfoPopupMessage('Error unscheduling cron job. Make sure the job is scheduled before attempting to unschedule it.');
                    setIsInfoPopupOpen(true);
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
                        result: detail.status,
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
        updateProcedureNames();
    }, []);
    useEffect(() => {
        const intervalId = setInterval(() => {
            fetchExecutionLogsForProc(selectedProc);
        }, refreshInterval);

        return () => clearInterval(intervalId);
    }, [selectedProc, refreshInterval]);
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
        <div>
            {procedures.length !== 0 ? (
                <Tab.Container>
                    <Tab.Content>
                        <Row>
                            <Col sm={8}>
                                <ListGroup variant='flush'>
                                <ListGroup.Item>

                                <Form.Select aria-label="Default select example" onChange={e => handleProcSelection(e.target.value)}>
                                    <option>Select a procedure</option>
                                    {procedures.map(proc => (
                                        <option key={proc} value={proc}>
                                            {proc}
                                        </option>
                                    ))}
                                </Form.Select>
                                </ListGroup.Item>

                                    {/* Set cron schedule for the selected procedure */}
                                     {/* list of stored procedures */}
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
                                                   {/* InfoPopup for displaying scheduling errors */}
                                                <InfoPopup
                                                    open={isInfoPopupOpen}
                                                    message={infoPopupMessage}
                                                    onClose={() => setIsInfoPopupOpen(false)}
                                                />
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
                    </Tab.Content>
                </Tab.Container>
            ) : (
                <Typography variant="body1">You don't have access to any tables.</Typography>
            )}
        </div>
    );
    
};
