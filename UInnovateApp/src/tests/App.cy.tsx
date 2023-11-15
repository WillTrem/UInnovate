
import { mount } from '@cypress/react18'
import {MemoryRouter} from 'react-router-dom'
import { Home } from '../pages/Home'

describe('<Home>', () => {
  it('mounts', () => {
    mount(
    <MemoryRouter>
      <Home/>
    </MemoryRouter>
    );

    // Assert that the NavBar is rendered
    cy.get('nav').should('exist');

    // Assert that the text "Home page" is displayed
    cy.contains('Home page').should('exist');
  })
})
