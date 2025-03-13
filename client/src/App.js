import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppNavbar from "./components/AppNavbar";
import Home from "./pages/Home";
import { UserProvider } from "./context/UserContext"; 
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";

function App() {
  return (
    <UserProvider>
      <Router>
        <AppNavbar />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
