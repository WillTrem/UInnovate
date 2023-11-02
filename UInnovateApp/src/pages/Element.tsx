import { NavBar } from "../components/NavBar";
import attr from "../virtualmodel/Tables";
import TableListView from "../components/TableListView";
import { useParams } from "react-router-dom";
import TableTitles from "../components/TableTitles";
import "./page.css";
import { useTableVisibility } from "../contexts/TableVisibilityContext";

//TODO: use useTableVisibility custom hook to get access to the current visibility state (tableVisibility)
// and the function to change it (setTableVisibility)

export function Element() {
	const { table_name } = useParams();
	const { tableVisibility } = useTableVisibility();

	if (table_name && !tableVisibility[table_name]) {
		//add check for table_name to avoid table_name being undefined
		return (
			<>
				<NavBar />
				<div
					style={{ textAlign: "center", fontSize: "40px", paddingTop: "40px" }}>
					The table {table_name} is currently hidden.
				</div>
			</>
		);
	}

	return (
		<>
			<NavBar />
			<div
				style={{
					textAlign: "center",
					fontSize: "40px",
					paddingTop: "40px",
					paddingBottom: "40px",
				}}>
				{" "}
				Table Information of {table_name}
			</div>

			<div className='sidebar'>
				<TableTitles attr={attr}></TableTitles>
				<TableListView nameoftable={table_name}></TableListView>
			</div>
		</>
	);
}
