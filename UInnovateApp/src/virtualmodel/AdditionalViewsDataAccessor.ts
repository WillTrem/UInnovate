import { ViewTypeEnum } from "../components/settingsPage/additionalView/ViewTypeEnum.tsx";
import { DataAccessor, Row } from "./DataAccessor";
import { FunctionAccessor } from "./FunctionAccessor.tsx";
import vmd from "./VMD.tsx";

const SETTING_SCHEMA_NAME = 'meta';
const SETTING_TABLE_NAME = 'additional_view_settings';
const CUSTOM_VIEW_TABLE_NAME = 'custom_view_templates';
const RPC_NAME = 'insert_custom_view';

export const getViews = async (setterCallback:(args:any)=>void, p_tableName: string, signal: AbortSignal)  => {
    
    const data_accessor: DataAccessor = vmd.getRowsDataAccessor(
        SETTING_SCHEMA_NAME,
        SETTING_TABLE_NAME
    );

    const rows = await data_accessor?.fetchRows(signal);
    if(rows){
        setterCallback(rows.filter(r => {if(r.tablename == p_tableName){return r}} ));
    }
};

export const getCustomViews = async (setterCallback:(args:any)=>void, signal: AbortSignal)  => {
    
    const data_accessor: DataAccessor = vmd.getRowsDataAccessor(
        SETTING_SCHEMA_NAME,
        CUSTOM_VIEW_TABLE_NAME
    );

    const rows = await data_accessor?.fetchRows(signal);
    if(rows){
		console.log(rows);
        setterCallback(rows);
    }
};

export const insertNewView = async (p_schemaName: string, p_tableName: string, p_viewName: string, p_viewType: number, p_template?: string) => {
	try {
		
		if(p_viewType !== ViewTypeEnum.Custom){
			const data_accessor: DataAccessor = vmd.getAddRowDataAccessor(
			SETTING_SCHEMA_NAME, // schema name
			SETTING_TABLE_NAME, // table name
			//new row data:
			{
				schemaname: p_schemaName,
				tablename: p_tableName,
				viewname: p_viewName,
				viewtype: p_viewType,
			}
		);

		// Use data accessor to add the new row woop woop
		await data_accessor.addRow();
		}
		else {
			const data = {
				"p_schema_name": p_schemaName,
				"p_table_name": p_tableName,
				"p_template": p_template,
				"p_view_name": p_viewName,
				"p_view_type_id": p_viewType
			} as Row;
			console.log(data);
			const cstm_view_data_accessor: FunctionAccessor = vmd.getFunctionAccessor(
				SETTING_SCHEMA_NAME, // schema name
				RPC_NAME, // remote procedure function name
				//new row data:
				data
			);

			await cstm_view_data_accessor.executeFunction();
		}
	
		// alert("View saved successfully.");
	} catch (error) {
		console.error("Error in upserting view:", error);
		alert("Failed to save view.");
	}
};

export const deleteView = async (p_id: string, isCustom: boolean) => {
	try {

		const addit_view_data_accessor: DataAccessor = vmd.getRemoveRowAccessor(
			SETTING_SCHEMA_NAME, // schema name
			SETTING_TABLE_NAME, // table name
			"id",
			p_id
		);

		if(isCustom){
			const cstm_view_data_accessor: DataAccessor = vmd.getRemoveRowAccessor(
				SETTING_SCHEMA_NAME, // schema name
				CUSTOM_VIEW_TABLE_NAME, // table name
				"settingid",
				p_id
			);
			await cstm_view_data_accessor.deleteRow();
			await addit_view_data_accessor.deleteRow();
			return true;
		}
		else{
			await addit_view_data_accessor.deleteRow();
			return true;
		}
		alert("View deleted successfully.");
	} catch (error) {
		console.error("Error in deleting view:", error);
		alert("Failed to delete view.");
        return false;
	}
};
