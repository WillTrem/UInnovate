import React, { useEffect, useState } from 'react';
import Switch from "@mui/material/Switch";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { MenuItem } from '@mui/material';
import "../../styles/TableItem.css";
import { Table } from "../../virtualmodel/VMD";
import buttonStyle from '../TableEnumView'
import { Row } from '../../virtualmodel/DataAccessor';
import { ConfigProperty } from '../../virtualmodel/ConfigProperties';
import { ConfigValueType, useConfig } from '../../contexts/ConfigContext';


type LookUpTableProps = {
  table: Table;
}
type DefaultRow = {
  [key: number]: string;
};

const LookUpTable: React.FC<LookUpTableProps> = ({ table }: LookUpTableProps) => {

  const { updateConfig } = useConfig();

  const updateTableConfig = (property: ConfigProperty, value: string) => {
    const newConfigValue: ConfigValueType = {
      property,
      table: table.table_name,
      value,
    };
    updateConfig(newConfigValue);
  };
 
  
  
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
  if (count == 0) {
   

    return (<div>
  
    </div>)
  }
  else {

    const defaultRow = new Row({});
    for (let i = -1; i < count - 1; i++) {

      defaultRow[i] = 'none';
    }


    const [SelectInput, setSelectInput] = useState<Row>(() => {
      if(table.lookup_tables=="null"){
        return (defaultRow);
      }
      else {
         const obj = JSON.parse(table.lookup_tables);
        return (obj);
      }
        
      }
    )

    // const [SelectInput, setSelectInput] = useState<Row>(() => {
    //   const savedLookUp = localStorage.getItem(name);
    //   if (savedLookUp && savedLookUp !== '{}' && savedLookUp !== '""') {

    //     return JSON.parse(savedLookUp);
    //   } else {
    //     return (defaultRow);
    //   }
    // })

    // Storage.prototype.setObj = function (key: string, obj: string) {
    //   return this.setItem(key, JSON.stringify(obj))
    // }
    // Storage.prototype.getObj = function (key: string) {
    //   const item = this.getItem(key);
    //   return item ? JSON.parse(item) : null;
    // }

  
    const MyButtonComponent = ({ buttonIndex }: { buttonIndex: number }) => {
      return (
        <div >

          <FormControl size="small">
            <h6>Lookup Tables</h6>
            <Select onChange={HandleChange(buttonIndex)} value={SelectInput[buttonIndex] == undefined ? "error" : SelectInput[buttonIndex]}>
              <MenuItem value={"none"} >None</MenuItem>
              {referencesTableList.map((ref, index) => (
                <MenuItem value={ref} key = {index}>
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
      if (counter > 0 && Object.keys(SelectInput).length == 1) {
      }
    }, [counter]);

    useEffect(() => {
      
      setSelectInputConfig();
    }, [SelectInput]);

    const setSelectInputConfig = async () => {
      const objstring = JSON.stringify(SelectInput);
      table.setLookupTables(objstring);
      await updateTableConfig(ConfigProperty.LOOKUP_TABLES, objstring);

    };
  


    const HandleChange =  (index: number) => (event: React.ChangeEvent<{ value: unknown }>) => {
      setSelectInput((prevSelectInput) => ({
        ...prevSelectInput,
        [index]: event.target.value,
      }));
      


    };


    const handleButtonClick = () => {
      if (count - 1 == counter || count == 0) {
        alert("You can't add more lookup tables")
      }
      else
        setCounter((Counter) => Counter + 1);
    };

    const handleButtonClickDelete = () => {
      if (counter > 0) {
        setCounter((Counter) => Counter - 1);
        handleReset();
      }
      else
        setCounter(0);
    };

    const handleReset = () => {
      setSelectInput((prevSelectInput) => ({
        ...prevSelectInput,
        [counter - 1]: "none",
      }));
    }



    return (
      <div>
        <div className='look-tables'>

          <FormControl style={{ marginRight: '30px' }} size="small">
            <h6>Lookup Tables</h6>
            <Select onChange={HandleChange(-1)} value={SelectInput[-1] == undefined ? "error" : SelectInput[-1]}>
              <MenuItem value={"none"} >None</MenuItem>
              {referencesTableList.map((ref, index) => (
                <MenuItem key= {index} value={ref}>
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
        <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '100px', width: '273.08', marginTop: '2em' }}>
          {[...Array(counter)].map((_, index) => (

            <MyButtonComponent key={index} buttonIndex={index} />

          ))}
        </div>
        {table.lookup_tables} 
        {JSON.stringify(defaultRow)}
      </div>
    );
  }
};
export default LookUpTable;


