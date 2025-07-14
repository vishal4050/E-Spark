import React from 'react'
import "./auth.css"
const Verify = () => {
  return (
    <div className="auth-page">
        <div className="auth-form">
            <h2>Verify Your Account</h2>
            <form>
                <label htmlFor="otp">Enter OTP:</label>
                <input type="number" id="otp" name="otp" required />
                <button className='common-btn' type="submit">
                    Verify
                </button>
            </form>
            <p>Didn't receive the OTP? <a href="/resend-otp">Resend OTP</a></p>
            <p>Back to <a href="/login">Login</a></p>
            

            
            
        
        </div>
    </div>
    
    
  )
}

export default Verify
