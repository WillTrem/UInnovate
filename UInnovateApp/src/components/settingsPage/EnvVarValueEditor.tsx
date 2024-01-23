import { useState } from "react";
import { Form } from "react-bootstrap";
import { Button } from "@mui/material";
import { Row } from "../../virtualmodel/DataAccessor";

export interface UpdateFunction {
	handleSubmit: (id: string, value: string) => void;
}

export const EnvVarValueEditor = (props: {
	row: Row;
	update: UpdateFunction;
}) => {
	const id = `${props.row.id}`;
	const name = `${props.row.name}`;
	const value = `${props.row.value}`;

	const [envVarValue, setEnvVarValue] = useState<string>(value);

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
					props.update.handleSubmit(id, envVarValue);
				}}>
				Save
			</Button>
		</>
	);
};
