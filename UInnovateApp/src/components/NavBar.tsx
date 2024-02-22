import { Link, useNavigate } from 'react-router-dom';
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { BsFillWrenchAdjustableCircleFill } from "react-icons/bs";
import SchemaSelector from "./Schema/SchemaSelector";
import DisplayType from "./Schema/DisplayType";
import { useState } from 'react';
import SignupModal from './settingsPage/SignupModal';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/Store';
import { AuthState, LOGIN_BYPASS, Role, logOut } from '../redux/AuthSlice';
import {Tooltip, Zoom} from '@mui/material'

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import { setLoading } from '../redux/LoadingSlice';
import vmd from '../virtualmodel/VMD';

interface NavBarProps {
  showSchemaFilter?: boolean;
}
export function NavBar({ showSchemaFilter = true }: NavBarProps) {
  const [showSignupModal, setShowSignupModal] = useState(false);
  const {user: loggedInUser, role }: AuthState = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleClose = () => setShowSignupModal(false);
  const handleShow = () => setShowSignupModal(true);
  const handleLogout = () => {
    dispatch(setLoading(true));
    dispatch(logOut());
    vmd.refetchSchemas().then(() => {
      dispatch(setLoading(false));
    })
    navigate('/');
  }


  return (
    <Navbar
      bg="dark"
      data-bs-theme="dark"
      expand="lg"
      className="bg-body-tertiary"
    >
      <Container>
        <Navbar.Brand as={Link} to="/" style={{ fontSize: "30px", margin: "0px 10px 5px 0px" }}>
          <BsFillWrenchAdjustableCircleFill></BsFillWrenchAdjustableCircleFill>
        </Navbar.Brand>
        <Navbar.Brand as={Link} to="/" style={{ fontSize: "30px" }}>
          UInnovate
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse className="justify-content-end">
          {( LOGIN_BYPASS || loggedInUser ) &&
          <Nav
            className={
              showSchemaFilter
                ? "justify-content flex-grow-1 pe-3"
                : "d-none"
            }
          >
            <SchemaSelector
              displayType={DisplayType.Nav} //DisplayType = NavDropdown | NavPills | Nav
            ></SchemaSelector>
          </Nav>}
          <Nav className="justify-content-end flex-grow-1 pe-3">
            {( LOGIN_BYPASS || loggedInUser ) &&
            <>
            {/* Hides the Settings page link for user role */}
            <Nav.Link as={Link} to="/settings" style={{ fontSize: "25px" }} hidden={role === Role.USER}>
              Settings
            </Nav.Link></>
            }
            {loggedInUser && 
            <Nav.Link>
              <Tooltip
              title={`Welcome, ${loggedInUser}`}
              arrow
              placement='bottom'
              TransitionComponent={Zoom}>
                <AccountCircleIcon sx={{ fontSize: 40 }}/>
              </Tooltip>
            </Nav.Link>
            }
            {loggedInUser ? 
            <Nav.Link onClick={handleLogout} style={{ fontSize: "25px", display: "flex", alignItems:"center" }}>
              {/* Log out */}
              <LogoutIcon fontSize='large'/>
            </Nav.Link>: 
            <Nav.Link onClick={handleShow} style={{ fontSize: "25px", display: "flex", alignItems:"center" }} >
              {/* Sign Up */}
              <LoginIcon fontSize='large'/>
            </Nav.Link>}
          </Nav>
        </Navbar.Collapse>
      </Container>
      <SignupModal open={showSignupModal} onClose={handleClose}/>
    </Navbar>
  );
}
