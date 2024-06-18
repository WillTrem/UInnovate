import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import '@fullcalendar/daygrid'; 
import '@fullcalendar/timegrid';

import { DataAccessor, Row } from '../virtualmodel/DataAccessor'; 
import vmd from '../virtualmodel/VMD'; 

interface Scheduled {
  id: number;
  tool_id: number;
  start_date: string;
  end_date: string;
  tool_name: string;
}
interface UnitScheduler {
  unit_id: number;
  unavailable_start_date: string;
  unavailable_end_date: string;
  availability_status_id: number;
}

const CustomCalendar: React.FC = () => {
  const [rentals, setRentals] = useState<Scheduled[]>([]);

  useEffect(() => {
    console.log('useEffect triggered'); 

    const fetchRentals = async () => {
      try {
        const schema = vmd.getSchema('app_rentals');
        console.log('Fetched schema:', schema);

        // const scheduledToolsTable = vmd.getTable('app_rentals', 'available_tools');
        const toolTable = vmd.getTable('app_rentals', 'tool');
        const unitSchedTable = vmd.getTable('app_rentals', 'unit_scheduler');

        
        if (!schema) {
          console.error('Schema not found');
          return;
        }

        console.log('Tables found:', unitSchedTable, toolTable);

        if (schema && unitSchedTable && toolTable) {
          const scheduledToolsDataAccessor: DataAccessor = vmd.getRowsDataAccessor(schema.schema_name, unitSchedTable.table_name);
          const scheduledToolRows: Row[] = (await scheduledToolsDataAccessor.fetchRows()) || [];
          console.log('Available Tool Rows:', scheduledToolRows);

          const toolDataAccessor: DataAccessor = vmd.getRowsDataAccessor(schema.schema_name, toolTable.table_name);
          const toolRows: Row[] = (await toolDataAccessor.fetchRows()) || [];
          console.log('Tool Rows:', toolRows);

          if (scheduledToolRows.length > 0 && toolRows.length > 0) {
            const scheduledTools: UnitScheduler[] = scheduledToolRows as UnitScheduler[];
            console.log('Cast available tool rows to UnitScheduler:', scheduledTools);

            const filteredscheduledTools = scheduledTools.filter((tool: UnitScheduler) => tool.availability_status_id === 3);
            console.log('Filtered Available Tools:', filteredscheduledTools);

            
            const rentalsWithToolNames = filteredscheduledTools.map((scheduledTool: UnitScheduler) => {
              console.log('Processing availableTool:', scheduledTool);
              const unit = toolRows.find((tool: Row) => {
                console.log('Checking tool_id:', tool.tool_id, 'against scheduledTool tool_id:', scheduledTool.unit_id);
                return tool.tool_id === scheduledTool.unit_id;
              });
             
              console.log('Checking tool:', scheduledTool.unit_id, 'Found unit:', unit);

              if (unit) {
                return {
                  id: scheduledTool.unit_id,
                  tool_id: scheduledTool.unit_id,
                  start_date: scheduledTool.unavailable_start_date,
                  end_date: scheduledTool.unavailable_start_date,
                  tool_name: unit.tool_id,
                };
              } else {
                console.log('Tool not found for scheduledTool:', scheduledTool);
                return null;
              }
            }).filter(rental => rental !== null) as Scheduled[];

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
    className: 'fc-event-light-red'
  }));

  console.log('Events:', events);

  return (
    <div>
      <style>
        {`
          .fc-event-light-red {
            background-color: lightcoral !important;
            color: white !important; 
          }
        `}
      </style>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
        initialView="dayGridMonth"
        events={events}
      />
    </div>
  );
};

export default CustomCalendar;