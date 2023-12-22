import vmd from "../../virtualmodel/VMD";


interface TableListViewProps {
  table: Table;
}

const LookUpTableDetails: React.FC<TableListViewProps> = ({ table }: TableListViewProps) => {
  const name = table.table_name + "T";
  const Local = localStorage.getItem(name);
  if (Local == null) {
    return (<>no</>)
  }
  else {
    const getTable = JSON.parse(Local!);
    var count = Object.keys(getTable).length - 1;
    let currentPrimaryKey: string;
    const nonEditableColumn = table.columns.find((column: { is_editable: boolean; }) => column.is_editable === false);
    if (nonEditableColumn) {
      currentPrimaryKey = nonEditableColumn.column_name;
    }
    const LookUpTables = (num: number) => {
      num = num - 1;
      if (getTable[num] == 'none') {
        return (<>nothing</>);
      }
      else {
        const tableName= getTable[num];
        const bruh = vmd.getTable("application", tableName);

        const swag = bruh?.getColumns();
        const search = table.getColumns()
        let toolsColumn;
        search?.map((attribute) => {  
          if (attribute.references_table == tableName) {
            toolsColumn = attribute.column_name;
          }
          else {

        }
      });
        const connectionID = localStorage.getItem(toolsColumn+"L");
        return (
          <div>
            hello 
            {bruh?.table_name}
            aaa
            
            {connectionID}
            hey
            {toolsColumn}
            
          </div>

        )
      }

    }


    return (<>
      {[...Array(count)].map((_, index) => (
        <div key={index}>
          {LookUpTables(index)}
        </div>

      ))}
    </>
    )



  }
}

export default LookUpTableDetails;