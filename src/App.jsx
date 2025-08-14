// src/App.jsx

import React, { useState, useEffect } from 'react';
import Login from './Components/Login.jsx';
import Dashboard from './Components/Dashboard.jsx';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase-config.js'; // The import path has been corrected

function App() {
  document.documentElement.setAttribute('data-theme', "light");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This listener checks for changes in the user's authentication state.
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (err) {
      console.error("Error signing out: ", err);
    }
  };

  if (loading) {
    // Show a loading state while Firebase checks the user's login status
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="font-sans antialiased text-gray-800">
      {user ? (
        // Render the main app dashboard if the user is signed in
        <Dashboard user={user} onSignOut={handleSignOut}/>
      ) : (
        // Otherwise, render the Login page
        <Login onSignIn={() => {}} />
      )}
    </div>
  );
}

export default App;
