import { describe, it, vi } from "vitest";
import TestRenderer from "react-test-renderer";
import { MemoryRouter } from "react-router-dom";
import { Settings } from "../pages/Settings";
import { ConfigProvider } from "../contexts/ConfigContext";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";
import "@testing-library/jest-dom";
import { Role } from "../redux/AuthSlice";

vi.mock("../NavBar");

describe("Settings.tsx", () => {
  const initialState = {
    schema: { schema_name: "application" },
    script_table: { table_name: "script_mock" },
    auth: { role: Role.ADMIN, user: "admin", token: "token"}
  };
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;

  it("tests the children inside settings page", async () => {
    store = mockStore(initialState);
    const testRenderer = TestRenderer.create(
      <MemoryRouter>
        <ConfigProvider>
          <Provider store={store}>
            <Settings />
          </Provider>
        </ConfigProvider>
      </MemoryRouter>
    );

    const testInstance = await testRenderer.root;
    expect(testInstance.findByType(Settings)).to.be.ok;
  });
});
