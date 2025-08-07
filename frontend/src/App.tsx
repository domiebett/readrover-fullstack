import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Health from './pages/Health';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Home</Link> | <Link to="/health">Health</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/health" element={<Health />} />
      </Routes>
    </Router>
  )
}

export default App
