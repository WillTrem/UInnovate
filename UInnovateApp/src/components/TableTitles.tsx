import Nav from "react-bootstrap/Nav";
import { Link } from "react-router-dom";
import {Row, Col, Container} from "react-bootstrap";
export default function TableTitles({ attr }) {
  const tableNames = Array.from(new Set(attr.map((table) => table.table_name)));

  
  return (
    <div>
      
        
          
            {tableNames.map((tableName) => {
              return  <>
              <Container>
              <Row style={{textAlign:'center'}}>
                <Col>
              <Link to={`/app/${tableName}`} style={{ fontSize: "25px" , color:'black', textDecoration:'none'}}>{tableName}</Link>
              </Col>
              </Row>
              </Container>

              </>
            })}
          
    
      
    </div>
  );
}
