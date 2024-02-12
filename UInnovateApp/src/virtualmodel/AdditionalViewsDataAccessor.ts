import { DataAccessor } from "./DataAccessor";
import vmd from "./VMD.tsx";

const SETTING_SCHEMA_NAME = 'meta';
const SETTING_TABLE_NAME = 'additional_view_settings';

export const getViews = async (setterCallback:(args:any)=>void, p_tableName: string)  => {
    
    const data_accessor: DataAccessor = vmd.getRowsDataAccessor(
        SETTING_SCHEMA_NAME,
        SETTING_TABLE_NAME
    );

    const rows = await data_accessor?.fetchRows();
    if(rows){
        setterCallback(rows.filter(r => {if(r.tablename == p_tableName){return r}} ));
    }
};
