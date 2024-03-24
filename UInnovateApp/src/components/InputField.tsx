import React, { FC, ChangeEvent, useRef, useState, CSSProperties } from 'react';
import { Column, Table } from '../virtualmodel/VMD';
import { Row } from '../virtualmodel/DataAccessor';
import { ConfigProperty } from '../virtualmodel/ConfigProperties';
import { Switch, Select } from '@mui/material';
import { LocalizationProvider, DatePicker, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import StarterKit from '@tiptap/starter-kit';
import { MuiTelInput } from 'mui-tel-input';
import { RichTextEditor, MenuControlsContainer, MenuSelectHeading, MenuDivider, MenuButtonBold, MenuButtonItalic, RichTextEditorRef } from 'mui-tiptap';
import { ThemeProvider } from 'react-bootstrap';
import { CategoriesDisplayType } from '../virtualmodel/Config';
import dayjs from "dayjs";



interface InputFieldProps {
  column: Column;
  table: Table;
  appConfigValues: Row[];
  currentRow: Row;
  setInputValues: React.Dispatch<React.SetStateAction<Row>>;
  setCurrentPrimaryKey: React.Dispatch<React.SetStateAction<string>>;
}

const InputField: FC<InputFieldProps> = ({ column, table, appConfigValues, currentRow, setInputValues, setCurrentPrimaryKey }) => {
    const [currentWYSIWYG, setCurrentWYSIWYG] = useState<string>("");
    const [currentCategory, setCurrentCategory] = useState<string>("");
    const [currentPhone, setCurrentPhone] = useState<string>("");

    const inputStyle: CSSProperties = {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      width: table.stand_alone_details_view ? "80%" : "120%",
    };
    
    const rteRef = useRef<RichTextEditorRef>(null);
    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        columnName: string | undefined,
        type: string | undefined
      ) => {
        const nonEditableColumn = table.columns.find(
          (column) => column.is_editable === false
        );
        if (nonEditableColumn) {
          setCurrentPrimaryKey(nonEditableColumn.column_name);
        }
        let eventName: string | undefined = undefined;
        let eventValue: string | undefined = undefined;
        if (event?.target?.name !== undefined && event?.target?.name !== "") {
          eventName = event.target.name;
          eventValue = event.target.value;
        } else {
          if (type !== undefined) {
            eventName = columnName;
            eventValue = event;
          } else if (type == "phone" || type == "date") {
            eventName = columnName;
            eventValue = event.format();
          } else {
            eventName = columnName;
            eventValue = event.target.value;
          }
        }
    
        setInputValues((prevInputValues) => ({
          ...prevInputValues,
          [eventName as string]: eventValue,
        }));
      };

    if (!appConfigValues) {
        return null;
      }
      const columnDisplayType = appConfigValues?.find(
        (element) =>
          element.column == column.column_name &&
          element.table == table.table_name &&
          element.property == ConfigProperty.COLUMN_DISPLAY_TYPE
      );

      if (
        !columnDisplayType ||
        columnDisplayType.value == "text" ||
        columnDisplayType.value == "email"
      ) {
        return (
          <input
            readOnly={column.is_editable === false ? true : false}
            placeholder={String(currentRow?.row[column.column_name]) || ""}
            name={column.column_name}
            type="text"
            style={inputStyle}
            onChange={handleInputChange}
          />
        );
      } else if (columnDisplayType.value == "number") {
        return (
          <input
            type="number"
            name={column.column_name}
            readOnly={column.is_editable === false ? true : false}
            placeholder={String(currentRow.row[column.column_name]) || ""}
            style={inputStyle}
            onChange={handleInputChange}
          />
        );
      } else if (columnDisplayType.value == "longtext") {
        return (
          <textarea
            readOnly={column.is_editable === false ? true : false}
            placeholder={String(currentRow.row[column.column_name]) || ""}
            name={column.column_name}
            type="text"
            style={inputStyle}
            onChange={handleInputChange}
          />
        );
      } else if (columnDisplayType.value == "boolean") {
        return (
          <Switch
            checked={
              currentRow?.row[column.column_name] == "true"
                ? true
                : false || false
            }
            name={column.column_name}
          />
        );
      } else if (columnDisplayType.value == "date") {
        return (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <ThemeProvider theme={theme}>
              <DatePicker
                value={dayjs(currentRow.row[column.column_name])}
                onChange={(date) =>
                  handleInputChange(date, column.column_name, "date")
                }
                name={column.column_name}
                className="date-time-picker"
                readOnly={column.is_editable === false ? true : false}
              />
            </ThemeProvider>
          </LocalizationProvider>
        );
      } else if (columnDisplayType.value == "datetime") {
        return (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <ThemeProvider theme={theme}>
              <DateTimePicker
                value={dayjs(currentRow.row[column.column_name])}
                onChange={(date) =>
                  handleInputChange(date, column.column_name, "date")
                }
                name={column.column_name}
                className="date-time-picker"
                readOnly={column.is_editable === false ? true : false}
              />
            </ThemeProvider>
          </LocalizationProvider>
        );
      } else if (columnDisplayType.value == "categories") {
        return (
          <Select
            value={
              currentCategory
                ? currentCategory
                : currentRow.row[column.column_name]
            }
            name={column.column_name}
            onChange={(event) => {
              handleInputChange(event, column.column_name, undefined);
              setCurrentCategory(event.target.value);
            }}
            native
            className="width"
          >
            {Object.keys(CategoriesDisplayType).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </Select>
        );
      } else if (columnDisplayType.value == "phone") {
        return (
          <MuiTelInput
            value={
              currentPhone !== "" || currentPhone
                ? currentPhone
                : currentRow.row[column.column_name]
            }
            onChange={(phone) => {
              handleInputChange(phone, column.column_name, "phone");
              setCurrentPhone(phone);
            }}
            name={column.column_name}
          />
        );
      } else if (columnDisplayType.value == "currency") {
        return (
          <input
            type="number"
            name={column.column_name}
            readOnly={column.is_editable === false ? true : false}
            placeholder={String(currentRow.row[column.column_name]) || ""}
            style={inputStyle}
            onChange={handleInputChange}
          />
        );
      } else if (columnDisplayType.value == "multiline_wysiwyg") {
        return (
          <RichTextEditor
            name={column.column_name}
            content={
              currentWYSIWYG
                ? currentWYSIWYG
                : currentRow.row[column.column_name]
            }
            onChange={(event) => {
              handleInputChange(event, column.column_name, undefined);
              rteRef.current?.editor.setContent(event);
            }}
            ref={rteRef}
            extensions={[StarterKit]} // Or any Tiptap extensions you wish!
            // Optionally include `renderControls` for a menu-bar atop the editor:
            renderControls={() => (
              <MenuControlsContainer>
                <MenuSelectHeading />
                <MenuDivider />
                <MenuButtonBold />
                <MenuButtonItalic />
                {/* Add more controls of your choosing here */}
              </MenuControlsContainer>
            )}
          />
        );
      }
}

export default InputField;