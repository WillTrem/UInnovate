import React from 'react'
import DisplayType from './DisplayType';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from '../../redux/Store';
import vmd from '../../virtualmodel/VMD';
import { LOGIN_BYPASS, Role} from "../../redux/AuthSlice";
import { updateSelectedSchema } from '../../redux/SchemaSlice';
import SchemaSelector from './SchemaSelector';
import { useNavigate } from 'react-router-dom';


const MenuSchemaSelector: React.FC = () => {
  const dispatch = useDispatch();
	const { user, schema_access } = useSelector((state: RootState) => state.auth);
	const schemas = [
		...new Set(vmd.getApplicationSchemas()
			.map((schema) => schema.schema_name)
			.filter((schema_name) => {
				// Ensures that on LOGIN_BYPASS without being logged in, all the schemas show
				if ((LOGIN_BYPASS && user === null) // Include if LOGIN_BYPASS enabled with no user logged in
            || (schema_access.includes(schema_name)) // Schema must be in schema_access list
            ) {
					return schema_name;
				}
			})),
	];
    const navigate = useNavigate();
    const selectedSchema: string =  useSelector(
        (state: RootState) => state.schema.value
      );
    
  // If the selected schema is not included in the schema access of the user, set it to the first element
  // MIGHT HAVE TO REMOVE LATER ON
  if(schema_access && schema_access.length !== 0  && selectedSchema && !((schema_access as string[]).includes(selectedSchema))){
    dispatch(updateSelectedSchema(schema_access[0]))
  }

  const selectCallback = (schema: string) => {
    const val = schema || "no schema";
    dispatch(updateSelectedSchema(val));
    navigate(`/${val}`);
    
  };
  return (
    <>
     <SchemaSelector
        displayType={DisplayType.Nav} //DisplayType = NavDropdown | NavPills | Nav
        schemas={schemas}
        selectedSchema={selectedSchema}
        setSelectedSchema={selectCallback}
        
    ></SchemaSelector>
    </>
  )
}

export default MenuSchemaSelector