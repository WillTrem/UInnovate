import {
  cleanup,
  render,
  screen,
  waitFor,
  act,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect } from "vitest";
import ace from "ace-builds";
import { ScriptEditor } from "../../../components/settingsPage/ScriptEditor";
import { Row } from "../../../virtualmodel/DataAccessor";

vi.unmock("../../virtualmodel/VMD");
vi.unmock("../../../virtualmodel/DataAccessor");

const mockScript: Row = {
  id: 1,
  name: "mock script",
  description: "mock description",
  content: "mock content",
  btn_name: "mock button name",
  table_name: "mock1",
} as Row;

describe("ScriptEditor component", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the script components", () => {
    render(<ScriptEditor script={mockScript} />);

    const aceEditorElement = document.querySelector(".ace_editor");
    const aceEditor = ace.edit(aceEditorElement as HTMLElement);

    expect(
      screen.getByText(`Script: ${mockScript["name"]}`)
    ).toBeInTheDocument();
    expect(
      screen.getByDisplayValue(mockScript["description"])
    ).toBeInTheDocument();
    expect(
      screen.getByDisplayValue(mockScript["btn_name"])
    ).toBeInTheDocument();
    expect(aceEditor.getValue()).toBe(mockScript["content"]);
    expect(
      screen.getByDisplayValue(mockScript["table_name"])
    ).toBeInTheDocument();
  });

  it("changes the button name when typing in the TextField", async () => {
    render(<ScriptEditor script={mockScript} />);

    const buttonNameField = screen.getAllByRole("textbox")[0];

    act(() => {
      userEvent.click(buttonNameField);
      userEvent.clear(buttonNameField);
      userEvent.type(buttonNameField, "New button name");
    });

    await waitFor(() => {
      expect(screen.getByDisplayValue("New button name")).toBeInTheDocument();
    });
  });

  it("changes the script description when typing in the TextField", async () => {
    render(<ScriptEditor script={mockScript} />);

    const descriptionField = screen.getByTestId("description-field");
    const inputElement = within(descriptionField).getByRole("textbox");

    act(() => {
      userEvent.click(inputElement);
      userEvent.clear(inputElement);
      userEvent.type(inputElement, "New description");
    });

    await waitFor(() => {
      expect(screen.getByDisplayValue("New description")).toBeInTheDocument();
    });
  });

  it("changes the script content when the Edit and Save buttons are clicked", async () => {
    render(<ScriptEditor script={mockScript} />);

    const editButton = screen.getByTestId("EditIcon");
    const aceEditorElement = document.querySelector(".ace_editor");
    const aceEditor = ace.edit(aceEditorElement as HTMLElement);
    const saveButton = screen.getByTestId("SaveIcon");

    act(() => {
      userEvent.click(editButton);
      aceEditor.setValue("New content");
      userEvent.click(saveButton);
    });

    await waitFor(() => {
      expect(aceEditor.getValue()).toBe("New content");
    });
  });
});
