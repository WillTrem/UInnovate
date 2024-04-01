import React, { useEffect, useState } from 'react';
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Select from "@mui/material/Select";
import { Button, MenuItem } from '@mui/material';
import "../../styles/TableItem.css";
import { ConfigData, Table } from "../../virtualmodel/VMD";
import { Row } from '../../virtualmodel/DataAccessor';
import { ConfigProperty } from '../../virtualmodel/ConfigProperties';
import { saveConfigToDB } from '../../helper/SettingsHelpers';
import { AuthState } from '../../redux/AuthSlice';
import { RootState } from '../../redux/Store';
import { useDispatch, useSelector } from 'react-redux';
import Audits from "../../virtualmodel/Audits";
import { displayError } from '../../redux/NotificationSlice';

type LookUpTableProps = {
  table: Table;
}

const buttonStyle = {
  marginRight: 20,
  backgroundColor: "#404040",
  color: "white",
  fontSize: 18,

};

const LookUpTableSetting: React.FC<LookUpTableProps> = ({ table }: LookUpTableProps) => {
  const dispatch = useDispatch();
  const attributes = table.getColumns();
  let count = 0;
  const referencesTableList: string[] = [];
  const { user: loggedInUser }: AuthState = useSelector((state: RootState) => state.auth);
  attributes?.map((attribute) => {
    //checks for references table and referenced table
    if (attribute.references_table != "null" && attribute.references_table != null) {
      count = count + 1;
      referencesTableList.push(attribute.references_table + ":references");
    }
    if (attribute.referenced_table != "null" && attribute.referenced_table != null) {
      const tables = attribute.referenced_table.split(',');
      tables.forEach(table => {

        count = count + 1;
        referencesTableList.push(table.trim() + ":referenced");

      });
    }
    else {
      count = count + 0;
    }
  });
  //if there are no references or referenced tables
  if (count == 0) {
    return (<></>)
  }
  else {
    //if there are references or referenced tables
    const defaultRow = new Row({});
    for (let i = -1; i < count - 1; i++) {

      defaultRow[i] = 'none';
    }


    const [SelectInput, setSelectInput] = useState<Row>(() => {
      if (table.lookup_tables == "null") {
        return (defaultRow);
      }
      else {
        const obj = JSON.parse(table.lookup_tables);
        return (obj);
      }

    }
    )


    //button component for when we have multiple references or referenced tables and want more than 1 lookup table
    const MyButtonComponent = ({ buttonIndex }: { buttonIndex: number }) => {
      return (
        <div style={{ marginTop: '2em' }} >

          <FormControl size="small">
            <h6>Lookup Tables</h6>
            <Select onChange={HandleChange(buttonIndex)}
              value={SelectInput[buttonIndex] == undefined ? "error" : SelectInput[buttonIndex]}
              data-testid="lookup-tables-component"
            >
              <MenuItem value={"none"} >None</MenuItem>
              {referencesTableList.map((ref, index) => (
                <MenuItem value={ref} key={index}>
                  {ref}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>
              References means current table references selected table
            </FormHelperText>
          </FormControl>
        </div>
      );
    };


    const [counter, setCounter] = useState(() => {
      return parseInt(table.lookup_counter, 10);
    });

    const setCounterConfig = async (counterValue: number) => {
      const newConfigValue: ConfigData = {
        property: ConfigProperty.LOOKUP_COUNTER,
        table: table.table_name,
        value: counterValue.toString()
      };
      const success = await saveConfigToDB(newConfigValue);
      if (success) {
        table.setLookupCounter(counter.toString())
      }

      Audits.logAudits(
        loggedInUser || "",
        "Lookup Tables",
        "User changed the lookup counter of the table to " + counter.toString(),
        "",
        table.table_name)
    };

    const setSelectInputConfig = async (selectInput: Row) => {
      const objstring = JSON.stringify(selectInput);
      const newConfigValue: ConfigData = {
        property: ConfigProperty.LOOKUP_TABLES,
        table: table.table_name,
        value: objstring,
      };
      const success = await saveConfigToDB(newConfigValue);
      if (success) {
        table.setLookupTables(objstring);
      }

      Audits.logAudits(
        loggedInUser || "",
        "Lookup Tables",
        "User changed the lookup tables of the table to " + objstring,
        "",
        table.table_name)
    };


    //function to handle change in the select input
    const HandleChange = (index: number) => (event: React.ChangeEvent<{ value: unknown }>) => {
      const newSelectInput = {
        ...SelectInput,
        [index]: event.target.value,
      }
      setSelectInput(newSelectInput);
      setSelectInputConfig(newSelectInput);

      Audits.logAudits(
        loggedInUser || "",
        "Lookup Tables",
        "User changed the lookup tables of the table to " + JSON.stringify(newSelectInput),
        "",
        table.table_name)
    };

    //function to handle increase in amount of lookup tables
    const handleButtonClick = async () => {
      if (count - 1 == counter || count == 0) {
        dispatch(displayError("Cannot add more lookup tables"));
      }
      else {
        const newCounterValue = counter + 1;
        setCounter(newCounterValue);
        setCounterConfig(newCounterValue);
      }

      Audits.logAudits(
        loggedInUser || "",
        "Lookup Tables",
        "User added a lookup table to the table",
        "",
        table.table_name)
    };

    const handleButtonClickDelete = async () => {
      if (counter > 0) {
        const newCounterValue = counter - 1;
        setCounter(newCounterValue);
        setCounterConfig(newCounterValue);
        handleReset();
      }
      else {
        setCounter(0);
        setCounterConfig(0);
      }
      Audits.logAudits(
        loggedInUser || "",
        "Lookup Tables",
        "User removed a lookup table from the table",
        "",
        table.table_name)
    };

    const handleReset = async () => {
      const newSelectInput = {
        ...SelectInput,
        [counter - 1]: "none"
      }
      setSelectInput(newSelectInput);
      setSelectInputConfig(newSelectInput);

      Audits.logAudits(
        loggedInUser || "",
        "Lookup Tables",
        "User reset the lookup tables of the table",
        "",
        table.table_name)
    }



    return (
      <div>
        <div className='look-tables'>

          <FormControl style={{ marginRight: '30px' }} size="small">
            <h6>Lookup Tables</h6>
            <Select onChange={HandleChange(-1)}
              value={SelectInput[-1] == undefined ? "error" : SelectInput[-1]}
              data-testid="lookup-tables-initial"
            >
              <MenuItem value={"none"} >None</MenuItem>
              {referencesTableList.map((ref, index) => (
                <MenuItem key={index} value={ref}>
                  {ref}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>
              References means current table references selected table
            </FormHelperText>
          </FormControl>

          <Button
            onClick={handleButtonClick}
            style={buttonStyle}
            data-testid="initial-plus-button"
          >
            +
          </Button>
          <Button
            onClick={handleButtonClickDelete}
            style={buttonStyle}
            data-testid="initial-minus-button"
          >
            -
          </Button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '100px', width: '273.08' }}>
          {[...Array(counter)].map((_, index) => (
            //button component for when we have multiple references or referenced tables and want more than 1 lookup table
            <MyButtonComponent key={index} buttonIndex={index} />

          ))}
        </div>
      </div>
    );
  }
};
export default LookUpTableSetting;


