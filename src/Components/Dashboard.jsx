import React from "react";
// The import for the logo was causing an error due to an incorrect file path in the build environment.
// We will assume the logo is in the public directory and reference it directly.
// import logo from "../assets/logo.png";
import Navbar from "./Navbar.jsx";
import Connections from "./Connections.jsx";

// The Dashboard component now accepts a prop called 'onSignOut'
function Dashboard({ user, onSignOut }) {
  return (
    <section className="m-5">
      <Navbar user={user} onSignOut={onSignOut}/>
      <Connections/>
    </section>

  );
}

export default Dashboard;
