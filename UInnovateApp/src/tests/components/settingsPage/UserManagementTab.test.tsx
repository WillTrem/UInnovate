import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import UserManagementTab from "../../../components/settingsPage/UserMangementTab"
import { describe, expect } from "vitest";

describe("UserManagementTab component", () => {
	it("renders the component", () => {
		render(
			<UserManagementTab />
		);
	}),
		it("displays the add user modal when the add user button is clicked", async () => {
			const { getByText } = render(<UserManagementTab />);
			const button = getByText("Add User");
			fireEvent.click(button);

			await waitFor(() => {
				const modalElement = screen.getByTestId('add-user-modal');
				expect(modalElement).toBeInTheDocument();
			});
		}),
		it("closes the add user modal when the cancel button is clicked", async () => {
			render(<UserManagementTab />);
			const button = screen.getByText("Add User");
			fireEvent.click(button);

			await waitFor(() => {
				const modalElement = screen.getByTestId('add-user-modal');
				expect(modalElement).toBeInTheDocument();
			});

			const closeButton = screen.getByText("Cancel");

			fireEvent.click(closeButton);

			await waitFor(() => {
				const modalElement = screen.queryByTestId('add-user-modal');
				expect(modalElement).not.toBeInTheDocument();
			});
		})
		it("sends the request upon clicking the add user button", async () => {
			render(<UserManagementTab />);
			const button = screen.getByText("Add User");
			fireEvent.click(button);

			await waitFor(() => {
				const modalElement = screen.getByTestId('add-user-modal');
				expect(modalElement).toBeInTheDocument();
			});

			const createUserButton = screen.getByText("Add");

			fireEvent.click(createUserButton);
			// Expects to close the modal
			await waitFor(() => {
				const modalElement = screen.queryByTestId('add-user-modal');
				expect(modalElement).not.toBeInTheDocument();
			});
		})
})