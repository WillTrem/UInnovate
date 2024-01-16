import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/Store";
import { useEffect } from "react";
import { logIn } from "../redux/AuthSlice";
import vmd from "../virtualmodel/VMD";

const PersistLogin:React.FC = () => {
	const dispatch = useDispatch();
	const token = useSelector((state: RootState) => state.auth.token);
	
	useEffect(() => {
		if(!token){
			const refreshTokenFuncAccessor = vmd.getFunctionAccessor('meta', 'token_refresh');
			refreshTokenFuncAccessor.executeFunction({withCredentials: true}).then((response) => {
				console.log(response);
				const token = response.data.token;
				dispatch(logIn(token)); 
			})
			.catch((error) => {console.log(error.response.data.message)});
		}
	},[])
	return <></>
}
export default PersistLogin;