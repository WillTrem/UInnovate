import {describe, it, vi} from 'vitest'
import TestRenderer from 'react-test-renderer'
import {NavBar} from '../components/NavBar'
import {MemoryRouter} from 'react-router-dom'
import configureStore from 'redux-mock-store'
import { Provider } from "react-redux";
import { Middleware, Store } from "@reduxjs/toolkit";
import { Role } from '../redux/AuthSlice'


vi.mock('axios')
describe ("NavBar.jsx", () => {
    const initialState = {
		schema: { schema_name: "application" },
		script_table: { table_name: "script_mock" },
		auth: { role: Role.ADMIN, user: "admin", token: "token", schema_access:["mock schema 1"] },
        languageSelection:{
			lang: "en",
  			translations: [
				{
					languageCode:'fr',
					values:[
						{translation_id: 1, language_code: 'fr', key_code: 'settings', value: 'Configuration', is_default: true},
						{translation_id: 4, language_code: 'fr', key_code: 'audit_trails', value: '', is_default: true}]
				},
				{
					languageCode:'en',
					values:[
						{translation_id: 5, language_code: 'en', key_code: 'settings', value: 'Settings', is_default: true},
						{translation_id: 8, language_code: 'en', key_code: 'audit_trails', value: '', is_default: true}]
				}
			]
		}
	};
	const middlewares: Middleware[] = [];
	const mockStore = configureStore(middlewares);
	let store: Store;
    it("tests the children inside navbar component", () =>{
        store = mockStore(initialState)

        const navBar = TestRenderer.create(
        <MemoryRouter>
            <Provider store={store}>
                <NavBar />
            </Provider>
        </MemoryRouter>).toJSON();
        console.log(navBar)
    })
})