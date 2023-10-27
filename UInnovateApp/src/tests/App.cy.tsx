import App from '../App'
import { mount } from '@cypress/react18'
import {MemoryRouter} from 'react-router-dom'

describe('<App>', () => {
  it('mounts', () => {
    mount(
    <MemoryRouter>
      <App />
    </MemoryRouter>
    );

    // Assert that the NavBar is rendered
    cy.get('nav').should('exist');

    // Assert that the text "Home page" is displayed
    cy.contains('Home page').should('exist');
  })
})
