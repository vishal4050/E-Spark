import React, { useState } from 'react'
import "./auth.css"
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import axios from 'axios'
const server="http://localhost:5000"
const ForgotPassword = () => {
    const [email, setEmail] = useState("")
    const [btnLoading,setBtnLoading]=useState(false)
    const navigate=useNavigate();
const HandleSubmit=async(e)=>{
    e.preventDefault();
    setBtnLoading(true);
    try{ 
          const {data}= await axios.post(`${server}/api/user/forgot`,{email});
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
    <h2>Forgot Password</h2>
    <form  onSubmit={HandleSubmit}>
        <label htmlFor="text">Enter Email</label>
        <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
        <button disabled={btnLoading} type="submit" className='common-btn'>{btnLoading?"Please wait...":"Send Reset Link"}</button>
    </form>
   </div>
   </div>
  )
}

export default ForgotPassword
