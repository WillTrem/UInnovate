import { DataAccessor } from "../virtualmodel/DataAccessor";
import vmd, { Table } from "../virtualmodel/VMD";

const config_table = vmd.getTable("meta", "appconfig_values");
const meta_schema = vmd.getSchema("meta");

export const getConfigs = async () => {
  if (!meta_schema || !config_table) {
    throw new Error("Schema or table not found");
  }

  const config_data_accessor: DataAccessor = vmd.getRowsDataAccessor(
    meta_schema?.schema_name,
    config_table?.table_name
  );

  const config_rows = await config_data_accessor?.fetchRows();

  return config_rows;
};
