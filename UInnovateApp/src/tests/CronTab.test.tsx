import * as platformFunctions from '../virtualmodel/PlatformFunctions';
import { describe, it, expect } from "vitest";
import { render, waitFor, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { Middleware, Store } from "@reduxjs/toolkit";
import { CronJobsTab } from "../components/settingsPage/CronJobsTab";
import { Role } from "../redux/AuthSlice";
import { formatDuration } from '../components/settingsPage/CronJobsTab';


describe("CronJobsTab successful component", () => {
    beforeEach(() => {
        // Common mocks for multiple tests
        vi.mock('../virtualmodel/PlatformFunctions', () => ({
            fetchFunctionNames: vi.fn().mockResolvedValue(['procedure1', 'procedure2', 'procedure3']),
            scheduleProcedure: vi.fn(()=> Promise.resolve("Mocked schedule success")), // Mock scheduleProcedure without implementation
            unscheduleProcedure: vi.fn(()=> Promise.resolve("Mocked unschedule success")), // Mock unscheduleProcedure without implementation
        }));
      });
      
    const initialState = {
        schema: { schema_name: "application", value: "app_rentals" }, 
        auth: { dbRole: Role.ADMIN, schemaRoles: {}, user: "admin", token: "token", schema_access: ['mock schema name']},
        procedures: { procedures: ["the", "test"] }
    };
    const middlewares: Middleware[] = [];
    const mockStore = configureStore(middlewares);
    const store: Store = mockStore(initialState);

    it("renders the component", () => {
        render(
            <Provider store={store}>
                <CronJobsTab />
            </Provider>
        );
    });

   
    it("schedules a cron job when the Schedule Job button is clicked", async () => {
        const initialState = {
            schema: { schema_name: "application", value: "app_rentals" }, 
            auth: { dbRole: Role.ADMIN, schemaRoles: {}, user: "admin", token: "token", schema_access: ['mock schema name']},
            procedures: { procedures: ["the", "test"] }
        };
        const middlewares: Middleware[] = [];
        const mockStore = configureStore(middlewares);
        const store: Store = mockStore(initialState);
        const mockFetchFunctionNames = vi.fn().mockResolvedValue(['procedure1', 'procedure2', 'procedure3']);
        vi.spyOn(platformFunctions, 'fetchFunctionNames').mockImplementation(mockFetchFunctionNames);

        const { getByText } = render(
            <Provider store={store}>
                <CronJobsTab />
            </Provider>
        );

        await waitFor(() => screen.getByText('Schedule Job'));
        const scheduleButton = getByText('Schedule Job');
        fireEvent.change(screen.getByPlaceholderText('* * * * *'), { target: { value: '0 * * * *' } });
        const selectElement = screen.getByRole('combobox', { name: 'Default select example' });
        fireEvent.change(selectElement, { target: { value: 'procedure1' } });
        fireEvent.click(scheduleButton);

        // Assert the function was called with the expected arguments
        expect(platformFunctions.scheduleProcedure).toHaveBeenCalledWith({
        cron_schedule: "0 * * * *",
        functionName: "schedule_job_by_name",
        stored_procedure: "procedure1",
        });
        mockFetchFunctionNames.mockRestore();
        vi.restoreAllMocks()
    });
    it("unschedules a cron job when the Unschedule Job button is clicked", async () => {
        const mockFetchFunctionNames = vi.fn().mockResolvedValue(['procedure1', 'procedure2', 'procedure3']);
        vi.spyOn(platformFunctions, 'fetchFunctionNames').mockImplementation(mockFetchFunctionNames);

        const { getByText } = render(
            <Provider store={store}>
                <CronJobsTab />
            </Provider>
        );

        await waitFor(() => screen.getByText('Unschedule Job'));

        const unscheduleButton = getByText('Unschedule Job');

        fireEvent.click(unscheduleButton);

        expect(platformFunctions.unscheduleProcedure).toHaveBeenCalledWith({
        functionName: "unschedule_job_by_name",
        stored_procedure: "procedure1",
        });
        vi.restoreAllMocks()
    });
      
});

describe("CronJobsTab unsuccessful component", () => {
    beforeEach(() => {
       
        vi.mock('../../virtualmodel/PlatformFunctions', () => ({
            fetchFunctionNames: vi.fn().mockRejectedValue(new Error('Error fetching function names')),
            scheduleProcedure: vi.fn().mockRejectedValue(new Error('Error scheduling cron job')),
            unscheduleProcedure: vi.fn().mockRejectedValue(new Error('Error unscheduling cron job')),
          }));
      });
    const initialState = {
        schema: { schema_name: "application", value: "app_rentals" }, 
        auth: { dbRole: Role.ADMIN, schemaRoles: {}, user: "admin", token: "token", schema_access: ['mock schema name']},
        procedures: { procedures: ["hay", "yo"] }
    };
    const middlewares: Middleware[] = [];
    const mockStore = configureStore(middlewares);
    const store: Store = mockStore(initialState);
    it('logs an error and does not set procedures if fetching function names fails', async () => {
        render(
            <Provider store={store}>
                <CronJobsTab />
            </Provider>
        );
        await waitFor(() => {
            expect(screen.queryByText("You don't have access to any tables.")).toBeInTheDocument();
          });
        vi.restoreAllMocks();
      });
/*      it('logs an error when scheduling a cron job fails', async () => {
        
        // Spy on console.error
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        const mockFetchFunctionNames = vi.fn().mockResolvedValue(['procedure1', 'procedure2', 'procedure3']);
        vi.spyOn(platformFunctions, 'fetchFunctionNames').mockImplementation(mockFetchFunctionNames);

        const { getByText } = render(
            <Provider store={store}>
                <CronJobsTab />
            </Provider>
        );
      
        // Simulate user actions...
        await waitFor(() => screen.getByText('Schedule Job'));
        fireEvent.change(screen.getByPlaceholderText('* * * * *'), { target: { value: '' } });

        fireEvent.click(screen.getByText('Schedule Job'));
      
        await waitFor(() => expect(platformFunctions.scheduleProcedure).toHaveBeenCalled());
      
        // Check if console.error was called with the expected message
        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("Error scheduling cron job"));
          });
        // Clean up
        consoleSpy.mockRestore();
        vi.restoreAllMocks();

      });
      */
});

describe('formatDuration', () => {
    it('returns N/A for non-numeric input', () => {
      expect(formatDuration('N/A')).toBe('N/A');
    });
  
    it('formats milliseconds into a time string correctly', () => {
      // 1 hour, 30 minutes, and 45 seconds in milliseconds
      const duration = (1 * 60 * 60 + 30 * 60 + 45) * 1000;
      expect(formatDuration(duration)).toBe('01:30:45');
    });

  });