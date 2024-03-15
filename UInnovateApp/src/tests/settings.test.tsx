import { describe, it, vi } from "vitest";
import TestRenderer from "react-test-renderer";
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
    auth: { dbRole: Role.ADMIN, schemaRoles: {}, user: "admin", token: "token", schema_access: ['mock schema name'] },
    userData: {
      users: [{ email: "mockuser123@test.com", role: "user", schema_access: ["mock schema name"], schemaRoles: {} },
      { email: "mockAdmin@test.com", role: "administrator", schema_access: ["mock schema name"], schemaRoles: {} },
      { email: "mockConfigurator@test.com", role: "configurator", schema_access: ["mock schema name"], schemaRoles: {} }]
    }
  };
  const middlewares: Middleware[] = [];
  const mockStore = configureStore(middlewares);
  let store;

  it("tests the children inside settings page", async () => {
    store = mockStore(initialState);
    const testRenderer = TestRenderer.create(
      <MemoryRouter>
          <Provider store={store}>
            <Settings />
          </Provider>
      </MemoryRouter>
    );

    const testInstance = await testRenderer.root;
    expect(testInstance.findByType(Settings)).to.be.ok;
  });
});
