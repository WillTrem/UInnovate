import Nav from "react-bootstrap/Nav";

export default function TableTitles({ attr }) {
  const tableNames = Array.from(new Set(attr.map((table) => table.table_name)));

  
  return (
    <div>
      
        
          
            {tableNames.map((tableName: string) => {
              return <Nav.Link href="/app/element" style={{ textAlign:'center', fontSize: "25px" }}>
              {tableName}
            </Nav.Link>;
            })}
          
    
      
    </div>
  );
}
