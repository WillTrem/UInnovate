import { ObjectMenu } from '../pages/ObjectMenu'; // Adjust the import path if needed
import { mount } from '@cypress/react18';
import { MemoryRouter } from 'react-router-dom';


describe('<ObjectMenu>', () => {
  it('mounts and displays the ObjectMenu page', () => {
    mount(
      <MemoryRouter>
        <ObjectMenu />
      </MemoryRouter>
    );

    // Assert that the NavBar is rendered
    cy.get('nav').should('exist');

    // Assert that the view status button is rendered
    cy.get('button').should('exist');
    
    // Assert that the button lists out View status is shown with list or enum
    cy.contains(/View status: list|View status: enum/).should('exist');

    // Assert that at least 1 table name is rendered
    cy.get('a').should('exist');

     //Assert that the tables are rendered  
     cy.get("div.tab-content").should("exist");
  

  });
});