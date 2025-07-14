import React from 'react'
import { Link } from 'react-router-dom'
import "./auth.css"
const Login = () => {
  return (
    <div className="auth-page">
        <div className="auth-form">
            <h2>Register</h2>
            <form>
                <label htmlFor="name">Name:</label>
                <input type="text" id="name" name="name" required />
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" required />
                <label htmlFor='password'>Password:</label>
                <input type="password" id="password" name="password" required />
                <label htmlFor='confirm-password'>Confirm Password:</label>
                <input type="password" id="confirm-password" name="confirm-password" required />
                <button className='common-btn' type="submit">
                    Register
                </button>
            </form>
            <p>Already have an account? <Link to="/login">Login</Link></p>
            </div>
    </div>
  )
}

export default Login
