// src/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { onAuthStateChanged, getAuth, signOut } from 'firebase/auth';
import { auth } from './firebase-config';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [googleAccessToken, setGoogleAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setGoogleAccessToken(null);
      setUser(null);
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  const value = {
    user,
    googleAccessToken,
    setGoogleAccessToken,
    handleSignOut
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};