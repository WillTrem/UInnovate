import { Nav } from "react-bootstrap";
import NavDropdown from "react-bootstrap/NavDropdown";
import DisplayType from "./DisplayType";
import { updateSelectedSchema } from "../../redux/SchemaSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/Store";
import vmd from "../../virtualmodel/VMD";
import { useState } from "react";

interface SchemaSelectorProps {
  displayType?: DisplayType;
  onSelectCallback?: (...args: any[]) => void;
}


const SchemaSelector = ({
  displayType = DisplayType.NavDropdown,
  onSelectCallback
}: SchemaSelectorProps) => {
  const schemas = [
    ...new Set(vmd.getSchemas().map((schema) => schema.schema_name)),
  ];

  const selectedSchemaState: string = useSelector(
    (state: RootState) => state.schema.value
  );

  const [selectedSchema, setSelectedSchema] = useState(selectedSchemaState);

  const dispatch = useDispatch();

  const handleSelect = (
    eventKey: string | null,
    e: React.SyntheticEvent<unknown, Event>
  ) => {
    const val = eventKey || "no schema";
    e.preventDefault();
    setSelectedSchema(val);

    if(!onSelectCallback)
      dispatch(updateSelectedSchema(val));
    else
      onSelectCallback(val);
  };
  if (displayType === DisplayType.NavDropdown)
    return (
      <>
        <NavDropdown title={selectedSchema} id="collapsible-nav-dropdown">
          {schemas.map((item) => (
            <NavDropdown.Item
              href="#"
              key={item}
              onClick={() => {
                dispatch(updateSelectedSchema(item));
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
          {schemas.map((item) => (
            <Nav.Item title={item} key={item}>
              <Nav.Link eventKey={item}>{item}</Nav.Link>
            </Nav.Item>
          ))}
        </Nav>
      </>
    );

    if (displayType === DisplayType.StackedPills)
    return (
      <>
        <Nav
          variant="pills"
          onSelect={handleSelect}
          className="flex-column"
          activeKey={selectedSchema}
        >
          {schemas.map((item) => (
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
          {schemas.map((item: string) => (
            <Nav.Item title={item} key={item}>
              <Nav.Link eventKey={item}>{item}</Nav.Link>
            </Nav.Item>
          ))}
        </Nav>
      </>
    );
};

export default SchemaSelector;
