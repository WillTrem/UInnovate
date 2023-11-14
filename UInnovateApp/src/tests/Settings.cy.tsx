// import React from "react";
import { mount } from "@cypress/react18";
import { Settings } from "../pages/Settings";
import { MemoryRouter } from "react-router-dom";
import { TablesContextProvider } from "../contexts/TablesContext";
import { ConfigProvider } from "../contexts/ConfigContext";
import configureStore from 'redux-mock-store'
import { Provider } from "react-redux";

describe("<Settings />", () => {
  const initialState = {schema:"application"}
  const middlewares: any = [];
  const mockStore = configureStore(middlewares);
  let store

  it("mounts and displays the Settings page", () => {
    store = mockStore(initialState)
    mount(
        <MemoryRouter>
            <Provider store={store}>
                <TablesContextProvider>
                  <ConfigProvider>
                    <Settings />
                  </ConfigProvider>
                </TablesContextProvider>
            </Provider>
        </MemoryRouter>
    );

    // Assert that the NavBar is rendered
    cy.get("nav").should("exist");

    // Assert that the text "Settings" is displayed
    cy.contains("Settings").should("exist");

    // Assert that the text "Table" is displayed
    cy.contains("Table").should("exist");

    // Assert that the text "General" is displayed
    cy.contains("General").should("exist");
    
    //Assert that the General or Displayed List group is displayed
    cy.get("div.col-sm-9").should("exist");

    // Assert that the text "Display" is displayed
    cy.contains("Display").should("exist");

    // Assert that the table div is rendered
    cy.get("div.col-sm-3").should("exist");

    // Assert that the card titles are rendered
    cy.get("div.customization-title").should("exist");

    //Assert that the Button to Save changes is there 
    cy.get("button").should("exist")

    // Assert that the form is rendered
    //cy.get("select.form-select").should("exist");

    // Assert that the table titles are rendered
     // cy.get("div.text-table").should("exist");
    
   

    
  });
});

