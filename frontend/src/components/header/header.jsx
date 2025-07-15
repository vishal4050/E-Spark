import React, { useState, useEffect } from 'react';
import "./header.css";
import { Link, useLocation } from 'react-router-dom';
import { MdLightMode, MdDarkMode } from 'react-icons/md';

// Theme Toggle Component
const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setIsDarkMode(!isDarkMode);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <button 
      onClick={toggleTheme}
      className="theme-toggle-btn"
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDarkMode ? <MdLightMode /> : <MdDarkMode />}
    </button>
  );
};

// Header Component
const Header = ({ isAuth }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const showBoth = ["/", "/courses", "/about"].includes(currentPath);

  return (
    <header>
      <div className="logo">
        <img src="../../assets/app-icon.png" alt="E-Learning" />
        duSpark
      </div>

      <div className="links">
        <Link to="/">Home</Link>
        <Link to="/courses">Courses</Link>
        <Link to="/about">About Us</Link>

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
      </div>

      <ThemeToggle />
    </header>
  );
};

export default Header;
