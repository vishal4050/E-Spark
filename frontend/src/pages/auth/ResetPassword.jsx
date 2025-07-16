import React, { useState } from 'react'
import "./auth.css"
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useParams } from 'react-router-dom';
const server="http://localhost:5000";
const ResetPassword = () => {
    const navigate=useNavigate()
    const [password,setPassword]=useState("");
    const [confirmPassword,setConfirmPassword]=useState("");
    const [btnLoading,setBtnLoading]=useState();
    const params=useParams();
const HandleSubmit=async(e)=>{
    e.preventDefault();
    if(password!==confirmPassword) return toast.error("Passwords do not match");
    setBtnLoading(true);
    try{ 
          const {data}= await axios.post(`${server}/api/user/reset?token=${params.token}`,{password});
          toast.success(data.message);
          navigate("/login");
          setBtnLoading(false);
    }
    catch(error){
        toast.error(error.response.data.message);
        setBtnLoading(false);
    }
}
  return (
    <div className="auth-page">
    <div className="auth-form">
    <h2>Reset Password</h2>
    <form  onSubmit={HandleSubmit}>
        <label htmlFor="text">New Password</label>
        <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
         <label htmlFor="text">Confirm Password</label>
        <input type="password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} required />
        <button disabled={btnLoading} type="submit" className='common-btn'>{btnLoading?"Please wait...":"Reset Password"}</button>
    </form>
   </div>
   </div>
  )
}

export default ResetPassword
