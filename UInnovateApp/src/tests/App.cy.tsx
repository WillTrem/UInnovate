import App from '../App'
import { mount } from '@cypress/react18'
import {MemoryRouter} from 'react-router-dom'

describe('<App>', () => {
  it('mounts', () => {
    mount(<MemoryRouter><App /></MemoryRouter>)
  })
})