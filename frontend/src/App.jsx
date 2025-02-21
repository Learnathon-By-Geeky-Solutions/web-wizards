import React, { useContext, useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Navigate, useNavigate } from 'react-router-dom';
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
import Settings from './pages/Settings';
import MedicationPlans from './components/Medication/Medication Plans';
import Medication from './components/Medication/Medication';
import Clinicians from './pages/Clinicians';
import NotFound from './pages/NotFound';

const PrivateRoute = ({ element }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return isAuthenticated ? element : null;
};

PrivateRoute.propTypes = {
  element: PropTypes.element.isRequired,
};

const PublicRoute = ({ element }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return !isAuthenticated ? element : null;
};

PublicRoute.propTypes = {
  element: PropTypes.element.isRequired,
};

// Define router configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/test",
    element: <Test />,
  },
  {
    path: "/registration",
    element: <PublicRoute element={<Registration />} />,
  },
  {
    path: "/login",
    element: <PublicRoute element={<Login />} />,
  },
  {
    path: "/dashboard",
    element: <PrivateRoute element={<Dashboard />} />,
  },
  {
    path: "/medicalrecord",
    element: <PrivateRoute element={<MedicalRecord />} />,
    children: [
      {
        path: "logbook",
        element: <PrivateRoute element={<Logbook />} />,
      },
      {
        path: "charts",
        element: <PrivateRoute element={<Charts />} />,
      },
      {
        path: "symptoms",
        element: <PrivateRoute element={<Symptoms />} />,
      },
      {
        path: "labresult",
        element: <PrivateRoute element={<LabResult />} />,
      },
      {
        path: "documents",
        element: <PrivateRoute element={<Documents />} />,
      },
    ],
  },
  {
    path: "/healthissues",
    element: <PrivateRoute element={<HealthIssues />} />,
  },
  {
    path: "/chat",
    element: <PrivateRoute element={<Chat />} />,
  },
  {
    path: "/appointments",
    element: <PrivateRoute element={<Appointments />} />,
  },
  {
    path: "/settings",
    element: <PrivateRoute element={<Settings />} />,
  },
  {
    path: "/medication",
    element: <PrivateRoute element={<Medication />} />,
  },
  {
    path: "/medicationplans",
    element: <PrivateRoute element={<MedicationPlans />} />,
  },
  {
    path: "/clinicians",
    element: <PrivateRoute element={<Clinicians />} />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;