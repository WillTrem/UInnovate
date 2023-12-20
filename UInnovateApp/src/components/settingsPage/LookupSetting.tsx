import React, { useEffect, useState } from 'react';
import Switch from "@mui/material/Switch";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { MenuItem } from '@mui/material';
import "../../styles/TableItem.css";
import {Table } from "../../virtualmodel/VMD";
import buttonStyle from '../TableEnumView'
import { Row } from '../../virtualmodel/DataAccessor';


type LookUpTableProps = {
  table:Table;
}

const LookUpTable: React.FC<LookUpTableProps> = ({table}:LookUpTableProps) => {

  const [SelectInput , setSelectInput] = useState<Row>(table.lookup_tables);
  console.log(Object.keys(SelectInput).length)

  console.log(table.table_name +" " +table.lookup_tables[-1]+"        hhhhhhhhhhhhhhhiiiiiiiiiiiiiiiii");
  const attributes = table.getColumns();
  let count = 0;
  const referencesTableList: string[] = [];

  attributes?.map((attribute) => {
    if (attribute.references_table != "null" && attribute.references_table != null) {
      count = count + 1;
      referencesTableList.push(attribute.references_table);
    }
    else {
      count = count + 0;
    }
  });
  


  Storage.prototype.setObj = function (key:string, obj:string) {
    return this.setItem(key, JSON.stringify(obj))
  }
  Storage.prototype.getObj = function (key: string) {
    const item = this.getItem(key);
    return item ? JSON.parse(item) : null;
  }
  
// useEffect(() => {
//   Object.entries(SelectInput).map(([key, value]) => {
//     console.log(`Key: ${key}, Value: ${value}`);
//   });
// } , [SelectInput]);

// console.log(SelectInput["customers"])
  const MyButtonComponent = ({buttonIndex}: { buttonIndex: number }) => {
    return (
      <div >
        here is my {buttonIndex} 
      <FormControl size="small">
        <h6> Lookup Tables</h6>
        <Select  defaultValue={"none"} >
          <MenuItem value={"none"} >None</MenuItem>
          {referencesTableList.map((ref,index) => (
            <MenuItem  value = {ref} key={index} >
              {ref}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>
          To customize the default layout of the table
        </FormHelperText>
      </FormControl>
      </div>
    );
  };


  const [counter, setCounter] = useState(() => {
    // Retrieve the counter value from local storage when initializing state
    const savedCounter = localStorage.getItem(table.table_name);
    return savedCounter !== null ? Number(savedCounter) : 0;
  });



  useEffect(() => {
    // Store the counter value in local storage whenever it changes
    localStorage.setItem(table.table_name, counter.toString());
    if (counter>0 && Object.keys(SelectInput).length==1) {

      console.log("here")
      
    }
  }, [counter]);


  useEffect(() => {
    table.setLookupTables(SelectInput);

    console.log(table.lookup_tables[-1]+"        heyyyyyyyyyyyyyyyyyy");
  }, [SelectInput]);



  const HandleChange = (event: SelectChangeEvent) => {
    setSelectInput((prevSelectInput) => ({
      ...prevSelectInput,
      [-1]: event.target.value,
    }));

    
  };


  const handleButtonClick = () => {
    if(count -1 == counter|| count==0)
    {
      alert("You can't add more lookup tables")
    }
    else
    setCounter((Counter) => Counter + 1);
  };
  
  const handleButtonClickDelete = () => {
    if (counter > 0)
      setCounter((Counter) => Counter - 1);
    else
      setCounter(0);
  };
if(count==0)
{
  return (<></>)
}
else
  return (
    <div>
      <div className='look-tables'>

        <FormControl style={{ marginRight: '30px' }} size="small">
          <h6>Lookup Tables</h6>
          <Select onChange={HandleChange} value={SelectInput["-1"]== undefined? "error": SelectInput["-1"]}>
          <MenuItem value={"none"} >None</MenuItem>
          {referencesTableList.map((ref, index) => (
            <MenuItem key={index} value={ref}>
              {ref}
            </MenuItem>
          ))}
          </Select>
          <FormHelperText>
            To customize the default layout of the table
          </FormHelperText>
        </FormControl>
          
        <button
          onClick={handleButtonClick}
          style={{ width: '26.5px', height: '30px', marginRight: '30px' }}
        >
          +
        </button>
        <button
          onClick={handleButtonClickDelete}
          style={{ width: '26.5px', height: '30px', }}
        >
          -
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '100px', width: '273.08', marginTop:'2em' }}>
        {[...Array(counter)].map((_, index) => (

          <MyButtonComponent key={index} buttonIndex={index} />
          
        ))}
      </div>
    </div>
  );
};
export default LookUpTable;


