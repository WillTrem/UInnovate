import {
  cleanup,
  render,
  screen,
  waitFor,
  act,
  within,
} from "@testing-library/react";
import { describe, expect } from "vitest";
import { ScriptingTab } from "../../../components/settingsPage/ScriptingTab";
import { ScriptEditor } from "../../../components/settingsPage/ScriptEditor";
import { Row } from "../../../virtualmodel/DataAccessor";

vi.unmock("../../virtualmodel/VMD");
vi.unmock("../../../virtualmodel/DataAccessor");

describe("ScriptingTab", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the ScriptingTab and script editor", async () => {
    render(<ScriptingTab />);

    await waitFor(() => {
      expect(screen.getByText("Scripts")).toBeInTheDocument();
    });
  });

  it("should display the scripts", async () => {
    render(<ScriptingTab />);

    console.log(screen.debug(undefined, 20000));

    await waitFor(() => {
      expect(screen.getByText("mock name")).toBeInTheDocument();
      expect(screen.getByText("mock name 2")).toBeInTheDocument();
      expect(screen.getByText("mock name 3")).toBeInTheDocument();
    });
  });

  it("the button should open the modal", async () => {
    render(<ScriptingTab />);

    const button = screen.getByRole("button");

    act(() => {
      button.click();
    });

    await waitFor(() => {
      expect(screen.getByText("Add New Script")).toBeInTheDocument();
    });
  });

  it("the modal should have a form with the column names", async () => {
    render(<ScriptingTab />);

    const button = screen.getByRole("button");

    act(() => {
      button.click();
    });

    await waitFor(() => {
      expect(screen.getByText("Add New Script")).toBeInTheDocument();
      expect(screen.getByText("Column1")).toBeInTheDocument();
      expect(screen.getByText("Column2")).toBeInTheDocument();
      expect(screen.getByText("Column3")).toBeInTheDocument();
      expect(screen.getByText("name")).toBeInTheDocument();
    });
  });
});
