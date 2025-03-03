import React, { createContext, useState, useEffect } from 'react';
import { getUserProfile } from '../api/authUser';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsAuthenticated(true);
      fetchUserProfile();
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const userData = await getUserProfile();
      // Extract user data from the nested structure
      setUser(userData.user);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const login = async (token) => {
    localStorage.setItem('accessToken', token);
    setIsAuthenticated(true);
    await fetchUserProfile();
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};