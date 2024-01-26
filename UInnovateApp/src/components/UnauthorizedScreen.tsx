import { Box, Typography, Button} from "@mui/material"
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import {useNavigate} from 'react-router-dom'

const UnauthorizedScreen: React.FC = () => {
	const navigate = useNavigate();

	const handleClick = () => {
		navigate('/');
	}
	return <Box display={"flex"} flexDirection={"column"} alignItems={"center"} padding={"4rem"} gap={"1rem"}>
		<Box display={"flex"} flexDirection={"row"} justifyContent={"center"} alignItems={"center"}>
			<WarningAmberIcon sx={{"fontSize":"5rem"}}/>
			<Typography variant="h3">Unauthorized</Typography>
			<WarningAmberIcon sx={{"fontSize":"5rem"}}/>
		</Box>
		<Typography variant="h5">You are trying to access a page beyond your privilege rights </Typography>
		<Typography variant="h5">Press the button below to return to the home screen </Typography>
		<Button variant="contained" onClick={handleClick} sx={{ backgroundColor: "#404040" }}>
			Back to home screen</Button>
	</Box>
}

export default UnauthorizedScreen;