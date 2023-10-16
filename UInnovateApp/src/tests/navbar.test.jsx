import {describe, it} from 'vitest'
import TestRenderer from 'react-test-renderer'
import {NavBar} from '../components/NavBar'
import {MemoryRouter} from 'react-router-dom'

describe ("NavBar.jsx", () => {
    it("tests the children inside navbar component", () =>{
        const navBar = TestRenderer.create(<MemoryRouter><NavBar /></MemoryRouter>).toJSON
        console.log(navBar)
    })
})