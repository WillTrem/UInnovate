import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect } from "vitest";
import { ColumnConfig } from "../../../components/settingsPage/ColumnConfig";
import VMD, { ColumnMock } from "../../../virtualmodel/__mocks__/VMD";
import { Provider } from "react-redux";
import store from "../../../redux/Store";

describe("ColumnConfig component", () => {
  const column = new ColumnMock("Column1");
  const table = new VMD.getTable("Table1");
  table.addColumn(column, "", false, "");

  it("renders the component", () => {
    render(
      <Provider store={store}>
        <ColumnConfig table={table} />
      </Provider>
    );
  }),
    it("modifies the config on visibility toggle", async () => {
      // Arrange
      render(
        <Provider store={store}>
          <ColumnConfig table={table} />
        </Provider>
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
