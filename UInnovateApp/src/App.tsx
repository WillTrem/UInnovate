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
import { Box, CircularProgress, Typography } from "@mui/material";

import TableListView from "./components/TableListView";
import TableEnumView from "./components/TableEnumView";
function App() {
  const loading = useSelector((state: RootState) => state.loading.loading); 
  useEffect(() => {
    // Printing the schemas to the console
    vmd.printVMD();
  }, []);
  return (
    //Wrapping routes so that we can use the context in all the pages (eventually?)
    <ConfigProvider>
      <PersistLogin/>
      {/* Prevents the app from rendering before authentication has been verified */}
      {loading ?
      <Box display={"flex"} justifyContent={"center"} alignItems={"center"} height={"100vh"} flexDirection={"column"} gap={"16px"}>
        <Typography variant="h4" sx={{color: "#404040"}}>Loading</Typography>
        <CircularProgress disableShrink sx={{color: "#404040"}} size={"5vw"}/>
      </Box>:
       <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/check" element={<NavBar />} />
        <Route path="/:schema" element={<ObjectMenu />} />
        <Route path="/objview/:Type/:tableName/:primeKey" element={<ObjectMenu />} />
        <Route path="/:schema/:tableName" element={<ObjectMenu/> } />
        <Route path="/objview/:Type/:tableName" element={<TableEnumView />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<><p>Cannot be Found</p></>}/>
      </Routes>}
    </ConfigProvider>
  );
}

export default App;
