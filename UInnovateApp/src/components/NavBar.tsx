import { Link } from 'react-router-dom';
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { BsFillWrenchAdjustableCircleFill } from "react-icons/bs";
import SchemaSelector from "./Schema/SchemaSelector";
import DisplayType from "./Schema/DisplayType";
import { useState } from 'react';
import SignUpModal from './settingsPage/SignUpModal';

interface NavBarProps {
  showSchemaFilter?: boolean;
}
export function NavBar({ showSchemaFilter = true }: NavBarProps) {
  const [showSignupModal, setShowSignupModal] = useState(true);

  const handleClose = () => setShowSignupModal(false);
  const handleShow = () => setShowSignupModal(true);

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
            <Nav.Link onClick={handleShow} style={{ fontSize: "25px" }}>
              Sign Up
            </Nav.Link>
            <SignUpModal open={showSignupModal} onClose={handleClose}/>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
