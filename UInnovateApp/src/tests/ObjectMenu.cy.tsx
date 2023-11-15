import { ObjectMenu } from "../pages/ObjectMenu"; // Adjust the import path if needed
import { mount } from "@cypress/react18";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";

describe("<ObjectMenu>", () => {
  const initialState = { schema: "application" };
  const middlewares: any = [];
  const mockStore = configureStore(middlewares);
  let store;

  it("mounts and displays the ObjectMenu page", () => {
    store = mockStore(initialState);
    mount(
      <MemoryRouter>
        <Provider store={store}>
          <ObjectMenu />
        </Provider>
      </MemoryRouter>
    );

    // Assert that the NavBar is rendered
    cy.get("nav").should("exist");

    // Assert that the view status button is rendered
    cy.get("button").should("exist");

    // Assert that the button lists out View status is shown with list or enum
    cy.contains(/View status: list|View status: enum/).should("exist");

    // Assert that at least 1 table name is rendered
    cy.get("a").should("exist");

    //Assert that the tables are rendered
    cy.get("div.tab-content").should("exist");

    // Assert that the side panel is rendered
    cy.get("div.panel.panel-container").should("exist");

    // Assert that the title of the side panel is rendered
    cy.get("div.title-panel").should("exist");

    // Assert that the form is rendered from the side panel
    cy.get("div.row-details").should("exist");

    // Assert that the label is rendered from the side panel
    cy.get("label").should("exist");

    // Assert that the attributes of each column is rendered from the side panel
    cy.get("div.form-group").should("exist");

    // Assert that the close button is rendered from the side panel
    cy.get("button.button-side-panel").should("exist");
  });
});
