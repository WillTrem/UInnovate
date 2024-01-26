import { Chip, MenuItem, Select, Stack } from "@mui/material";
import {Cancel, Check} from '@mui/icons-material';

interface MultiSelectProps {
	selectedList: string[],
	setSelectedList: React.Dispatch<React.SetStateAction<string[]>>,
	choiceList: string[],
	size?: "small" | "medium"
}

// Component obtained from https://codesandbox.io/s/mui-multi-select-kptq04?from-embed=&file=%2Fsrc%2FApp.js%3A238-291
const MultiSelect: React.FC<MultiSelectProps> = ({ selectedList, setSelectedList, choiceList, size }) => {

	return (
			<Select
				size={size}
				multiple
				value={selectedList}
				onChange={(e) => setSelectedList((e.target.value as string[]).sort((a, b) => a.localeCompare(b)))}
				inputProps={{ 'aria-label': 'Without label' }}
				sx={({ 
					 '& .MuiSelect-select': { }, minWidth:'20vw', maxWidth: '25vw' })}
				renderValue={(selected) => (
					<Stack gap={1} direction="row" flexWrap="wrap">
						{selected.map((value) => (
							<Chip
								key={value}
								label={value}
								onDelete={() =>
									setSelectedList(
										selectedList.filter((item) => item !== value)
									)
								}
								deleteIcon={
									<Cancel
										onMouseDown={(event) => event.stopPropagation()}
									/>
								}
							/>
						))}
					</Stack>
				)}
			>
				{choiceList.map((choice) => (
					<MenuItem key={choice} value={choice} sx={{ justifyContent: "space-between" }}>
						{choice}
						{selectedList.includes(choice) ? <Check color="info" /> : null}
					</MenuItem>
				))}
			</Select>
	);
}

export default MultiSelect;