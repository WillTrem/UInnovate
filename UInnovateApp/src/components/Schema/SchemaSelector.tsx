import { Container, Nav } from "react-bootstrap";
import DisplayType from "./DisplayType";

import {  Box,FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";

interface SchemaSelectorProps {
  displayType?: DisplayType;
  schemas: string[];
  selectedSchema?: string;
  setSelectedSchema?: (schema:string)=>void;
}

const SchemaSelector: React.FC<SchemaSelectorProps> = ({
  displayType = DisplayType.NavDropdown,
  schemas,
  selectedSchema: p_selectedSchema,
  setSelectedSchema,
}: SchemaSelectorProps) => {

  const selectedSchema: string | undefined = p_selectedSchema;

  const handleSelect = (
    eventKey: string | null,
    e: React.SyntheticEvent<unknown, Event>
  ) => {
    const val = eventKey || "no schema";
    e.preventDefault();
    setSelectedSchema && setSelectedSchema(val);
  };


  const handleSchemaChange = (event: SelectChangeEvent) => {
    setSelectedSchema && setSelectedSchema(event.target.value);
  };
  if (displayType === DisplayType.NavDropdown)
    return (
      <>
       <Box display="flex" gap="1rem" alignItems={"center"} >
       <FormControl fullWidth disabled={!schemas ||schemas.length === 0}>
								<InputLabel id="schema-label">Schema</InputLabel>
								<Select
									labelId="schema-label"
									name="schema"
									value={selectedSchema}
									onChange={(event) => handleSchemaChange(event)}
									variant="outlined"
									label="Schema"
									size="small"
								>
									{schemas && schemas.map((schema) => {
										return <MenuItem key={schema} value={schema}>{schema}</MenuItem>
									})};
								</Select>
							</FormControl>
    </Box>
        
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

  if(displayType === DisplayType.MuiDropDown)
    return(<>
      <FormControl fullWidth disabled={schemas.length === 0}>
          <InputLabel id="schema-label">Schema</InputLabel>
          <Select
            labelId="schema-label"
            name="schema"
            value={selectedSchema}
            onChange={(event) => handleSchemaChange(event)}
            variant="outlined"
            label="Schema"
            size="small"
            >
          {schemas.map((schema) => {
            return <MenuItem key={schema} value={schema}>{schema}</MenuItem>
          })};
          </Select>
      </FormControl>
    </>);
};

export default SchemaSelector;