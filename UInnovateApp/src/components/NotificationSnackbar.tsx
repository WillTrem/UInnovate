import { Alert, Snackbar } from "@mui/material"
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/Store";
import { closeNotification } from "../redux/NotificationSlice";

const NotificationSnackbar: React.FC = () => {
	const { showSnackbar, isError, message } = useSelector((state: RootState) => state.notification)
	const dispatch = useDispatch();

	function handleClose() {
		dispatch(closeNotification());
	}

	return <Snackbar
		open={showSnackbar}
		autoHideDuration={5000}
		onClose={handleClose}
		transitionDuration={300}
	>
		<Alert
			onClose={handleClose}
			severity={isError ? "error" : "info"}
			sx={{ width: '100%' }}
		>
			{message}
		</Alert>
	</Snackbar>
}

export default NotificationSnackbar;