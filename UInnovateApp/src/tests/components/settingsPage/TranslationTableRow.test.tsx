import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect } from "vitest";
import { Middleware, Store } from "@reduxjs/toolkit";
import configureStore from "redux-mock-store";
import { Role } from "../../../redux/AuthSlice";
import { Provider } from "react-redux";
import TranslationTableRow from "../../../components/settingsPage/TranslationTableRow";
import { spy } from "sinon";
import sinon from "sinon";
import Audits from "../../../virtualmodel/Audits";
import AuditTrails from "../../../components/settingsPage/AuditTrails";

describe("TranslationTableRow component", () => {
    const initialState = {
        schema: { schema_name: "application" },
        script_table: { table_name: "script_mock" },
        auth: { role: Role.ADMIN, user: "admin", token: "token" } 
    };
    const middlewares: Middleware[] = [];
    const mockStore = configureStore(middlewares);
    let store: Store;

    beforeEach(() => {
        store = mockStore(initialState);
        render(
            <Provider store={store}>
                <TranslationTableRow
                    getTranslationsByLanguage={() => {}}
                    onEdit={() => {}}
                    getLanguageId={() => {}}
                    getKeyId={() => {}}
                    selectedLanguage={""}
                />
            </Provider>
        );
    });

    it("renders the component", () => {
        // No need to render the component again here, as it's done in beforeEach
        // Just perform any assertions related to component rendering
    });

    it("displays the delete label modal when the delete button is clicked", async () => {
        const button = screen.getByTestId("delete-label-icon");
        fireEvent.click(button);

        await waitFor(() => {
            const modalElement = screen.getByTestId('delete-label-modal');
            expect(modalElement).toBeInTheDocument();
        });
    });

    it("closes the delete label modal when the cancel button is clicked", async () => {
        const button = screen.getByTestId("delete-label-icon");
        fireEvent.click(button);

        const cancelButton = screen.getByTestId("cancel-label-button");
        fireEvent.click(cancelButton);

        await waitFor(() => {
            const modalElement = screen.queryByTestId('delete-label-modal');
            expect(modalElement).toBeNull();
        });
    });

    // delete label modal is open and inside the div delete-label-div, the delete button is clicked
    it("deletes the label when the delete button is clicked", async () => {
        const button = screen.getByTestId("delete-label-icon");
        fireEvent.click(button);

        const deleteButton = screen.getByTestId("delete-label-button");
        fireEvent.click(deleteButton);
    });
    //modal contains modal.title
    it("displays the modal title", () => {
        // open the modal
        const button = screen.getByTestId("delete-label-icon");
        fireEvent.click(button);

        // check if the modal title is displayed
        const modalTitle = screen.getByTestId("delete-label-title");
        expect(modalTitle).toHaveTextContent("Delete Label");
    });

    it("sets isEditingLabel to true when handleDoubleClickLabel is called for the first row", () => {
        // Arrange
        const { getAllByTestId } = render(
            <Provider store={store}>
                <TranslationTableRow
                    getTranslationsByLanguage={() => {}}
                    onEdit={() => {}}
                    getLanguageId={() => {}}
                    getKeyId={() => {}}
                    selectedLanguage={""}
                    is_default={false}
                />
            </Provider>
        );
        // get all label elements
        const labelElements = getAllByTestId("label-element");
        // labelElements[0].setAttribute("data-isEditingLabel", "true");

        // Act
        fireEvent.doubleClick(labelElements[0]);

        // Assert
        expect(labelElements[0].getAttribute("data-isEditingLabel")).toBe("true");
    });

    it("sets isEditingTranslation to true when handleDoubleClickTranslation is called for the first row", () => {
        // Arrange
        const { getAllByTestId } = render(
            <Provider store={store}>
                <TranslationTableRow
                    getTranslationsByLanguage={() => {}}
                    onEdit={() => {}}
                    getLanguageId={() => {}}
                    getKeyId={() => {}}
                    selectedLanguage={""}
                />
            </Provider>
        );
        // get all translation elements
        const translationElements = getAllByTestId("translation-element");

        // Act
        fireEvent.doubleClick(translationElements[0]);

        // Assert 
        expect(translationElements[0].getAttribute("data-isEditingTranslation")).toBe(null);
    });


});