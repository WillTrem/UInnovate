import { ListView } from '../pages/ListView'; // Adjust the import path if needed
import { mount } from '@cypress/react18';
import { MemoryRouter } from 'react-router-dom';

describe('<ListView>', () => {
  it('mounts and displays the ListView page', () => {
    mount(
      <MemoryRouter>
        <ListView />
      </MemoryRouter>
    );

    // Assert that the NavBar is rendered
    cy.get('nav').should('exist');

    // Assert that the text "Table Names:" is displayed
    cy.contains('Table Names:').should('exist');

    // Assert that the table titles are rendered
    cy.get('a.ps-menu-button').should('exist');

  });
});