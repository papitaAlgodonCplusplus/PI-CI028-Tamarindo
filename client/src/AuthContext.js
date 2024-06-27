import React, { createContext, useState, useEffect } from 'react';
import axios from "axios"
import { showErrorDialog } from './Misc';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const [userId, setUserId] = useState(() => localStorage.getItem('userId'));
  const [userRol, setUserRol] = useState(() => localStorage.getItem('userRol'));
  const [userEmail, setUserEmail] = useState(() => localStorage.getItem('userEmail'));

  useEffect(() => {
    localStorage.setItem('userId', userId);
    localStorage.setItem('isLoggedIn', isLoggedIn);
    localStorage.setItem('userRol', userRol);
    localStorage.setItem('userEmail', userEmail);
  }, [userId, isLoggedIn, userRol, userEmail]);

  const login = async (userId) => {
    setIsLoggedIn(true);
    setUserId(userId);
    try {
      const userReservationsResponse = await axios.get(`/auth/getUserbyID${userId}`);
      setUserRol(userReservationsResponse.data[0].rol);
      setUserEmail(userReservationsResponse.data[0].email);
    } catch (error) {
      showErrorDialog("Error", "Couldn't get user rol or email")
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserId(null);
    setUserRol("");
    localStorage.removeItem('userId');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRol');
    localStorage.removeItem('userEmail');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userId, userRol, userEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
