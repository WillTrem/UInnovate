import { Nav } from "react-bootstrap";
import NavDropdown from "react-bootstrap/NavDropdown";
import DisplayType from "./DisplayType";
import { updateSelectedSchema } from "../../redux/SchemaSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/Store";
import vmd from "../../virtualmodel/VMD";
import { LOGIN_BYPASS } from "../../redux/AuthSlice";

interface SchemaSelectorProps {
  displayType?: DisplayType;
}

const SchemaSelector: React.FC<SchemaSelectorProps> = ({
  displayType = DisplayType.NavDropdown,
}: SchemaSelectorProps) => {
  const schema_access = useSelector((state: RootState) => state.auth.schema_access);
  const schemas = [
    ...new Set(vmd.getApplicationSchemas()
      .map((schema) => schema.schema_name)
      .filter((schema_name) => {
        // Ensures that on LOGIN_BYPASS without being logged in, all the schemas show
        if ((LOGIN_BYPASS && !schema_access) || schema_access  && (schema_access as string[]).includes(schema_name)) {
          return schema_name;
        }
      })),
  ];

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
