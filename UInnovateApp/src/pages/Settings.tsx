import { NavBar } from "../components/NavBar";
import { GeneralTab } from "../components/settingsPage/GeneralTab";
import { CronJobsTab } from "../components/settingsPage/CronJobsTab";
import DisplayTab from "../components/settingsPage/DisplayTab";
import { ScriptingTab } from "../components/settingsPage/ScriptingTab";
import { EnvVarCreator } from "../components/settingsPage/EnvVarCreator";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "../styles/settings.css";
import UserManagementTab from "../components/settingsPage/UserMangementTab";
import ButtonConfigurationSaver from "../components/settingsPage/ButtonConfigurationSaver";
import InternationalizationTab from "../components/settingsPage/InternationalizationTab";
import UnauthorizedScreen from "../components/UnauthorizedScreen";
import { useSelector } from "react-redux";
import { RootState } from "../redux/Store";
import { LOGIN_BYPASS, Role } from "../redux/AuthSlice";
import { useNavigate, useParams } from "react-router-dom";

export function Settings() {
	const role = useSelector((state: RootState) => state.auth.role);
	const navigate = useNavigate();
	const {option} = useParams();


	const handleNavClick = (
		val: string	) => {
		
		navigate(`/settings/${val.toLowerCase()}`);
	};


	return (
		<>
			<NavBar />
			{role === Role.USER || (role === null && !LOGIN_BYPASS) ? (
				<UnauthorizedScreen />
			) : (
				<div className='page-container'>
					<div className='save-config-container'>
						<h1 className='title'>Settings</h1>
						<ButtonConfigurationSaver />
					</div>
					<Tab.Container activeKey={option} id='left-tabs-example' >
						<Row>
							<Col sm={3}>
								<Nav variant='pills' className='flex-column' >
									<Nav.Item>
										<Nav.Link eventKey='general'  onClick={() => handleNavClick('general')} >General</Nav.Link>
									</Nav.Item>
									<Nav.Item>
										<Nav.Link eventKey='display' onClick={() => handleNavClick('display')}>Display</Nav.Link>
									</Nav.Item>
									<Nav.Item>
										<Nav.Link eventKey='schedule'onClick={() => handleNavClick('schedule')}>
											Scheduled Activities
										</Nav.Link>
										<Nav.Link eventKey='scripting'onClick={() => handleNavClick('scripting')}>Scripting</Nav.Link>
										<Nav.Link eventKey='envVar' onClick={() => handleNavClick('envVar')}>Environment Variables</Nav.Link>
									</Nav.Item>
									{(role === Role.ADMIN || LOGIN_BYPASS) && (
										<Nav.Item>
											<Nav.Link eventKey='users' onClick={() => handleNavClick('users')} >Users</Nav.Link>
										</Nav.Item>
									)}
									<Nav.Item>
										<Nav.Link eventKey='internationalization' onClick={() => handleNavClick('internationalization')} >
											Internationalization
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
										<ScriptingTab />
									</Tab.Pane>
									<Tab.Pane eventKey='envVar'>
										<EnvVarCreator />
									</Tab.Pane>
									{(role === Role.ADMIN || role === null) && (
										<Tab.Pane eventKey='users'>
											<UserManagementTab />
										</Tab.Pane>
									)}
									<Tab.Pane eventKey='internationalization'>
										<InternationalizationTab />
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
