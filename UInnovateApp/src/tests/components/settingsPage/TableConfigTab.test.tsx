import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Table, TableDisplayType } from "../../../virtualmodel/VMD";
import { describe, expect } from "vitest";
import { ConfigProvider } from "../../../contexts/ConfigContext";
import { TableItem } from "../../../components/settingsPage/TableConfigTab";

console.log("Testing to see if prints work here");
vi.mock("axios");
vi.mock("../../../virtualmodel/VMD");
vi.mock("../../../virtualmodel/DataAccessor");
vi.mock("../../../virtualmodel/Config");
vi.mock("../../../contexts/ConfigContext");

describe("TableItem component", () => {
  const table = new Table("Mock Table");
  it("renders the component", () => {
    render(
      <ConfigProvider>
        <TableItem table={table} />
      </ConfigProvider>
    );
  }),
    it("modifies the config on visibility toggle", async () => {
      // Arrange
      render(
        <ConfigProvider>
          <TableItem table={table} />
        </ConfigProvider>
      );
      // Act - toggle the visibility off
      fireEvent.click(screen.getByRole("checkbox"));

      // Assert
      await waitFor(() => {
        const updatedToggle = screen.getByRole("checkbox") as HTMLInputElement;
        expect(updatedToggle.checked).toBeFalsy();
      });
    }),
    it("modifies the config on DisplayType change", async () => {
      // Arrange
      render(
        <ConfigProvider>
          <TableItem table={table} />
        </ConfigProvider>
      );

      // Act - select Enum View display type
      const inputElement = screen
        .getByTestId("display-type-table-config")
        .querySelector("input");
      if (inputElement) {
        fireEvent.change(inputElement, {
          target: { value: TableDisplayType.enumView },
        });
      }

      // Assert
      await waitFor(() => {
        // Assert
        const updatedDisplayType = screen.getByDisplayValue(
          TableDisplayType.enumView
        );
        expect(updatedDisplayType).toBeInTheDocument();
      });
    });
});
