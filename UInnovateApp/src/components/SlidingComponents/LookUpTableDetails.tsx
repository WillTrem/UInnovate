import TableComponent from "react-bootstrap/Table";
import vmd, { Table, Column } from "../virtualmodel/VMD";
import { DataAccessor, Row } from "../virtualmodel/DataAccessor";
import React, { useState, useEffect } from "react";
import SlidingPanel from "react-sliding-side-panel";
import "react-sliding-side-panel/lib/index.css";
import { useConfig } from "../contexts/ConfigContext";
import { ConfigProperty } from "../virtualmodel/ConfigProperties";
import { NumericFormat } from "react-number-format";
import { DateField } from "@mui/x-date-pickers/DateField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { Switch, Button, Typography } from "@mui/material";
import AddRowPopup from "./AddRowPopup";
import { as, c, s } from "vitest/dist/reporters-5f784f42.js";
import { current } from "@reduxjs/toolkit";

interface TableListViewProps {
    table: Table;
  }

  const LookUpTableDetails: React.FC<TableListViewProps> = ({table}:TableListViewProps) => {


return ( 
    <>
    </>
);
  }

  export default LookUpTableDetails;