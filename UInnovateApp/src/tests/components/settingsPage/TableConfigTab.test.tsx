import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ReactNode } from "react";
import { describe, expect } from "vitest";
import { ConfigProvider } from "../../../contexts/ConfigContext";
import { TableItem } from "../../../components/settingsPage/TableConfigTab";
import VMD from "../../../virtualmodel/__mocks__/VMD";

vi.mock("../../../virtualmodel/Config");
vi.mock("../../../contexts/ConfigContext", () => ({
  ConfigProvider: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  useConfig: () => ({
    updateConfig: vi.fn(),
  }),
}));

describe("TableItem component", () => {
  const table = new VMD.Table("Mock Table");

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
      const checkbox = await screen.findByTestId("visibility-switch");
      fireEvent.click(checkbox);

      // Assert
      await waitFor(() => {
        const updatedToggle = screen.getByTestId(
          "visibility-switch"
        ) as HTMLInputElement;
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
          target: { value: VMD.TableDisplayType.enumView },
        });
      }

      // Assert
      await waitFor(() => {
        expect(table.getDisplayType()).toEqual(VMD.TableDisplayType.enumView);
      });
    });
});
