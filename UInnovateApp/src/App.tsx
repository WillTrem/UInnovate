import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { NavBar } from "./components/NavBar";
import { ObjectMenu } from "./pages/ObjectMenu";
import { Element } from "./pages/Element";
import { ListView } from "./pages/ListView";
import { EnumView } from "./pages/EnumView";
import { Settings } from "./pages/Settings";
import { TableVisibilityProvider } from "./TableVisibilityContext";

function App() {
	return (
		//Wrapping routes so that we can use the context in all the pages (eventually?)
		<TableVisibilityProvider>
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/check' element={<NavBar />} />
				<Route path='/app' element={<ListView />} />
				<Route path='/app/:table_name' element={<Element />} />
				<Route path='/objview' element={<ObjectMenu />} />
				<Route path='/enumview' element={<EnumView />} />
				<Route path='/settings' element={<Settings />} />
			</Routes>
		</TableVisibilityProvider>
	);
}

export default App;
