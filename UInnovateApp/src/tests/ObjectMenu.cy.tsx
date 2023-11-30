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

    // Assert that at least 1 table name is rendered
    cy.get("a").should("exist");

    //Assert that the table's div is rendered
    cy.get("div.tab-content").should("exist");

    // Click first table name
    cy.get("a").first().click();
  });
});
