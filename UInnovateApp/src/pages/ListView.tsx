import { NavBar } from "../components/NavBar";
import attr from "../virtualmodel/Tables";
import TableTitles from "../components/TableTitles";
// import TableComponent from "../components/TableComponent";
// import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
// import { Link } from "react-router-dom";
import { useTableVisibility } from "../TableVisibilityContext";

export function ListView() {
	const { tableVisibility } = useTableVisibility();
	return (
		<>
			<NavBar />
			<div
				style={{ textAlign: "center", fontSize: "40px", paddingTop: "40px" }}>
				{" "}
				Table Names:
			</div>
			<div>
				{Object.keys(tableVisibility).map((tableName) => {
					if (tableVisibility[tableName]) {
						return (
							<TableTitles
								key={tableName}
								attr={attr.filter((table) => table.table_name === tableName)}
							/>
						);
					}
					return null;
				})}
			</div>
		</>
	);
}
