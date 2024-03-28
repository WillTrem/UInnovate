import React, { useEffect, useState } from "react";
import TemplateComponent from "react-mustache-template-component";
import { useNavigate } from "react-router-dom";
import vmd, { Column, Table } from "../virtualmodel/VMD";
import { DataAccessor, Row } from "../virtualmodel/DataAccessor";

interface CustomViewLoaderProps {
  templateSource: string;
  table: Table; // Assuming any data type for simplicity
}

const CustomViewLoader: React.FC<CustomViewLoaderProps> = ({
  templateSource: templateSource,
  table,
}) => {
  const navigate = useNavigate();
  const [columns, setColumns] = useState<Column[]>([]);
  const [rows, setRows] = useState<Row[] | undefined>([]);
  const [rowsFilter, setRowsFilter] = useState<Row[] | undefined>([]);

  const config_table = vmd.getTable("meta", "appconfig_values");
  let defaultOrderValue = table.columns.find(
    (column) => column.is_editable === false,
  )?.column_name;
  if (defaultOrderValue == undefined) {
    defaultOrderValue = table.columns[0].column_name;
  }

  //These are all the Usestate which is used for Pagination, Sorting and Filtering for the List view of the table
  const [PaginationValue, setPaginationValue] = useState<number>(100);
  const [PageNumber, setPageNumber] = useState<number>(1);
  const [Plength, setLength] = useState<number>(0);
  const [showTable, setShowTable] = useState<boolean>(false);
  const [sortOrder, setSortOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState(defaultOrderValue);
  const [conditionFilter, setConditionFilter] = useState<string>("");
  const [FilterMenu, setFilterMenu] = useState<(null | HTMLElement)[]>(
    new Array(columns.length).fill(null),
  );
  const [FilterCheckedList, setFilterCheckedList] = useState<{
    [key: string]: string[];
  }>(() => {
    const initialCheckedState = table.columns.reduce(
      (acc, column) => {
        acc[column.column_name] = [];
        return acc;
      },
      {} as { [key: string]: string[] },
    );

    return initialCheckedState;
  });
  const getRows = async () => {
    const attributes = table.getVisibleColumns();
    const schemas = vmd.getTableSchema(table.table_name);

    if (!schemas) {
      return;
    }

    const data_accessor: DataAccessor = vmd.getRowsDataAccessorForOrder(
      schemas.schema_name,
      table.table_name,
      orderBy,
      sortOrder,
      PaginationValue,
      PageNumber,
      conditionFilter,
    );

    const countAccessor: DataAccessor = vmd.getRowsDataAccessor(
      schemas.schema_name,
      table.table_name,
    );
    const count = await countAccessor.fetchRows();
    const lines = await data_accessor.fetchRows();

    // Filter the rows to only include the visible columns
    const filteredRows = lines?.map((row) => {
      const filteredRowData: { [key: string]: string | number | boolean } = {};
      attributes.forEach((column) => {
        filteredRowData[column.column_name] = row[column.column_name];
      });
      return new Row(filteredRowData);
    });
    const FilteredRowsCount = count?.map((row) => {
      const filteredRowData: { [key: string]: string | number | boolean } = {};
      attributes.forEach((column) => {
        filteredRowData[column.column_name] = row[column.column_name];
      });
      return new Row(filteredRowData);
    });
    setColumns(attributes);
    setRows(filteredRows);

    if (conditionFilter === "") {
      setRowsFilter(FilteredRowsCount);
      setLength(count?.length || 0);
    } else {
      setRowsFilter(filteredRows);
      setLength(lines?.length || 0);
    }
  };

  useEffect(() => {
    setOrderBy(table.columns[0].column_name);
    getRows().then(() => {
      console.log(rows);
    });
  }, [
    templateSource,
    table,
    orderBy,
    PageNumber,
    PaginationValue,
    sortOrder,
    conditionFilter,
  ]);

  return (
    <>
      <TemplateComponent template={templateSource} data={{ rows: rows }} />
    </>
  );
};

export default CustomViewLoader;
