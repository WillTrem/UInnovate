// CustomCalendar.tsx
import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import '@fullcalendar/daygrid';
import '@fullcalendar/timegrid';
import { DataAccessor, Row } from '../virtualmodel/DataAccessor'; // Adjust path as necessary
import vmd from '../virtualmodel/VMD'; // Adjust path as necessary

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
    const fetchRentals = async () => {
      const schema = vmd.getSchema('public'); // Adjust schema name if necessary
      const rentalTable = vmd.getTable('public', 'rentals'); // Adjust table name if necessary

      if (schema && rentalTable) {
        const dataAccessor: DataAccessor = vmd.getRowsDataAccessor(schema.schema_name, rentalTable.table_name);
        const rentalRows = await dataAccessor.fetchRows();

        const toolTable = vmd.getTable('public', 'tools'); // Adjust table name if necessary
        const toolDataAccessor: DataAccessor = vmd.getRowsDataAccessor(schema.schema_name, toolTable.table_name);
        const toolRows = await toolDataAccessor.fetchRows();

        const rentalsWithToolNames = rentalRows.map((rental: Row) => {
          const tool = toolRows.find((tool: Row) => tool.id === rental.tool_id);
          return {
            ...rental,
            tool_name: tool ? tool.name : 'Unknown Tool',
          };
        });

        setRentals(rentalsWithToolNames);
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