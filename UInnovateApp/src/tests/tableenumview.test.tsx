import { render, screen, act } from "@testing-library/react";
import { vi, expect } from "vitest";
import TableEnumView from "../components/TableEnumView";
import { MemoryRouter } from "react-router-dom";
import { ConfigProvider } from "../contexts/ConfigContext";
import { TableMock, ColumnMock } from "../virtualmodel/__mocks__/VMD";

vi.mock("axios");

describe("TableEnumView", () => {
  it("renders a table with the specified attributes", async () => {
    const table = new TableMock("mock table name");
    const column = new ColumnMock("type");

    table.addColumn(column, "", false, "");
    column.setVisibility(true);

    await act(async () => {
      render(
        <ConfigProvider>
          <MemoryRouter>
            <TableEnumView table={table} />
          </MemoryRouter>
        </ConfigProvider>
      );
    });

    expect(screen.getByText("type")).toBeInTheDocument();
  });
});
