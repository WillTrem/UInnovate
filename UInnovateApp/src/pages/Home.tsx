import { NavBar } from "../components/NavBar";
export function Home() {
  return (
    <>
      <NavBar />
      <div
        style={{ textAlign: "center", fontSize: "60px", paddingTop: "40px" }}
      >
        {" "}
        Home page
      </div>{" "}
    </>
  );
}
