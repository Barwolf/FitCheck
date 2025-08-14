// src/App.jsx

import React, { useState, useEffect } from 'react';
import Login from './Components/Login.jsx';
import Dashboard from './Components/Dashboard.jsx';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase-config.js';

function App() {
  document.documentElement.setAttribute('data-theme', 'light');
  const [user, setUser] = useState(null);
  const [googleAccessToken, setGoogleAccessToken] = useState(null); // State for the Google token
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
      setGoogleAccessToken(null); // Clear the token on sign out
      setUser(null);
    } catch (err) {
      console.error("Error signing out: ", err);
    }
  };

  const handleGoogleSignIn = (token) => {
    setGoogleAccessToken(token); // Save the token from the Login component
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="font-sans antialiased text-gray-800">
      {user ? (
        // Pass the Google access token to the Dashboard
        <Dashboard user={user} onSignOut={handleSignOut} googleAccessToken={googleAccessToken} />
      ) : (
        // Pass the token setter to the Login component
        <Login onSignIn={() => {}} onGoogleSignIn={handleGoogleSignIn} />
      )}
    </div>
  );
}

export default App;