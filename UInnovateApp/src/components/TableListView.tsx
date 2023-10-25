import "./TableComponent.css";
import attr from '../virtualmodel/Tables';
import Table from 'react-bootstrap/Table';

export default function TableListView({ nameoftable }) {

  return(
    <div>       
         {attr.map((table) => {
        if (table.table_name !== nameoftable) {
          return null;
        } else {
          const attributeElements = table.attributes.map((attribute, index) => (
                <th key= {index}>{attribute}</th>
               
            
          ));

          return <div>
              <Table striped bordered hover variant="dark" >
            <thead>
              <tr>
              {attributeElements}
              </tr>
            </thead>
            
          </Table>
           

            
            </div>;
        }
      })}
    </div>
  );
}
