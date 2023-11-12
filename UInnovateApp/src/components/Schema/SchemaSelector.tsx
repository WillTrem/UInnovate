import { useState } from "react";
import { Nav } from "react-bootstrap";
import NavDropdown from "react-bootstrap/NavDropdown";
import DisplayType from "./DisplayType";

interface SchemaSelectorProps {
  displayType?: DisplayType;
  schemaNameList: string[];
}

const SchemaSelector = ({
  displayType = DisplayType.NavDropdown,
  schemaNameList = ["no schema"],
}: SchemaSelectorProps) => {
  const [selectedSchema, setSelectedSchema] = useState(schemaNameList[0]);
  const handleSelect = (
    eventKey: string | null,
    e: React.SyntheticEvent<unknown, Event>
  ) => {
    console.log(e);
    const val = eventKey || schemaNameList[0];
    e.preventDefault();
    setSelectedSchema(val);
  };
  if (displayType === DisplayType.NavDropdown)
    return (
      <>
        <NavDropdown title={selectedSchema} id="collapsible-nav-dropdown">
          {schemaNameList.map((item) => (
            <NavDropdown.Item
              href="#"
              key={item}
              onClick={() => {
                setSelectedSchema(item);
              }}
            >
              {item}
            </NavDropdown.Item>
          ))}
        </NavDropdown>
      </>
    );

  if (displayType === DisplayType.NavPills)
    return (
      <>
        <Nav
          variant="pills"
          onSelect={handleSelect}
          className="justify-content-left"
          activeKey={selectedSchema}
        >
          {schemaNameList.map((item) => (
            <Nav.Item title={item} key={item}>
              <Nav.Link eventKey={item}>{item}</Nav.Link>
            </Nav.Item>
          ))}
        </Nav>
      </>
    );

  if (displayType === DisplayType.Nav)
    return (
      <>
        <Nav
          onSelect={handleSelect}
          className="justify-content-left"
          activeKey={selectedSchema}
        >
          {schemaNameList.map((item: string) => (
            <Nav.Item title={item} key={item}>
              <Nav.Link eventKey={item}>{item}</Nav.Link>
            </Nav.Item>
          ))}
        </Nav>
      </>
    );
};

export default SchemaSelector;
