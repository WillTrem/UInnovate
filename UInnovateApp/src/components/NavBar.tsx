import { Link } from 'react-router-dom';
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { BsFillWrenchAdjustableCircleFill } from "react-icons/bs";

export function NavBar() {
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
          <Nav className="justify-content-end flex-grow-1 pe-3">
            <Nav.Link as={Link} to="/objview" style={{ fontSize: "25px" }}>
              ObjectMenu
            </Nav.Link>
            <Nav.Link as={Link} to="/settings" style={{ fontSize: "25px" }}>
              Settings
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>

    </Navbar>
  );


}
