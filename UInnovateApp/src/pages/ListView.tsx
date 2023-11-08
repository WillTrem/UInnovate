import { NavBar } from "../components/NavBar";
import { useState } from "react";
import attr from "../virtualmodel/Tables";
import fetchData from "../virtualmodel/Tables";
import TableTitles from "../components/TableTitles";

export function ListView() {
  const [attrData, setAttrData] = useState([]);

  const onDataFetched = (data) => {
    setAttrData(data);
  };

  return (
    <>
      <NavBar />
      <div
        style={{ textAlign: "center", fontSize: "40px", paddingTop: "40px" }}
      >
        {" "}
        Table Names:
      </div>

      <div>
        <fetchData onDataFetched={onDataFetched} />
        <TableTitles attr={attr}></TableTitles>
      </div>
    </>
  );
}
