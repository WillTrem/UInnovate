import { describe, it } from "vitest";
import TestRenderer from "react-test-renderer";
import { MemoryRouter } from "react-router-dom";
import { Settings } from "../pages/Settings";

describe("Settings.tsx", () => {
  it("tests the children inside settings page", () => {
    const settings = TestRenderer.create(
      <MemoryRouter>
        <Settings />
      </MemoryRouter>
    ).toJSON;
    console.log(settings);
  });
});
