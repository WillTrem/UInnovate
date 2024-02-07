import { Container, Nav } from "react-bootstrap";
import NavDropdown from "react-bootstrap/NavDropdown";
import DisplayType from "./DisplayType";
import { updateSelectedSchema } from "../../redux/SchemaSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/Store";
import vmd from "../../virtualmodel/VMD";
import { useNavigate } from "react-router-dom";
interface SchemaSelectorProps {
  displayType?: DisplayType;
}

const SchemaSelector = ({
  displayType = DisplayType.NavDropdown,
}: SchemaSelectorProps) => {
  const schemas = [
    ...new Set(vmd.getSchemas().map((schema) => schema.schema_name)),
  ];

  const navigate = useNavigate();

  const selectedSchema: string = useSelector(
    (state: RootState) => state.schema.value
  );
  const dispatch = useDispatch();

  const handleSelect = (
    eventKey: string | null,
    e: React.SyntheticEvent<unknown, Event>
  ) => {
    const val = eventKey || "no schema";
    e.preventDefault();
    navigate(`/${val}`);

    dispatch(updateSelectedSchema(val));
    
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
      <Container>
        <Nav
          variant="pills"
          onSelect={handleSelect}
          className="justify-content-left"
          activeKey={selectedSchema}
        >
          {schemas.map((item) => (
            <Nav.Item title={item} key={item}>
              <Nav.Link eventKey={item} >{item}</Nav.Link>
            </Nav.Item>
          ))}
        </Nav>
      </Container>
    );

  if (displayType === DisplayType.Nav)
    return (
      <Container>

        <Nav
          onSelect={handleSelect}
          className="justify-content-left"
          activeKey={selectedSchema}
        >
          {schemas.map((item: string) => (
            <Nav.Item title={item} key={item}>
              <Nav.Link eventKey={item}>
                {item}
                </Nav.Link>
            </Nav.Item>
          ))}
        </Nav>
        </Container>
    );
};

export default SchemaSelector;
