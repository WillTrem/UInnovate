import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/Store";
import { useEffect } from "react";
import { DecodedToken, logIn, updateDefaultRole, updateSchemaRoles } from "../redux/AuthSlice";
import vmd from "../virtualmodel/VMD";
import { setLoading } from "../redux/LoadingSlice";
import { getDefaultRole, getSchemaRoles } from "../helper/RolesHelpers";
import { jwtDecode } from "jwt-decode";

const PersistLogin: React.FC = () => {
	const dispatch = useDispatch();
	const token = useSelector((state: RootState) => state.auth.token);

	useEffect(() => {
		if (!token) {
			dispatch(setLoading(true));
			const refreshTokenFuncAccessor = vmd.getFunctionAccessor('meta', 'token_refresh');
			refreshTokenFuncAccessor.executeFunction({ withCredentials: true }).then(async (response) => {
				const token = response.data.token;
				dispatch(logIn(token));
				await vmd.refetchSchemas();
				const { email } = jwtDecode(token) as DecodedToken;
				const schemaRoles = await getSchemaRoles(email);
				dispatch(updateSchemaRoles(schemaRoles));

				const defaultRole = await getDefaultRole(email);
				dispatch(updateDefaultRole(defaultRole));
			})
				.catch((error) => {
					if (error.response) {
						console.log(error.response.data.message)
					}
					else if(error.message){
						console.log(error.message);
					}
					else{
						console.log(error);
					}
				})
				.finally(() => dispatch(setLoading(false)));
		}
	}, [])
	return <></>
}
export default PersistLogin;
