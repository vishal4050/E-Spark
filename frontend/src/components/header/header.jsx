import React from 'react';
import "./header.css";
import { Link, useLocation } from 'react-router-dom';

// Header Component
const Header = ({ isAuth }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const showBoth = ["/", "/courses", "/about"].includes(currentPath);
  
  return (
    <header>
      <div className="logo">
        <img src="../../assets/app-icon.png" alt="E-Learning" />
        Spark
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
    </header>
  );
};

export default Header;