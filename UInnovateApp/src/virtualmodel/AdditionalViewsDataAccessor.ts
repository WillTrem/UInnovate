import { DataAccessor } from "./DataAccessor";
import vmd from "./VMD.tsx";

const SETTING_SCHEMA_NAME = 'meta';
const SETTING_TABLE_NAME = 'additional_view_settings';
const CUSTOM_VIEW_TABLE_NAME = 'custom_view_templates';

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

export const insertNewView = async (p_schemaName: string, p_tableName: string, p_viewName: string, p_viewType: number, ) => {
	try {
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
