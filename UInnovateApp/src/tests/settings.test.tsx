import { describe, it, vi, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Settings } from "../pages/Settings";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";
import "@testing-library/jest-dom";
import { Role } from "../redux/AuthSlice";
import { Middleware } from "@reduxjs/toolkit";

vi.mock("../NavBar");
vi.mock("../components/settingsPage/UserLogs");
vi.mock("../components/settingsPage/AuditTrails");

describe("Settings.tsx", () => {
  const initialState = {
    schema: { schema_name: "application" },
    script_table: { table_name: "script_mock" },
    auth: {
      dbRole: Role.ADMIN,
      schemaRoles: {},
      user: "admin",
      token: "token",
      schema_access: ["mock schema name"],
    },
    userData: {
      users: [
        {
          email: "mockuser123@test.com",
          role: "user",
          schema_access: ["mock schema name"],
          schemaRoles: {},
        },
        {
          email: "mockAdmin@test.com",
          role: "administrator",
          schema_access: ["mock schema name"],
          schemaRoles: {},
        },
        {
          email: "mockConfigurator@test.com",
          role: "configurator",
          schema_access: ["mock schema name"],
          schemaRoles: {},
        },
      ],
    },
		languageSelection:{
			lang: "en",
  			translations: [
				{
					languageCode:'fr',
					values:[
						{translation_id: 1, language_code: 'fr', key_code: 'settings', value: 'Configuration', is_default: true},
						{translation_id: 4, language_code: 'fr', key_code: 'audit_trails', value: '', is_default: true}]
				},
				{
					languageCode:'en',
					values:[
						{translation_id: 5, language_code: 'en', key_code: 'settings', value: 'Settings', is_default: true},
						{translation_id: 8, language_code: 'en', key_code: 'audit_trails', value: '', is_default: true}]
				}
			]
		}

  };
  const middlewares: Middleware[] = [];
  const mockStore = configureStore(middlewares);
  let store;

  it("tests the children inside settings page", async () => {
    store = mockStore(initialState);

    render(
      <MemoryRouter>
        <Provider store={store}>
          <Settings />
        </Provider>
      </MemoryRouter>
    );
    await vi.waitFor(    ()=>{
      expect(screen.getAllByText("Settings")[1]).toBeInTheDocument();
      expect(screen.getByText("Layout Personalization")).toBeInTheDocument();
      expect(screen.getByText("Tables")).toBeInTheDocument();
      expect(screen.getByText("Cron Jobs")).toBeInTheDocument();
      expect(screen.getAllByText("Users")[1]).toBeInTheDocument();
      expect(screen.getByText("Add Language")).toBeInTheDocument();
      expect(screen.getByText("ADD VIEW")).toBeInTheDocument();
    });
  });
});
