import AuditTrails from '../../../components/settingsPage/AuditTrails';
import { render, screen, waitFor } from '@testing-library/react';
import {describe, expect} from 'vitest';

describe('AuditTrails component', () => {
    it('renders the AuditTrails component', async () => {
        render(<AuditTrails />);
        await waitFor(() => {
            expect(screen.getByText('ID')).toBeInTheDocument();
            expect(screen.getByText('Timestamp')).toBeInTheDocument();
            expect(screen.getByText('User')).toBeInTheDocument();
        });
    });
});