import { Link } from 'react-router-dom';
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
import { logOut } from '../redux/AuthSlice';
import {Tooltip, Zoom} from '@mui/material'

import AccountCircleIcon from '@mui/icons-material/AccountCircle';

interface NavBarProps {
  showSchemaFilter?: boolean;
}
export function NavBar({ showSchemaFilter = true }: NavBarProps) {
  const [showSignupModal, setShowSignupModal] = useState(true);
  const loggedInUser: string | null = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  const handleClose = () => setShowSignupModal(false);
  const handleShow = () => setShowSignupModal(true);
  const handleLogout = () => dispatch(logOut());


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
          </Nav>
          <Nav className="justify-content-end flex-grow-1 pe-3">
            <Nav.Link as={Link} to="/objview" style={{ fontSize: "25px" }}>
              ObjectMenu
            </Nav.Link>
            <Nav.Link as={Link} to="/settings" style={{ fontSize: "25px" }}>
              Settings
            </Nav.Link>
            
            {loggedInUser ? 
            <Nav.Link onClick={handleLogout} style={{ fontSize: "25px" }}>
              Log out
            </Nav.Link>: 
            <Nav.Link onClick={handleShow} style={{ fontSize: "25px" }}>
              Sign Up
            </Nav.Link>}
            {loggedInUser && 
            <Tooltip 
            title={`Welcome, ${loggedInUser}`}
            arrow
            placement='bottom'
            TransitionComponent={Zoom}>
              <AccountCircleIcon sx={{ fontSize: 50 }}/>
            </Tooltip>
            }
            <SignupModal open={showSignupModal} onClose={handleClose}/>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
