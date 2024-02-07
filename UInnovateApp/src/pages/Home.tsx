import { Typography } from "@mui/material";
import { NavBar } from "../components/NavBar";
import { useSelector } from "react-redux";
import { RootState } from "../redux/Store";
import { LOGIN_BYPASS } from "../redux/AuthSlice";
export function Home() {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <>
      <NavBar />
      <div
        style={{ textAlign: "center", fontSize: "60px", paddingTop: "40px" }}
      >
        {" "}
        Home page
      {(!user && !LOGIN_BYPASS) && <Typography variant="h5">(Please log in or sign up to access content)</Typography>}
      </div>{" "}
    </>
  );
}
