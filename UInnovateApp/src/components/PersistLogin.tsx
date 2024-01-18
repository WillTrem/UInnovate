import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/Store";
import { useEffect } from "react";
import { logIn } from "../redux/AuthSlice";
import vmd from "../virtualmodel/VMD";
import { setLoading } from "../redux/LoadingSlice";

const PersistLogin:React.FC = () => {
	const dispatch = useDispatch();
	const token = useSelector((state: RootState) => state.auth.token);
	
	useEffect(() => {
		if(!token){
			dispatch(setLoading(true));
			const refreshTokenFuncAccessor = vmd.getFunctionAccessor('meta', 'token_refresh');
			refreshTokenFuncAccessor.executeFunction({withCredentials: true}).then(async (response) => {
				console.log(response);
				const token = response.data.token;
				dispatch(logIn(token)); 
				await vmd.refetchSchemas();
				
			})
			.catch((error) => {console.log(error.response.data.message)})
			.finally(() => dispatch(setLoading(false)));
		}
	},[])
	return <></>
}
export default PersistLogin;
