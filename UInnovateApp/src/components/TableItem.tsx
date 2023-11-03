import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import { TableVisibilityType } from "../contexts/TableVisibilityContext"; // Adjust the import path as necessary

interface TableItemProps {
	tableName: string;
	isVisible: boolean;
	toggleVisibility: (
		updateFn: (prevState: TableVisibilityType) => TableVisibilityType
	) => void;
}

export const TableItem: React.FC<TableItemProps> = ({
	tableName,
	isVisible,
	toggleVisibility,
}) => {
	const [showCheckbox, setShowCheckbox] = useState(false); // Local state to manage checkbox display

	// Handle the change event for the checkbox
	const handleToggle = () => {
		toggleVisibility((prevVisibility) => ({
			...prevVisibility,
			[tableName]: !isVisible,
		}));
	};

	// Toggle the display of the checkbox
	const handleItemClick = () => {
		setShowCheckbox(!showCheckbox);
	};

	return (
		<div className='table-item' onClick={handleItemClick}>
			<div className='text-table'>{tableName}</div>
			{showCheckbox && (
				<>
					<label className='switch'>
						<input
							type='checkbox'
							checked={isVisible}
							onChange={handleToggle}
						/>
						<span className='slider round'></span>
					</label>
					<Form.Select
						className='form-select'
						aria-label='Default select example'>
						<option value='1'>List View</option>
						<option value='2'>Enumeration View</option>
					</Form.Select>
				</>
			)}
		</div>
	);
};
