
import { mount } from '@cypress/react18'
import {MemoryRouter} from 'react-router-dom'
import { Home } from '../pages/Home'
import configureStore from 'redux-mock-store'
import { Provider } from "react-redux";

describe('<Home>', () => {
    const initialState = { schema: "application" }
    const middlewares: any = [];
    const mockStore = configureStore(middlewares);
    let store;

    it('mounts', () => {
    store = mockStore(initialState)
    mount(
        <MemoryRouter>
            <Provider store={store}>
                <Home/>
            </Provider>
        </MemoryRouter>
    );

    // Assert that the NavBar is rendered
    cy.get('nav').should('exist');

    // Assert that the text "Home page" is displayed
    cy.contains('Home page').should('exist');
  })
})
