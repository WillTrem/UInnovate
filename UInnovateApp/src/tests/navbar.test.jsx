import {describe, it} from 'vitest'
import TestRenderer from 'react-test-renderer'
import {NavBar} from '../components/NavBar'
import {MemoryRouter} from 'react-router-dom'
import configureStore from 'redux-mock-store'
import { Provider } from "react-redux";

describe ("NavBar.jsx", () => {
    const initialState = {schema:"application"}
    const middlewares:any = [];
    const mockStore = configureStore(middlewares);
    let store

    it("tests the children inside navbar component", () =>{
        store = mockStore(initialState)

        const navBar = TestRenderer.create(
        <MemoryRouter>
            <Provider store={store}>
                <NavBar />
            </Provider>
        </MemoryRouter>).toJSON
        console.log(navBar)
    })
})