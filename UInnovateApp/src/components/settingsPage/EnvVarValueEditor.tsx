import { useState } from "react";
import { Form } from "react-bootstrap";
import { Button } from "@mui/material";
import { Row } from "../../virtualmodel/DataAccessor";

export const EnvVarValueEditor = (row: Row) => {
	const [currentEnvVar] = useState<Row>(row);
	const [envVarValue, setEnvVarValue] = useState<string>(row.value);

	const name = `${currentEnvVar.row?.name}`;
	const value = `${currentEnvVar.row?.value}`;

	return (
		<>
			<Form.Control type='text' value={name} readOnly />
			<Form.Control
				type='text'
				defaultValue={value}
				onBlur={(e) => setEnvVarValue(e.target.value)}
			/>
			<Button
				onClick={() => {
					console.log(envVarValue);
					//update(envVar.id, envVarValue);
				}}>
				Save
			</Button>
		</>
	);
};
