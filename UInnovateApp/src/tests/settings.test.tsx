import { describe, it, vi } from "vitest";
import TestRenderer from "react-test-renderer";
import { MemoryRouter } from "react-router-dom";
import { Settings } from "../pages/Settings";
import { ConfigProvider } from "../contexts/ConfigContext";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";

vi.mock("axios");
vi.mock("../virtualmodel/VMD");
vi.mock("../virtualmodel/DataAccessor");
vi.mock("../NavBar");

describe("Settings.tsx", () => {
  const initialState = { schema: "application" };
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;

  it("tests the children inside settings page", () => {
    store = mockStore(initialState);
    const settings = TestRenderer.create(
      <MemoryRouter>
        <ConfigProvider>
          <Provider store={store}>
            <Settings />
          </Provider>
        </ConfigProvider>
      </MemoryRouter>
    ).toJSON;
  });
});
