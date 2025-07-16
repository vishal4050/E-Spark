import React, { useState } from 'react'
import { Link,useNavigate} from 'react-router-dom'
import "./auth.css"
import {UserData} from "../../context/UserContext"
import { CourseData } from '../../context/CourseContext'
const Login = () => {
  const navigate=useNavigate()
  const {btnLoading,loginUser}=UserData()
  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")

  const {fetchMyCourse}=CourseData();
  const submitHandler=async(e)=>{
    e.preventDefault();
    await loginUser({
  email: email.trim().toLowerCase(),
  password,
  navigate,
  fetchMyCourse
});

  }
  return (
    <div className="auth-page">
        <div className="auth-form">
            <h2>Login</h2>
            <form onSubmit={submitHandler}>
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
                <label htmlFor='password'>Password:</label>
                <input type="password" id="password" name="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
                <button disabled={btnLoading} className='common-btn' type="submit"> {btnLoading? "Please wait...":"Login"}</button>
               
            </form>
            <p>Don't have an account? <Link to="/register">Register</Link></p>
            <p><Link to="/forgot">Forgot password?</Link></p>
            </div>
    </div>
  )
}

export default Login
