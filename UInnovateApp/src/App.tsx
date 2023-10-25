import { Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home';
import { NavBar } from './components/NavBar';
import { ObjectMenu } from './pages/ObjectMenu';
import { Element } from "./pages/Element";

function App() {
  return (
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/check" element={<NavBar />} />
      <Route path="/app" element={<ObjectMenu />} />
      <Route path="/app/:table_name" element={<Element />} />
      </Routes>
  )
}

export default App;
