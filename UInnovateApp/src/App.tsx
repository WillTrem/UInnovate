import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { NavBar } from "./components/NavBar";
import { ObjectMenu } from "./pages/ObjectMenu";
import { Settings } from "./pages/Settings";
import vmd from "./virtualmodel/VMD";
import { useEffect } from "react";
import PersistLogin from "./components/PersistLogin";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/Store";
import { Alert, Box, CircularProgress, Snackbar, Typography } from "@mui/material";
import NotificationSnackbar from "./components/NotificationSnackbar";
import SearchPage from "./pages/SearchPage";

function App() {
  const loading = useSelector((state: RootState) => state.loading.loading);


  useEffect(() => {
    // Printing the schemas to the console
    vmd.printVMD();
  }, []);
  return (
    <>
      <PersistLogin />
      {/* Prevents the app from rendering before authentication has been verified */}
      {loading ?
        <Box display={"flex"} justifyContent={"center"} alignItems={"center"} height={"100vh"} flexDirection={"column"} gap={"16px"}>
          <Typography variant="h4" sx={{ color: "#404040" }}>Loading</Typography>
          <CircularProgress disableShrink sx={{ color: "#404040" }} size={"5vw"} />
        </Box> :
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/check" element={<NavBar />} />
          <Route path="/:schema" element={<ObjectMenu />} />
          <Route path="/:schema/:tableName/:id" element={<ObjectMenu />} />
          <Route path="/:schema/:tableName" element={<ObjectMenu />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/settings/:option" element={<Settings />} />

          <Route path="*" element={<><p>Cannot be Found</p></>} />
        </Routes>}
      <NotificationSnackbar />
    </>
  );
}

export default App;
