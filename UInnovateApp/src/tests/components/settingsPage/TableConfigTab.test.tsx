import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect } from "vitest";
import { ConfigProvider } from "../../../contexts/ConfigContext";
import { TableItem } from "../../../components/settingsPage/TableConfigTab";
import { TablesContextProvider } from "../../../contexts/TablesContext";
import { TableDisplayType } from "../../../virtualmodel/Tables";

vi.mock("axios");

describe("TableItem component", () => {
  it("renders the component", () => {
    render(
      <TablesContextProvider>
        <ConfigProvider>
          <TableItem
            tableName="table1"
            isVisible={true}
            toggleVisibility={() => {}}
          />
        </ConfigProvider>
      </TablesContextProvider>
    );
  }),
    it("modifies the config on visibility toggle", async () => {
      // Arrange
      render(
        <TablesContextProvider>
          <ConfigProvider>
            <TableItem
              tableName="table1"
              isVisible={true}
              toggleVisibility={() => {}}
            />
          </ConfigProvider>
        </TablesContextProvider>
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
        <TablesContextProvider>
          <ConfigProvider>
            <TableItem
              tableName="table1"
              isVisible={true}
              toggleVisibility={() => {}}
            />
          </ConfigProvider>
        </TablesContextProvider>
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
