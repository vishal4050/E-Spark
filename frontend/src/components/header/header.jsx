import React, { useState, useEffect } from "react";
import "./header.css";
import { Link, useLocation } from "react-router-dom";
import { MdViewSidebar } from "react-icons/md";
import { Sun, Moon } from "lucide-react";
import DarkModeToggle from "../DarkModeToggle/DarkModeToggle.jsx";
const Header = ({ isAuth }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const showBoth = ["/", "/courses", "/about"].includes(currentPath);

  /* ---------------- Sidebar ---------------- */
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  /* ---------------- Dark Mode ---------------- */
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("dark-mode") === "true";
  });

  useEffect(() => {
    document.body.classList.toggle("dark-mode", isDarkMode);
    localStorage.setItem("dark-mode", isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <header className={sidebarOpen ? "sidebar-active" : ""}>
      {/* Logo */}
      <div className="logo">
        <img src="../../assets/app-icon.png" alt="E-Learning" />
        <span>Spark</span>
      </div>

      {/* Sidebar Toggle (Mobile) */}
      <div className="sidebar-toggle" onClick={toggleSidebar}>
        <MdViewSidebar size={28} />
      </div>

      {/* Desktop Nav */}
      <nav className="links">
        {/* Dark Mode Button */}
        <button
          onClick={toggleDarkMode}
          className="simple-toggle-btn"
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <Link to="/">Home</Link>
        <Link to="/courses">Courses</Link>
        <Link to="/about">About Us</Link>
        <Link to="/live">Live Classroom</Link>
        {isAuth ? (
          <Link to="/account">Account</Link>
        ) : currentPath === "/login" ? (
          <Link to="/register">Register</Link>
        ) : currentPath === "/register" ? (
          <Link to="/login">Login</Link>
          
        ) : showBoth ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : null}
      </nav>

      {/* Mobile Sidebar */}
      <div className={`mobile-sidebar ${sidebarOpen ? "open" : ""}`}>
        {/* Mobile Dark Mode */}
        <button
          onClick={toggleDarkMode}
          className="simple-toggle-btn mobile"
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
        </button>

        <Link to="/" onClick={toggleSidebar}>Home</Link>
        <Link to="/courses" onClick={toggleSidebar}>Courses</Link>
        <Link to="/about" onClick={toggleSidebar}>About Us</Link>
        <Link to="/live" onClick={toggleSidebar}>Live Classroom</Link>
        {isAuth ? (
          <Link to="/account" onClick={toggleSidebar}>Account</Link>
        ) : currentPath === "/login" ? (
          <Link to="/register" onClick={toggleSidebar}>Register</Link>
        ) : currentPath === "/register" ? (
          <Link to="/login" onClick={toggleSidebar}>Login</Link>
        ) : showBoth ? (
          <>
            <Link to="/login" onClick={toggleSidebar}>Login</Link>
            <Link to="/register" onClick={toggleSidebar}>Register</Link>
          </>
        ) : null}
      </div>
    </header>
  );
};

export default Header;
