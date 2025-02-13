import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import Home from './pages/Home';
import Test from './pages/Test';
import Registration from './pages/Registration';
import Login from './pages/Login';
import Dashboard from './components/Dashboard/Dashboard';
import { AuthProvider, AuthContext } from './context/authContext';
import MedicalRecord from './components/MedicalRecord/MedicalRecord';

const PrivateRoute = ({ element }) => {
  const { isAuthenticated}  = true;
  return isAuthenticated ? element : <Navigate to="/login" />;
};

PrivateRoute.propTypes = {
  element: PropTypes.element.isRequired,
};

const PublicRoute = ({ element }) => {
  const  {isAuthenticated } = true;
  return !isAuthenticated ? element : <Navigate to="/dashboard" />;
};

PublicRoute.propTypes = {
  element: PropTypes.element.isRequired,
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
          <Route path="/dashboard" element={<PublicRoute element={<Dashboard />} />} />
          <Route path="/medicalrecord" element={<PublicRoute element={<MedicalRecord />} />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;