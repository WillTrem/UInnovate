import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect } from "vitest";
import { ScriptEditor } from "../../../components/settingsPage/ScriptEditor";

const mockScript = {
  id: 1,
  name: "mock script",
  description: "mock description",
  content: "mock content",
};

describe("ScriptEditor component", () => {
  it("renders the script components", () => {
    render(<ScriptEditor script={mockScript} />);

    expect(screen.getByText("Script: mock script")).toBeInTheDocument();
    expect(screen.getByText("mock description")).toBeInTheDocument();
  });

  it("renders the script content in the AceEditor", () => {
    render(<ScriptEditor script={mockScript} />);

    const aceEditorContent = screen.getByDisplayValue("mock content");
    expect(aceEditorContent).toBeInTheDocument();
  });

  it("changes the script content when the Edit and Save buttons are clicked", async () => {
    render(<ScriptEditor script={mockScript} />);

    const editButton = screen.getByTestId("EditIcon");
    userEvent.click(editButton);

    const aceEditor = screen.getByTestId("ace-editor");
    userEvent.clear(aceEditor);
    userEvent.type(aceEditor, "New content");

    const saveButton = screen.getByTestId("SaveIcon");
    userEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByDisplayValue("New content")).toBeInTheDocument();
    });
  });
});
