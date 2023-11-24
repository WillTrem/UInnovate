import React, { useContext, useState, useEffect } from "react";
import vmd from "../virtualmodel/VMD.tsx";

interface TableVisibilityContextType {
  tableVisibility: { [key: string]: boolean };
  setTableVisibility: React.Dispatch<
    React.SetStateAction<{ [key: string]: boolean }>
  >;
}

export type TableVisibilityType = {
  [key: string]: boolean;
};

const TableVisibilityContext = React.createContext<
  TableVisibilityContextType | undefined
>(undefined);

type TableVisibilityProviderProps = {
  children: React.ReactNode;
};

export const TableVisibilityProvider: React.FC<
  TableVisibilityProviderProps
> = ({ children }) => {
  // Setting default visibility
  const defaultVisibility = () => {
    const tables = vmd.getAllTables();
    const tableNames = Array.from(
      new Set(tables.map((table) => table.table_name))
    );
    const visibility: { [key: string]: boolean } = {};
    tableNames.forEach((name) => {
      visibility[name] = true; // default is true (visible)
    });
    return visibility;
  };

  // Initialize from localStorage or default
  const [tableVisibility, setTableVisibility] = useState<{
    [key: string]: boolean;
  }>(() => {
    const storedVisibility = localStorage.getItem("tableVisibility");
    return storedVisibility
      ? JSON.parse(storedVisibility)
      : defaultVisibility();
  });

  // Effect to store state changes to localStorage
  useEffect(() => {
    localStorage.setItem("tableVisibility", JSON.stringify(tableVisibility));
  }, [tableVisibility]);

  return (
    <TableVisibilityContext.Provider
      value={{ tableVisibility, setTableVisibility }}
    >
      {children}
    </TableVisibilityContext.Provider>
  );
};

// Custom hook to use the TableVisibilityContext
//-> Breadcrump for later: Fast refresh only works when a file only exports components.
export const useTableVisibility = (): TableVisibilityContextType => {
  const context = useContext(TableVisibilityContext);
  if (!context) {
    throw new Error(
      "useTableVisibility must be used within a TableVisibilityProvider"
    );
  }
  return context;
};
