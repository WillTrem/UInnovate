import { Col, Row as Line, Tab, Nav } from "react-bootstrap";
import { useEffect, useState } from "react";
import { DataAccessor, Row } from "../../virtualmodel/DataAccessor";
import vmd from "../../virtualmodel/VMD";

export const ScriptingTab = () => {
  const schema = vmd.getSchema("meta");
  const script_table = vmd.getTable("meta", "scripts");
  const [scripts, setScripts] = useState<Row[] | undefined>([]);

  useEffect(() => {
    if (!schema || !script_table) {
      throw new Error("Schema or table not found");
    }

    const data_accessor: DataAccessor = vmd.getRowsDataAccessor(
      schema?.schema_name,
      script_table?.table_name
    );

    const getScripts = async () => {
      const scripts_rows = await data_accessor?.fetchRows();
      setScripts(scripts_rows);
    };

    getScripts();
  }, [schema, script_table]);

  scripts?.forEach((script) => {
    console.log(script["name"]);
  });

  return (
    <div>
      <Tab.Container>
        <Line>
          <Col sm={3}>
            <h4>Scripts</h4>
            <Nav variant="pills" className="flex-column">
              {scripts?.map((script) => {
                const script_name = script["name"];
                return (
                  <Nav.Item key={script_name}>
                    <Nav.Link eventKey={script_name}>{script_name}</Nav.Link>
                  </Nav.Item>
                );
              })}
            </Nav>
          </Col>
        </Line>
      </Tab.Container>
    </div>
  );
};
