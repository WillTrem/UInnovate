import { NavBar } from "../components/NavBar";
import { GeneralTab } from "../components/settingsPage/GeneralTab";
import { CronJobsTab } from "../components/settingsPage/CronJobsTab";
import DisplayTab from "../components/settingsPage/DisplayTab";
import { EnvVarCreator } from "../components/settingsPage/EnvVarCreator";
import Scripting from "../components/settingsPage/Scripting";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "../styles/settings.css";
import UserManagementTab from "../components/settingsPage/Users/UserManagementTab";
import ButtonConfigurationSaver from "../components/settingsPage/ButtonConfigurationSaver";
import InternationalizationTab from "../components/settingsPage/InternationalizationTab";
import UserLogs from "../components/settingsPage/UserLogs";
import UnauthorizedScreen from "../components/UnauthorizedScreen";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/Store";
import { LOGIN_BYPASS, Role } from "../redux/AuthSlice";
import { useNavigate, useParams } from "react-router-dom";
import AdditionalViewTab from "../components/settingsPage/additionalView/AdditionalViewTab";
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import vmd from "../virtualmodel/VMD";
import { useEffect, useState } from "react";
import { updateSelectedSchema } from "../redux/SchemaSlice";
import SchemaSelector from "../components/Schema/SchemaSelector";
import DisplayType from "../components/Schema/DisplayType";

export function Settings() {
	const dispatch = useDispatch();
	const { user, schema_access, dbRole, defaultRole, schemaRoles } = useSelector((state: RootState) => state.auth);
	const schemas = [
		...new Set(vmd.getApplicationSchemas()
			.map((schema) => schema.schema_name)
			.filter((schema_name) => {
				// Ensures that on LOGIN_BYPASS without being logged in, all the schemas show
				if ((LOGIN_BYPASS && user === null) // Include if LOGIN_BYPASS enabled with no user logged in
					|| (schema_access.includes(schema_name)) // Schema must be in schema_access list
					&& (dbRole === Role.ADMIN // AND User must be an admin
						||(schemaRoles[schema_name] === Role.CONFIG // OR User must have role configurator for schema in schema roles
							|| (!schemaRoles[schema_name] && defaultRole === Role.CONFIG) // OR User doesn't have any role set for schema and its default role is configurator
						))) {
					return schema_name;
				}
			})),
	];
	console.log(schemas);
	// Prevents error when schema_access has a length of 0
	const initialSelectedSchema = schemas.length === 0 ? "" : schemas[0]
	const [selectedSchema, setSelectedSchema] = useState(initialSelectedSchema);

	useEffect(() => {
		dispatch(updateSelectedSchema(selectedSchema));
	}, [selectedSchema])

	const navigate = useNavigate();
	const { option } = useParams();


	const handleNavClick = (
		val: string) => {

		navigate(`/settings/${val.toLowerCase()}`);
	};


	return (
		<>
			<NavBar />
			{dbRole === Role.USER || (dbRole === null && !LOGIN_BYPASS) ? (
				<UnauthorizedScreen />
			) : (
				<div className='page-container'>
					<div className='save-config-container'>
						<Box display="flex" gap={"2rem"} alignItems={"center"}>
							<h1 className='title'>Settings</h1>
							<SchemaSelector
								displayType={DisplayType.MuiDropDown}
								schemas={schemas}
								selectedSchema={selectedSchema}
								setSelectedSchema={setSelectedSchema}
							/>
						</Box>
						{/* <ButtonConfigurationSaver /> */}
					</div>
					<Tab.Container activeKey={option} id='left-tabs-example' >
						<Row>
							<Col sm={3}>
								<Nav variant='pills' className='flex-column' >
									<Nav.Item>
										<Nav.Link eventKey='general' onClick={() => handleNavClick('general')} >General</Nav.Link>
									</Nav.Item>
									<Nav.Item>
										<Nav.Link eventKey='display' onClick={() => handleNavClick('display')}>Display</Nav.Link>
									</Nav.Item>
									<Nav.Item>
										<Nav.Link eventKey='scripting'onClick={() => handleNavClick('scripting')}>Scripting</Nav.Link>
									</Nav.Item>
									{(dbRole === Role.ADMIN || LOGIN_BYPASS && dbRole === null) && (
										<Nav.Item>
											<Nav.Link eventKey='users' onClick={() => handleNavClick('users')} >Users</Nav.Link>
										</Nav.Item>
									)}
									<Nav.Item>
										<Nav.Link eventKey='internationalization' onClick={() => handleNavClick('internationalization')} >
											Internationalization
										</Nav.Link>
									</Nav.Item>
									<Nav.Item>
										<Nav.Link eventKey='additionalviews' onClick={() => handleNavClick('additionalviews')}>
											Additional Views
										</Nav.Link>
									</Nav.Item>
									<Nav.Item>
										<Nav.Link eventKey='userlogs' onClick={() => handleNavClick('userlogs')}>
											User Action Logging and Tracing
										</Nav.Link>
									</Nav.Item>
								</Nav>
							</Col>
							<Col sm={9}>
								<Tab.Content>
									<Tab.Pane eventKey='general'>
										<GeneralTab />
									</Tab.Pane>
									<Tab.Pane eventKey='display'>
										<DisplayTab />
									</Tab.Pane>
									<Tab.Pane eventKey='schedule'>
										<CronJobsTab />
									</Tab.Pane>
									<Tab.Pane eventKey='scripting'>
										<Scripting />
									</Tab.Pane>
									<Tab.Pane eventKey='envvar'>
										<EnvVarCreator />
									</Tab.Pane>
									{(dbRole === Role.ADMIN || LOGIN_BYPASS && dbRole === null) && (
										<Tab.Pane eventKey='users'>
											<UserManagementTab />
										</Tab.Pane>
									)}
									<Tab.Pane eventKey='internationalization'>
										<InternationalizationTab />
									</Tab.Pane>
									<Tab.Pane eventKey='additionalviews'>
										<AdditionalViewTab schema={selectedSchema} setSchema={(schema:string)=>{setSelectedSchema(schema)}} />
									</Tab.Pane>
									<Tab.Pane eventKey='userlogs'>
										<UserLogs />
									</Tab.Pane>
								</Tab.Content>
							</Col>
						</Row>
					</Tab.Container>
				</div>
			)}
		</>
	);
}

