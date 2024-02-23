import { render, screen, act } from "@testing-library/react";
import { vi } from "vitest";
import TableEnumView from "../components/TableEnumView";
import { MemoryRouter } from "react-router-dom";
import { ConfigProvider } from "../contexts/ConfigContext";
import { Column, Table } from "../virtualmodel/VMD";

vi.mock("axios");

vi.unmock("../virtualmodel/VMD");
vi.unmock("../virtualmodel/DataAccessor");

describe("TableEnumView", () => {
  it("renders a table with the specified attributes", async () => {
    const table = new Table("mock table name");
    const column = new Column("type");

    table.addColumn(column, "", false, "");
    column.setVisibility(true);

    console.log(table.getEnumViewColumn());
    console.log(column);

    act(() => {
      render(
        <ConfigProvider>
          <MemoryRouter>
            <TableEnumView table={table} />
          </MemoryRouter>
        </ConfigProvider>
      );
    });

    await expect(screen.getByText("type")).toBeInTheDocument();
  });
});
