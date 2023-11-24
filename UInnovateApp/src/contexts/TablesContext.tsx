import React, { createContext, useContext, useState } from "react";
import vmd, { Column, Table } from "../virtualmodel/VMD";

// The context returns the list of all tables
const TablesContext = createContext<Table[] | undefined>(undefined);

type TablesContextProviderProps = {
  children: React.ReactNode;
};
export const TablesContextProvider: React.FC<TablesContextProviderProps> = ({
  children,
}) => {
  const allTables = vmd.getAllTables();
  const [tables] = useState<Table[]>(allTables);

  return (
    <TablesContext.Provider value={tables}>{children}</TablesContext.Provider>
  );
};

export const useTables = (): Table[] | undefined => {
  const tables = useContext(TablesContext);
  if (!tables) {
    throw new Error("useTables must be used within a TablesContextProvider.");
  }
  return tables;
};

export const useTableAttributes = (tableName: string): Column[] | undefined => {
  const tables = useTables();
  return tables
    ?.find((table: Table) => table.table_name === tableName)
    ?.getColumns();
};
