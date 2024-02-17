import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, expect } from "vitest";
import ScriptLoadPopup from "../../components/ScriptLoadPopup";
import { Row } from "../../virtualmodel/DataAccessor";

const mockScript = new Row({
  id: 1,
  name: "mock script",
  description: "mock description",
  content: "mock content",
});

const onCloseMock = vi.fn();

describe("ScriptLoadPopup component", () => {
  it("displays the correct modal title", () => {
    render(<ScriptLoadPopup onClose={onCloseMock} script={mockScript} />);

    expect(screen.getByText("Confirm Script Execution")).toBeInTheDocument();
  });

  it("displays the script execution confirmation message", () => {
    render(<ScriptLoadPopup onClose={onCloseMock} script={mockScript} />);

    console.log(mockScript);

    expect(
      screen.getByText(/Are you sure you want to execute the script ".*"?/)
    ).toBeInTheDocument();
  });

  it("has Confirm and Cancel buttons", () => {
    render(<ScriptLoadPopup onClose={onCloseMock} script={mockScript} />);

    expect(screen.getByText("Confirm")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("calls onClose when the Cancel button is clicked", () => {
    render(<ScriptLoadPopup onClose={onCloseMock} script={mockScript} />);

    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    expect(onCloseMock).toHaveBeenCalled();
  });

  it("calls handleConfirm when the Confirm button is clicked", async () => {
    render(<ScriptLoadPopup onClose={onCloseMock} script={mockScript} />);

    const confirmButton = screen.getByText("Confirm");
    fireEvent.click(confirmButton);

    await waitFor(() => {
      const successMessage = screen.queryByText("Success");
      const errorMessage = screen.queryByText("Error");

      expect(successMessage || errorMessage).toBeInTheDocument();
    });
  });
});
