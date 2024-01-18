import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { NavBar } from "./components/NavBar";
import { ObjectMenu } from "./pages/ObjectMenu";
import { Settings } from "./pages/Settings";
import { ConfigProvider } from "./contexts/ConfigContext";
import vmd from "./virtualmodel/VMD";
import { useEffect } from "react";
import PersistLogin from "./components/PersistLogin";
import { useSelector } from "react-redux";
import { RootState } from "./redux/Store";
function App() {
  useSelector((state: RootState) => state.loading.loading); // Just there to re-render the app when loading state changes

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
        <Route path="/objview" element={<ObjectMenu />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </ConfigProvider>
  );
}

export default App;
