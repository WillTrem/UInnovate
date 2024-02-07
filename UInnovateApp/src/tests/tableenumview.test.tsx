import { render, screen } from '@testing-library/react';
import TableEnumView from '../components/TableEnumView';
import { MemoryRouter } from 'react-router-dom';
import { ConfigProvider } from '../contexts/ConfigContext';

describe('TableEnumView', () => {
  test('renders without crashing', () => {
    render(
        <ConfigProvider>
          <MemoryRouter>
            <TableEnumView   />
          </MemoryRouter>
        </ConfigProvider>
      );
    // Add assertions here
    // For example, if TableEnumView renders a header, you can check for its presence like this:
    // expect(screen.getByRole('heading')).toBeInTheDocument();
  });
});