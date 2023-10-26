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

    // Assert that the text "Which View" is displayed
    cy.contains('Which View').should('exist');

    // Assert that the "List View" link is present
    cy.contains('List View').should('exist');

    // Assert that the "Enum View" link is present
    cy.contains('Enum View').should('exist');
  });

  it('navigates to List View when the "List View" link is clicked', () => {
    mount(
      <MemoryRouter>
        <ObjectMenu />
      </MemoryRouter>
    );
    
    // Click the "List View" link
    cy.contains('a').click();
    
    // Assert that the URL has changed to '/app' (or the correct URL)
    cy.url().should('include', '/app');
  });

  it('navigates to Enum View when the "Enum View" link is clicked', () => {
    mount(
      <MemoryRouter>
        <ObjectMenu />
      </MemoryRouter>
    );

    // Click the "Enum View" link
    cy.contains('a').click();

    // Assert that the URL has changed to '/enumview' (or the correct URL)
    cy.url().should('include', '/enumview');
  });
});