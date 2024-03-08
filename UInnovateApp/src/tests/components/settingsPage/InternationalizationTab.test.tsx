import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import InternationalizationTab from "../../../components/settingsPage/InternationalizationTab"
import { describe, expect } from "vitest";
import { Middleware, Store } from "@reduxjs/toolkit";
import configureStore from "redux-mock-store";
import { Role } from "../../../redux/AuthSlice";
import { Provider } from "react-redux";

describe("InternationalizationTab component", () => {
	const initialState = {
		schema: { schema_name: "application" },
		script_table: { table_name: "script_mock" },
		auth: { role: Role.ADMIN, user: "admin", token: "token" } 
	};
	const middlewares: Middleware[] = [];
	const mockStore = configureStore(middlewares);
	let store: Store;


	it("renders the component", () => {
		store = mockStore(initialState);
		render(
				<Provider store={store}>
					<InternationalizationTab />
				</Provider>
		);
	}),
  it("renders the table component", async () => {
      <Provider store={store}>
        <InternationalizationTab />
      </Provider>
    const tableElement = screen.getByTestId('table-component');
    expect(tableElement).toBeInTheDocument();
  }),
		it("displays the add language modal when the add language button is clicked", async () => {
				<Provider store={store}>
					<InternationalizationTab />
				</Provider>
			const button = screen.getByText("Add Language");
			fireEvent.click(button);

			await waitFor(() => {
				const modalElement = screen.getByTestId('add-language-modal');
				expect(modalElement).toBeInTheDocument();
			});
		}),
		it("closes the add language modal when the cancel button is clicked", async () => {
				<Provider store={store}>
					<InternationalizationTab />
				</Provider>
			const button = screen.getByText("Add Language");
			fireEvent.click(button);

			await waitFor(() => {
				const modalElement = screen.getByTestId('add-language-modal');
				expect(modalElement).toBeInTheDocument();
			});

			const closeButton = screen.getByText("Close");

			fireEvent.click(closeButton);

			await waitFor(() => {
				const modalElement = screen.queryByTestId('add-language-modal');
				expect(modalElement).not.toBeInTheDocument();
			});
		}),
    it("When clicking the save button from the add language modal, the language should be saved ", async () => {
        <Provider store={store}>
          <InternationalizationTab />
        </Provider>
      const button = screen.getByText("Add Language");
      fireEvent.click(button);

      await waitFor(() => {
        const modalElement = screen.getByTestId('add-language-modal');
        expect(modalElement).toBeInTheDocument();
      });

      const saveButton = screen.getByText("Save");

      fireEvent.click(saveButton);

      await waitFor(() => {
        const modalElement = screen.queryByTestId('add-language-modal');
        expect(modalElement).not.toBeInTheDocument();
      });
    }),
    it("displays the add label modal when the add label icon button is clicked", async () => {
        <Provider store={store}>
          <InternationalizationTab />
        </Provider>
      const button = screen.getByTestId("add-label-button");  
      fireEvent.click(button);

      await waitFor(() => {
        const modalElement = screen.getByTestId('add-label-modal');
        expect(modalElement).toBeInTheDocument();
      });
    }),
    it("closes the add label modal when the cancel button is clicked", async () => {
        <Provider store={store}>
          <InternationalizationTab />
        </Provider>
      const button = screen.getByTestId("add-label-button");
      fireEvent.click(button);

      await waitFor(() => {
        const modalElement = screen.getByTestId('add-label-modal');
        expect(modalElement).toBeInTheDocument();
      });

      const closeButton = screen.getByText("Close");

      fireEvent.click(closeButton);

      await waitFor(() => {
        const modalElement = screen.queryByTestId('add-label-modal');
        expect(modalElement).not.toBeInTheDocument();
      });
    }),
    it("When clicking the save button from the add label modal, the label should be saved ", async () => {
        <Provider store={store}>
          <InternationalizationTab />
        </Provider>
      const button = screen.getByTestId("add-label-button");
      fireEvent.click(button);

      await waitFor(() => {
        const modalElement = screen.getByTestId('add-label-modal');
        expect(modalElement).toBeInTheDocument();
      });

      const saveButton = screen.getByText("Save");

      fireEvent.click(saveButton);

      await waitFor(() => {
        const modalElement = screen.queryByTestId('add-label-modal');
        expect(modalElement).not.toBeInTheDocument();
      });
    }),
    it("Refresh button is clickable", async () => {
        <Provider store={store}>
          <InternationalizationTab />
        </Provider>
      const button = screen.getByTestId("refresh-button");
      fireEvent.click(button);
    })
})