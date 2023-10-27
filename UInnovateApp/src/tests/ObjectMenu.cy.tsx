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
  });
});