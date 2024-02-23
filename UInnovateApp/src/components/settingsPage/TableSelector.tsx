import { useEffect } from "react";
import { Nav } from "react-bootstrap";
import vmd from "../../virtualmodel/VMD";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/Store";

interface SchemaTableSelectorProp {
	setTable: React.Dispatch<React.SetStateAction<string>>;
}
const TableSelector = ({ setTable }: SchemaTableSelectorProp) => {
	const selectedSchema = useSelector((state: RootState) => state.schema.value);

	// Only show tables of the selected schema
	const tables = vmd.getSchema(selectedSchema)?.tables;

	useEffect(() => {
		setTable('');
	}, [])

	const handleClick = (table_name: string): void => {
		setTable(table_name);
	}

	return (
		<>
			<h4 style={{ marginBottom: 0 }}>Tables</h4>
			<Nav variant="pills" className="flex-column">
				{tables?.map(({ table_name }) => {
					return (
						<Nav.Item key={table_name} data-testid="table-setting-nav">
							<Nav.Link eventKey={table_name} onClick={(e) => { e.preventDefault(); handleClick(table_name); }} >{table_name}</Nav.Link>
						</Nav.Item>
					);
				})}
			</Nav>
		</>
	)
}

export default TableSelector;