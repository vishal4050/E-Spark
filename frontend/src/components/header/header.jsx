import React from 'react'
import "./header.css"
import { Link } from 'react-router-dom'
const Header= () => {
    return (
        <header>
            <div className="logo">
                E-learning
            </div>
            <div className="links">
                <Link to="/">Home</Link>
                <Link to="/courses">Courses</Link>
                <Link to="/about">About Us</Link>
                <Link to="/account">Account</Link>
                </div>
        </header>

    )
}

export default Header;
