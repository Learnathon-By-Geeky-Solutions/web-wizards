import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Test from './pages/Test';
import Registration from './pages/Registration';
import Login from './pages/Login';
import Dashboard from './components/Dashboard/Dashboard';
import { AuthProvider, AuthContext } from './context/authContext';

const PrivateRoute = ({ element }) => {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? element : <Navigate to="/login" />;
};

const PublicRoute = ({ element }) => {
  const { isAuthenticated } = useContext(AuthContext);
  return !isAuthenticated ? element : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/test" element={<Test />} />
          <Route path="/registration" element={<PublicRoute element={<Registration />} />} />
          <Route path="/login" element={<PublicRoute element={<Login />} />} />
          <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;