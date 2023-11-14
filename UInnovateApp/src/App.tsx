import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { NavBar } from "./components/NavBar";
import { ObjectMenu } from "./pages/ObjectMenu";
import { Settings } from "./pages/Settings";
import { TableVisibilityProvider } from "./contexts/TableVisibilityContext";
import { TablesContextProvider } from "./contexts/TablesContext";
import { ConfigProvider } from "./contexts/ConfigContext";
function App() {
  return (
    //Wrapping routes so that we can use the context in all the pages (eventually?)
    <TablesContextProvider>
      <ConfigProvider>
        <TableVisibilityProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/check" element={<NavBar />} />
            <Route path="/objview" element={<ObjectMenu />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </TableVisibilityProvider>
      </ConfigProvider>
    </TablesContextProvider>
  );
}

export default App;
