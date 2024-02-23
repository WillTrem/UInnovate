import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect } from "vitest";
import { ConfigProvider } from "../../../contexts/ConfigContext";
import { ColumnConfig } from "../../../components/settingsPage/ColumnConfig";
import VMD from "../../../virtualmodel/__mocks__/VMD";

describe("ColumnConfig component", () => {
  const column = new VMD.Column("Column1");
  const table = new VMD.Table("Table1");
  table.addColumn(column, "", false, "");

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
      fireEvent.click(screen.getAllByTestId("visibility-switch")[0]);

      // Assert
      await waitFor(() => {
        const updatedToggle = screen.getAllByRole(
          "checkbox"
        )[0] as HTMLInputElement;
        expect(updatedToggle.checked).toBeTruthy();
      });
    });
});
