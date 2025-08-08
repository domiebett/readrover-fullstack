
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Health from './pages/Health';
import Home from './pages/Home';
import Login from './pages/Login';
import Protected from './pages/Protected';
import Register from './pages/Register';
import AuthRoute from './routes/AuthRoute';
import LogoutButton from './components/LogoutButton';
import { AuthProvider } from './hooks/AuthContext';



function App() {
  return (
    <Router>
      <AuthProvider>
        <nav>
          <Link to="/">Home</Link> | <Link to="/health">Health</Link> | <Link to="/login">Login</Link> | <Link to="/register">Register</Link> | <Link to="/me">Protected</Link>
          <LogoutButton />
        </nav>
        <Routes>
          <Route path="/login" element={<AuthRoute requireAuth={false}><Login /></AuthRoute>} />
          <Route path="/register" element={<AuthRoute requireAuth={false}><Register /></AuthRoute>} />
          <Route path="/health" element={<Health />} />
          <Route path="/" element={<AuthRoute requireAuth={true}><Home /></AuthRoute>} />
          <Route path="/me" element={<AuthRoute requireAuth={true}><Protected /></AuthRoute>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App
