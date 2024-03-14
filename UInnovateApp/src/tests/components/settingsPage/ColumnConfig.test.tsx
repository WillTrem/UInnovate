import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect } from "vitest";
import { ColumnConfig } from "../../../components/settingsPage/ColumnConfig";
import VMD, { ColumnMock } from "../../../virtualmodel/__mocks__/VMD";

describe("ColumnConfig component", () => {
  const column = new ColumnMock("Column1");
  const table = new VMD.getTable("Table1");
  table.addColumn(column, "", false, "");

  it("renders the component", () => {
    render(
        <ColumnConfig table={table} />
    );
  }),
    it("modifies the config on visibility toggle", async () => {
      // Arrange
      render(
          <ColumnConfig table={table} />
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
