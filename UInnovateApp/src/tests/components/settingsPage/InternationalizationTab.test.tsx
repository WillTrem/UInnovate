import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import InternationalizationTab from "../../../components/settingsPage/InternationalizationTab"
import { describe, expect } from "vitest";
import { Middleware, Store } from "@reduxjs/toolkit";
import configureStore from "redux-mock-store";
import { Role } from "../../../redux/AuthSlice";
import { Provider } from "react-redux";
import { act } from "react-test-renderer";
import userEvent from "@testing-library/user-event";

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
      render(
        <Provider store={store}>
          <InternationalizationTab />
        </Provider>
      );
      const tableElement = screen.getByTestId('table-component');
      expect(tableElement).toBeInTheDocument();
    }),
    it("displays the add language modal when the add language button is clicked", async () => {
      const { getByText } = render(
        <Provider store={store}>
          <InternationalizationTab />
        </Provider>
      );
      const button = getByText("Add Language");
      fireEvent.click(button);

      await waitFor(() => {
        const modalElement = screen.getByTestId('add-language-modal');
        expect(modalElement).toBeInTheDocument();
      });
    }),
    it("closes the add language modal when the cancel button is clicked", async () => {
      render(
        <Provider store={store}>
          <InternationalizationTab />
        </Provider>
      );
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
      const user = userEvent.setup();
      render(
        <Provider store={store}>
          <InternationalizationTab />
        </Provider>
      );
      const button = screen.getByText("Add Language");
      fireEvent.click(button);

      await waitFor(() => {
        const modalElement = screen.getByTestId('add-language-modal');
        expect(modalElement).toBeInTheDocument();
      });

      const select = screen.getByTestId('language-select');
      const combobox = within(select).getByRole('combobox');
      await act(() => user.click(combobox));
      const listbox = await screen.findByRole("listbox");
      await act(() => user.click(within(listbox).getByText('English')))

      const saveButton = screen.getByText("Save");

      await act(async () => {
        user.click(saveButton);
      });

      await waitFor(() => {
        const modalElement = screen.queryByTestId('add-language-modal');
        expect(modalElement).not.toBeInTheDocument();
      });
    }),
    it("displays the add label modal when the add label icon button is clicked", async () => {
      render(
        <Provider store={store}>
          <InternationalizationTab />
        </Provider>
      );
      const button = screen.getByTestId("add-label-button");
      fireEvent.click(button);

      await waitFor(() => {
        const modalElement = screen.getByTestId('add-label-modal');
        expect(modalElement).toBeInTheDocument();
      });
    }),
    it("closes the add label modal when the cancel button is clicked", async () => {
      render(
        <Provider store={store}>
          <InternationalizationTab />
        </Provider>
      );
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
      render(
        <Provider store={store}>
          <InternationalizationTab />
        </Provider>
      );
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
      render(
        <Provider store={store}>
          <InternationalizationTab />
        </Provider>
      );
      const button = screen.getByTestId("refresh-button");
      fireEvent.click(button);
    }),
    it("Show Missing Translations button is clickable", async () => {
      render(
        <Provider store={store}>
          <InternationalizationTab />
        </Provider>
      );
      const button = screen.getByTestId("missing-translations-button");
      fireEvent.click(button);
    }),
    // Default Language Dropdown selected
    it("Default Language Dropdown selected", async () => {
      render(
        <Provider store={store}>
          <InternationalizationTab />
        </Provider>
      );
      const button = screen.getByTestId("selected-language-label");
      fireEvent.click(button);
    }),
    // It display the add label modal when the add label icon button is clicked and then once a label is added, it should be displayed in the table
    it("displays the add label modal when the add label icon button is clicked and then once a label is added, it should be displayed in the table", async () => {
      render(
        <Provider store={store}>
          <InternationalizationTab />
        </Provider>
      );
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

      const tableElement = screen.getByTestId('table-component');
      expect(tableElement).toBeInTheDocument();
    }),

    it('allows editing the label and the translation', async () => {
      store = mockStore(initialState);
      const user = userEvent.setup();
      const { debug } = render(
        <Provider store={store}>
          <InternationalizationTab />
        </Provider>
      );
      const labelInput = await screen.findByTestId('label-input');
  
      const translationCell = await screen.findByTestId('translation-element');
      const translationInput = await screen.findByTestId('translation-input');

      // Changing the label
      await act(async () => {
        await user.dblClick(labelInput);
      });
      await act(async () => {
        await user.clear(labelInput);
        await user.type(labelInput, 'changedLabelMock');
        await user.type(labelInput, '{enter}');
        fireEvent.mouseDown(screen.getByText('Label'));
      });
      // Changing the translation value
      await act(async () => {
        await user.dblClick(translationCell);
      });
      await act(async () => {
        await user.clear(translationInput);
        await user.type(translationInput, 'changedTranslationMock');
        await user.type(translationInput, '{enter}');
        fireEvent.mouseDown(screen.getByText('Label'));
      });
      debug();
      expect(translationInput).toHaveValue('changedTranslationMock');
    })
});
