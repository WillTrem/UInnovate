import React, { useEffect, useState } from 'react';
import Switch from "@mui/material/Switch";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { MenuItem } from '@mui/material';
import "../../styles/TableItem.css";
import {Table } from "../../virtualmodel/VMD";
import buttonStyle from '../TableEnumView'

type LookUpTableProps = {
  table:Table;
}

const LookUpTable: React.FC<LookUpTableProps> = ({table,}:LookUpTableProps) => {

  

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
  console.log(table.table_name)
console.log(  count)


  Storage.prototype.setObj = function (key:string, obj:string) {
    return this.setItem(key, JSON.stringify(obj))
  }
  Storage.prototype.getObj = function (key: string) {
    const item = this.getItem(key);
    return item ? JSON.parse(item) : null;
  }
  localStorage.setObj("test", 4)
  console.log(localStorage.getObj("test"))
  const MyButtonComponent = () => {
    return (
      <div >
      <FormControl size="small">
        <h6> Lookup Tables</h6>
        <Select onChange={HandleChange}>
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
  }, [counter]);

  const handleButtonClick = () => {
    if(count -1 == counter|| count==0)
    {
      alert("You can't add more lookup tables")
    }
    else
    setCounter((Counter) => Counter + 1);
  };
  const HandleChange = () => {
    console.log()
  }
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
          <Select onChange={HandleChange}>
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

          <MyButtonComponent key={index} />
        ))}
      </div>
    </div>
  );
};
export default LookUpTable;


