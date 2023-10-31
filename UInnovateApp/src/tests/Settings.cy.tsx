// import React from "react";
import { mount } from "@cypress/react18";
import { Settings } from "../pages/Settings";
import { MemoryRouter } from "react-router-dom";

describe("<Settings />", () => {
  it("mounts and displays the Settings page", () => {
    mount(
      <MemoryRouter>
        <Settings />
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

    // Assert that the text "Display" is displayed
    cy.contains("Display").should("exist");

    // Assert that the table titles are rendered
    cy.get("div.text-table").should("exist");

    // Assert that the card titles are rendered
    cy.get("div.customization-title").should("exist");

    // Assert that the form is rendered
    cy.get("select.form-select").should("exist");
  });
});

