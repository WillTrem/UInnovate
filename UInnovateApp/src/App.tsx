import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home';
import { NavBar } from './components/NavBar';
import { ObjectMenu } from './pages/ObjectMenu';
import { Element } from "./pages/Element";

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/check" element={<NavBar />} />
      <Route path="/app" element={<ObjectMenu />} />
      <Route path="/app/element" element={<Element />} />
      </Routes>
    </Router>
  )
}

export default App;
