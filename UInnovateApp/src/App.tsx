import { Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home';
import { NavBar } from './components/NavBar';
import { ObjectMenu } from './pages/ObjectMenu';
import { Element } from "./pages/Element";
import { ListView } from './pages/ListView';
import { EnumView } from './pages/EnumView';

function App() {
  return (
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/check" element={<NavBar />} />
      <Route path="/app" element={<ListView />} />
      <Route path="/app/:table_name" element={<Element />} />
      <Route path="/objview" element={<ObjectMenu />} />
      <Route path="/enumview" element={<EnumView />} />



      </Routes>
  )
}

export default App;
