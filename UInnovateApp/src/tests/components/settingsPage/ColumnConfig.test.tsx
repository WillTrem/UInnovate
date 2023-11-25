import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect } from "vitest";
import { ConfigProvider } from "../../../contexts/ConfigContext";
import { ColumnConfig } from "../../../components/settingsPage/ColumnConfig";
import { Table } from "../../../virtualmodel/VMD";

vi.mock("axios");
vi.mock("../../../virtualmodel/VMD");
vi.mock("../../../virtualmodel/DataAccessor");

describe("ColumnConfig component", () => {
  const table = new Table("Table1");
  it("renders the component", () => {
    render(
      <ConfigProvider>
        <ColumnConfig table={table} />
      </ConfigProvider>
    );
  }),
    it("modifies the config on visibility toggle", async () => {
      // Arrange
      render(
        <ConfigProvider>
          <ColumnConfig table={table} />
        </ConfigProvider>
      );

      // Act - toggle the visibility off for the first column
      fireEvent.click(screen.getAllByRole("checkbox")[0]);

      // Assert
      await waitFor(() => {
        const updatedToggle = screen.getAllByRole(
          "checkbox"
        )[0] as HTMLInputElement;
        expect(updatedToggle.checked).toBeTruthy();
      });
    });
});
