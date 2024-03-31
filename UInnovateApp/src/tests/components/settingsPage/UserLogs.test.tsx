import UserLogs from '../../../components/settingsPage/UserLogs';
import { render, screen, waitFor } from '@testing-library/react';
import {describe, expect} from 'vitest';

describe('UserLogs component', () => {
    it('renders the UserLogs component', async () => {
        render(<UserLogs />);
        await waitFor(() => {
            expect(screen.getByText('ID')).toBeInTheDocument();
            expect(screen.getByText('Timestamp')).toBeInTheDocument();
            expect(screen.getByText('User')).toBeInTheDocument();
        });
    });
});