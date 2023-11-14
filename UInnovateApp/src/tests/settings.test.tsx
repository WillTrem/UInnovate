import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Settings } from "../pages/Settings";
import { MemoryRouter } from "react-router-dom";
import { TablesContextProvider } from "../contexts/TablesContext";

const user = userEvent.setup();

vi.mock("axios");
describe("Test suite for Settings page", () => {
  it("generates 2 navigation options: General and Display", async () => {
    render(
      <MemoryRouter>
        <TablesContextProvider>
          <Settings />
        </TablesContextProvider>
      </MemoryRouter>
    );
    expect(screen.getByText(/General/)).toBeDefined();

    expect(screen.getByTestId(/Settings title/)).toBeDefined();

    expect(screen.getByText(/Display/)).toBeDefined();
  });

  it("generates tables options", async () => {
    await user.click(screen.getByRole("link", { name: "display button" }));

    // const tables: TableVisibilityType = { customers: true };

    // render(
    //   <TableVisibilityContext.Provider
    //     value={{
    //       tableVisibility: tables,
    //       setTableVisibility: useTableVisibility,
    //     }}
    //     children={undefined}
    //   ></TableVisibilityContext.Provider>
    // );

    expect(
      screen.getByRole("heading", { name: "list of tables" })
    ).toBeDefined();

    // expect(screen.getByRole("listitem", { name: "customers" })).toBeDefined();
  });
});
