import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { BsFillWrenchAdjustableCircleFill } from "react-icons/bs";
import SchemaSelector from "./Schema/SchemaSelector";
import attr from "../virtualmodel/Tables";
import DisplayType from "./Schema/DisplayType";

export function NavBar() {
  const schemas = [...new Set(attr.map((obj) => obj.schema))];
  return (
    <Navbar
      bg="dark"
      data-bs-theme="dark"
      expand="lg"
      className="bg-body-tertiary"
    >
      <Container>
        <Navbar.Brand
          href="/"
          style={{ fontSize: "30px", margin: "0px 10px 5px 0px" }}
        >
          <BsFillWrenchAdjustableCircleFill></BsFillWrenchAdjustableCircleFill>
        </Navbar.Brand>
        <Navbar.Brand href="/" style={{ fontSize: "30px" }}>
          UInnovate
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse className="justify-content-end">
          <Nav className="justify-content flex-grow-1 pe-3">
            <SchemaSelector
              schemaNameList={schemas}
              displayType={DisplayType.Nav} //DisplayType = NavDropdown | NavPills | Nav
            ></SchemaSelector>
          </Nav>
          <Nav className="justify-content-end flex-grow-1 pe-3">
            <Nav.Link href="/objview" style={{ fontSize: "25px" }}>
              ObjectMenu
            </Nav.Link>
            <Nav.Link href="/settings" style={{ fontSize: "25px" }}>
              Settings
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
