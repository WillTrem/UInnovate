import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home';
import { NavBar } from './components/NavBar';
import { VirtualModel } from './pages/VirtualModel';
import { ObjectMenu } from './pages/ObjectMenu';



function App() {
  

  return (
    
 <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/check" element={<NavBar />} />
        <Route path="/virtualmodel" element={<VirtualModel />} />
        <Route path="/app" element={<ObjectMenu />} />


        
      </Routes>
  </Router>
   
  )
}

export default App
