import React, { useState } from 'react';
import Switch from "@mui/material/Switch";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { MenuItem } from '@mui/material';
import "../../styles/TableItem.css";


const LookUpTable: React.FC = () => {

        
  const MyButtonComponent = ( ) => {
    return (
      <FormControl size="small">
      <h6>Extra Lookup Tables</h6>
      <Select
      onChange={HandleChange}
      
      >
        <MenuItem value={"Option1"}>option 1</MenuItem>
        <MenuItem value={"Option2"}>option 2</MenuItem>
      </Select>
      <FormHelperText>
        To customize the default layout of the table
      </FormHelperText>
    </FormControl>
    );
  };


  const [counter, setCounter] = useState(0);

  const handleButtonClick = () => {
    setCounter((Counter) => Counter + 1);
  };
  const HandleChange = () => {
    console.log()
  }
  const handleButtonClickDelete = () => {
    if(counter > 0)
    setCounter((Counter) => Counter - 1);
  else    
    setCounter(0);
  };

  return (
    <div>
    <div className='look-tables'>

    <FormControl  style={{marginRight:'30px'}}size="small">
      <h6>Lookup Tables</h6>
      <Select>
        <MenuItem value={"Option1"}>option 1</MenuItem>
        <MenuItem value={"Option2"}>option 2</MenuItem>
      </Select>
      <FormHelperText>
        To customize the default layout of the table
      </FormHelperText>
    </FormControl>
    
    <button
    onClick={handleButtonClick}
    style={{  width:'26.5px', height:'30px', marginRight:'30px' }}
    >
      +
    </button>
    <button
    onClick={handleButtonClickDelete}
    style={{  width:'26.5px', height:'30px', }}
    >
       -
    </button>
    </div>
    <div style={{display:'flex', flexDirection:'column', marginLeft:'200px', width:'273.08'}}>
      {[...Array(counter)].map((_, index) => (
        
        <MyButtonComponent key={index} />
      ))}
    </div>
    </div>
  );
};
export default LookUpTable;


