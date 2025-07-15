import React, { useState } from 'react'
import "./auth.css"
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { UserData } from '../../context/UserContext';
const Verify = () => {
  const [otp,setOtp]=useState("");
  const {btnLoading,verifyOtp}=UserData()
  const navigate=useNavigate();
  const submitHandler=async(e)=>{
    e.preventDefault();
    await verifyOtp(Number(otp),navigate);
  }
   const location = useLocation();

  useEffect(() => {
    if (location.state?.message) {
      toast.dismiss();
      toast.success(location.state.message,{
  duration: 5000, // stays for 5 seconds
});
    }
  }, [location]);
  return (
    <div className="auth-page">
        <div className="auth-form">
            <h2>Verify Your Account</h2>
            <form onSubmit={submitHandler}>
                <label htmlFor="otp">Enter OTP:</label>
                <input type="number" id="otp" name="otp" value={otp} required  onChange={(e)=>setOtp(e.target.value)}/>
                <button disabled={btnLoading} className='common-btn' type="submit" onSubmit={submitHandler}>
                   {btnLoading?"Please wait...":"Verify"}
                </button>
            </form>
            <p>Back to <a href="/login">Login</a></p>
            

            
            
        
        </div>
    </div>
    
    
  )
}

export default Verify
