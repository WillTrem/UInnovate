import { render, fireEvent, screen } from '@testing-library/react';
import LookUpTable from '../../../components/settingsPage/LookupSetting';
import { ConfigProvider } from '../../../contexts/ConfigContext';

describe('LookUpTable', () => {
    const tableMock = {
      getColumns: () => [
        { references_table: 'RefTable1' },
        { references_table: 'RefTable2' },
      ],
    };
  
    it('renders correctly', () => {
      render(
        <ConfigProvider>
            <LookUpTable table={tableMock as any} />
        </ConfigProvider>
        );
      expect(screen.getByText('Lookup Tables')).toBeInTheDocument();
      expect(screen.getByText('None')).toBeInTheDocument();
      expect(screen.getByText('RefTable1')).toBeInTheDocument();
      expect(screen.getByText('RefTable2')).toBeInTheDocument();
    });
  
    it('increments counter when + button is clicked', () => {
      render(
        <ConfigProvider>
            <LookUpTable table={tableMock as any} />
        </ConfigProvider>
        );
      fireEvent.click(screen.getByText('+'));
      expect(screen.getByText('RefTable1')).toBeTruthy();
    });
  
    it('decrements counter when - button is clicked', () => {
      render(
      <ConfigProvider>
        <LookUpTable table={tableMock as any} />
      </ConfigProvider>
        );
      fireEvent.click(screen.getByText('+')); // Increment to ensure there's something to decrement
      fireEvent.click(screen.getByText('-'));
      expect(screen.queryByText('RefTable1')).toBeNull();
    });
  
  });