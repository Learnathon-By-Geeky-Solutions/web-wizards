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
import Charts from './components/MedicalRecord/Charts';
import Documents from './components/MedicalRecord/Documents';
import Logbook from './components/MedicalRecord/Logbook';
import LabResult from './components/MedicalRecord/LabResult';
import Symptoms from './components/MedicalRecord/Symptoms';
import HealthIssues from './components/Dashboard/Health Issues';
import Chat from './components/Dashboard/Chat';
import Appointments from './components/Dashboard/Appointments';


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
          <Route path="/logbook" element={<PublicRoute element={<Logbook />} />} />
          <Route path="/charts" element={<PublicRoute element={<Charts />} />} />
          
          <Route path="/symptoms" element={<PublicRoute element={<Symptoms />} />} />
          <Route path="/labresult" element={<PublicRoute element={<LabResult />} />} />
          <Route path="/documents" element={<PublicRoute element={<Documents />} />} />
          <Route path="/healthissues" element={<PublicRoute element={<HealthIssues />} />} />
          <Route path="/chat" element={<PublicRoute element={<Chat />} />} />
          <Route path="/appointments" element={<PublicRoute element={<Appointments />} />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;