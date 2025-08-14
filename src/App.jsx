// src/App.jsx

import React, { useState, useEffect } from 'react';
import Login from './Components/Login.jsx';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase-config.js'; // The import path has been corrected

function App() {
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
        <div>
          <header className="bg-white shadow-md p-4 flex justify-between items-center">
            <h1 className="text-xl font-bold">FitCheck Dashboard</h1>
            <button onClick={handleSignOut} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200">
              Sign Out
            </button>
          </header>
          <main className="container mx-auto p-4">
            <h2 className="text-3xl font-semibold mb-4">Welcome back, {user.email}!</h2>
            <div className="p-8 bg-white rounded-lg shadow-md">
              <p>This is your personalized dashboard. You are now authenticated!</p>
              {/* This is where your weather, calendar, and outfit components will go */}
            </div>
          </main>
        </div>
      ) : (
        // Otherwise, render the Login page
        <Login onSignIn={() => {}} />
      )}
    </div>
  );
}

export default App;
