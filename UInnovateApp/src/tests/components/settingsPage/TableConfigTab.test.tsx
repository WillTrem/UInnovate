import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ReactNode } from "react";
import { describe, expect } from "vitest";
import { TableItem } from "../../../components/settingsPage/TableConfigTab";
import VMD from "../../../virtualmodel/__mocks__/VMD";

vi.mock("../../../virtualmodel/Config");

describe("TableItem component", () => {
  const table = new VMD.getTable("Mock Table");

  it("renders the component", () => {
    render(
        <TableItem table={table} />
    );
  }),
    it("modifies the config on visibility toggle", async () => {
      // Arrange
      render(
          <TableItem table={table} />
      );

      // Act - toggle the visibility off
      const checkbox = (await screen.findAllByTestId("visibility-switch"))[0];
      fireEvent.click(checkbox);

      // Assert
      await waitFor(() => {
        const updatedToggle = screen.getAllByTestId(
          "visibility-switch"
        )[0] as HTMLInputElement;
        expect(updatedToggle.checked).toBeFalsy();
      });
    }),
    it("modifies the config on DisplayType change", async () => {
      // Arrange
      render(
          <TableItem table={table} />
      );

      // Act - select Enum View display type
      const inputElement = screen
        .getByTestId("display-type-table-config")
        .querySelector("input");
      if (inputElement) {
        fireEvent.change(inputElement, {
          target: { value: VMD.TableDisplayType.enumView },
        });
      }

      // Assert
      await waitFor(() => {
        expect(table.getDisplayType()).toEqual(VMD.TableDisplayType.enumView);
      });
    });
});
