import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Settings } from "../pages/Settings";
import { MemoryRouter } from "react-router-dom";
import { TablesContextProvider } from "../contexts/TablesContext";
import configureStore from 'redux-mock-store'
import { Provider } from "react-redux";

const user = userEvent.setup();

vi.mock("axios");
describe("Settings.tsx", () => {
    const initialState = {schema:"application"}
    const middlewares = [];
    const mockStore = configureStore(middlewares);
    let store;

    it("tests the children inside settings page", () => {
        store = mockStore(initialState)
        const settings = TestRenderer.create(
            <MemoryRouter>
                <TablesContextProvider>
                    <Provider store={store}>
                        <Settings />
                    </Provider>
                </TablesContextProvider>
            </MemoryRouter>
        ).toJSON;
        console.log(settings);
    });
});
