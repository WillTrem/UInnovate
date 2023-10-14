import { Route, Routes } from 'react-router-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home';
import { NavBar } from './components/NavBar';
import { VirtualModel } from './pages/VirtualModel';
import { ObjectMenu } from './pages/ObjectMenu';



function App() {
  

  return (
    
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/check" element={<NavBar />} />
        <Route path="/virtualmodel" element={<VirtualModel />} />
        <Route path="/app" element={<ObjectMenu />} />


        
      </Routes>
      </BrowserRouter>
  )
}

export default App
