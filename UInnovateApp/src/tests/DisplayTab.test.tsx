import { describe, it, vi, expect } from "vitest";
import DisplayTab from "../components/settingsPage/DisplayTab";
import { render } from "@testing-library/react";
import { ConfigProvider } from "../contexts/ConfigContext";

describe("DisplayTab component", () => {
  it("renders the component", () => {
    render(
      <ConfigProvider>
        <DisplayTab />
      </ConfigProvider>
    );
  });
  it("shows the list of tables", () => {
    const { getAllByTestId } = render(
      <ConfigProvider>
        <DisplayTab />
      </ConfigProvider>
    );
    const tableNavs = getAllByTestId("table-setting-nav");

    expect(tableNavs.length).toBeGreaterThan(0);
  });
});
