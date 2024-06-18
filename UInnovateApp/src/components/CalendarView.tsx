// CustomCalendar.tsx
import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import '@fullcalendar/daygrid'; 
import '@fullcalendar/timegrid';

import { DataAccessor, Row } from '../virtualmodel/DataAccessor'; 
import vmd from '../virtualmodel/VMD'; 

interface Rental {
  id: number;
  tool_id: number;
  start_date: string;
  end_date: string;
  tool_name: string;
}


const CustomCalendar: React.FC = () => {
  const [rentals, setRentals] = useState<Rental[]>([]);

  useEffect(() => {
    console.log('useEffect triggered'); // Initial log to confirm effect is running

    const fetchRentals = async () => {
      try {
        const schema = vmd.getSchema('app_rentals');
        console.log('Fetched schema:', schema);

        const availableToolsTable = vmd.getTable('app_rentals', 'available_tools');
        const toolTable = vmd.getTable('app_rentals', 'tool');
        //           const unitSchedTable = vmd.getTable('app_rentals', 'unit_scheduler');

        
        if (!schema) {
          console.error('Schema not found');
          return;
        }

        console.log('Tables found:', availableToolsTable, toolTable);

        if (schema && availableToolsTable && toolTable) {
          const availableToolsDataAccessor: DataAccessor = vmd.getRowsDataAccessor(schema.schema_name, availableToolsTable.table_name);
          const availableToolRows: Row[] = (await availableToolsDataAccessor.fetchRows()) || [];
          console.log('Available Tool Rows:', availableToolRows);

          const toolDataAccessor: DataAccessor = vmd.getRowsDataAccessor(schema.schema_name, toolTable.table_name);
          const toolRows: Row[] = (await toolDataAccessor.fetchRows()) || [];
          console.log('Tool Rows:', toolRows);

          if (availableToolRows.length > 0 && toolRows.length > 0) {
            const availableTools: AvailableTool[] = availableToolRows as AvailableTool[];
            console.log('Cast available tool rows to AvailableTool:', availableTools);

            const filteredAvailableTools = availableTools.filter((tool: AvailableTool) => tool.availability_status_id === 1);
            console.log('Filtered Available Tools:', filteredAvailableTools);

            const rentalsWithToolNames = filteredAvailableTools.map((availableTool: AvailableTool) => {
              const tool = toolRows.find((tool: Row) => tool.id === availableTool.tool_id);

              if (tool) {
                return {
                  id: availableTool.tool_id,
                  tool_id: availableTool.tool_id,
                  start_date: availableTool.available_start_date,
                  end_date: availableTool.available_end_date,
                  tool_name: tool.name,
                };
              } else {
                console.log('Tool not found for availableTool:', availableTool);
                return null;
              }
            }).filter(rental => rental !== null) as Rental[];

            console.log('Rentals With Tool Names:', rentalsWithToolNames);
            setRentals(rentalsWithToolNames);
          } else {
            console.log('No available tool rows or tool rows found');
          }
        } else {
          console.error('Schema or tables not found');
        }
      } catch (error) {
        console.error('Error fetching rentals:', error);
      }
    };

    fetchRentals();
  }, []);

  useEffect(() => {
    console.log('Rentals state updated:', rentals);
  }, [rentals]);

  const events = rentals.map(rental => ({
    title: rental.tool_name,
    start: rental.start_date,
    end: rental.end_date,
  }));

  console.log('Events:', events);

  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
      initialView="dayGridMonth"
      events={events}
    />
  );
};

export default CustomCalendar;