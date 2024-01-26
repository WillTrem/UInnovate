import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { NavBar } from "./components/NavBar";
import { ObjectMenu } from "./pages/ObjectMenu";
import { Settings } from "./pages/Settings";
import { ConfigProvider } from "./contexts/ConfigContext";
import vmd from "./virtualmodel/VMD";
import { useEffect } from "react";
import PersistLogin from "./components/PersistLogin";
import TableListView from "./components/TableListView";
import TableEnumView from "./components/TableEnumView";
function App() {
  useEffect(() => {
    // Printing the schemas to the console
    vmd.printVMD();
  }, []);
  return (
    //Wrapping routes so that we can use the context in all the pages (eventually?)
    <ConfigProvider>
      <PersistLogin/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/check" element={<NavBar />} />
        <Route path="/objview/:Type/:tableName" element={<ObjectMenu />} />
        <Route path="/objview/:Type/:tableName/:primeKey" element={<ObjectMenu />} />
        <Route path="/objview" element={<ObjectMenu/> } />
        <Route path="/objview/:Type/:tableName" element={<TableEnumView />} />
        <Route path="/objview/:Type/:tableName" element={<TableListView />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<><p>Cannot be Found</p></>}/>
      </Routes>
    </ConfigProvider>
  );
}

export default App;
