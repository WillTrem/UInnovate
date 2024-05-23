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

interface UnitScheduler {
  unit_id: number;
  unavailable_start_date: string;
  unavailable_end_date: string;
  availability_status_id: number;
}

const CustomCalendar: React.FC = () => {
  const [rentals, setRentals] = useState<Rental[]>([]);

  useEffect(() => {
    const fetchRentals = async () => {
      const schema = vmd.getSchema('app_rentals'); // Adjust schema name if necessary (for other use cases)
      const rentalTable = vmd.getTable('app_rentals', 'rentals'); 
      const toolTable = vmd.getTable('app_rentals', 'tools'); 
      const unitSchedTable = vmd.getTable('app_rentals', 'unit_scheduler'); 
      if (schema && rentalTable && toolTable && unitSchedTable) {
        const rentalDataAccessor: DataAccessor = vmd.getRowsDataAccessor(schema.schema_name, rentalTable.table_name);
        const rentalRows = await rentalDataAccessor.fetchRows();

        const toolDataAccessor: DataAccessor = vmd.getRowsDataAccessor(schema.schema_name, toolTable.table_name);
        const toolRows = await toolDataAccessor.fetchRows();

        const schedulerDataAccessor: DataAccessor = vmd.getRowsDataAccessor(schema.schema_name, unitSchedTable.table_name);
        const schedulerRows = await schedulerDataAccessor.fetchRows();

        if (rentalRows && toolRows && schedulerRows) {
          // Cast fetched rows to their appropriate types
          const schedulerData: UnitScheduler[] = schedulerRows as UnitScheduler[];

          // Filter available tools using unit scheduler data
          const availableTools = schedulerData.filter((scheduler: UnitScheduler) => scheduler.availability_status_id === 1);

          // Map rentals with tool names and filter based on availability
          const rentalsWithToolNames = rentalRows.map((rental: Row) => {
            const tool = toolRows.find((tool: Row) => tool.id === rental.tool_id);
            const isAvailable = availableTools.some((scheduler: UnitScheduler) =>
              scheduler.unit_id === rental.tool_id &&
              !(
                new Date(rental.start_date) >= new Date(scheduler.unavailable_start_date) &&
                new Date(rental.end_date) <= new Date(scheduler.unavailable_end_date)
              )
            );



            if (tool && isAvailable) {
              return {
                id: rental.id,
                tool_id: rental.tool_id,
                start_date: rental.start_date,
                end_date: rental.end_date,
                tool_name: tool.name,
              };
            } else {
              return null;
            }
          }).filter(rental => rental !== null) as Rental[];

          setRentals(rentalsWithToolNames);
        }
      }
    };

    fetchRentals();
  }, []);

  const events = rentals.map(rental => ({
    title: rental.tool_name,
    start: rental.start_date,
    end: rental.end_date,
  }));

  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
      initialView="dayGridMonth"
      events={events}
    />
  );
};

export default CustomCalendar;
