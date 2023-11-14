import { describe, it, vi } from "vitest";
import TestRenderer from "react-test-renderer";
import { MemoryRouter } from "react-router-dom";
import { Settings } from "../pages/Settings";
import { TablesContextProvider } from "../contexts/TablesContext";
import { ConfigProvider } from "../contexts/ConfigContext";

vi.mock("axios");
describe("Settings.tsx", () => {
    it("tests the children inside settings page", () => {
        const settings = TestRenderer.create(
            <MemoryRouter>
                <TablesContextProvider>
                    <ConfigProvider>
                        <Settings />
                    </ConfigProvider>
                </TablesContextProvider>
            </MemoryRouter>
        ).toJSON;
        console.log(settings);
    });
});
