import React, { useEffect, useState } from 'react'
import "./admindashboard.css"
import { useNavigate } from 'react-router-dom'
import Layout from '../utils/Layout';
import axios from 'axios';
const server="http://localhost:5000"
const AdminDashbaord = ({user}) => {
  const navigate=useNavigate();
  if(user.role!=="admin") navigate("/");

  const [stats, setStats] = useState([])

  async function fetchStats(){
    try{const {data}=await axios.get(`${server}/api/stats/all`,{
      headers:{
        token:localStorage.getItem("token"),
      }
    })
    setStats(data);
  }
  catch(error){
    console.log(error);
  }

}
useEffect(()=>{
  fetchStats()
},[])
  return (
    
    <div>
      <Layout>
       <div className="main-content">
        <div className="box">
          <p>Total Courses</p>
          <p>{stats.totalCourses}</p>

        </div>
        <div className="box">
          <p>Total Lectures</p>
          <p>{stats.totalLectures}</p>
        </div>
        <div className="box">
          <p>Total Users</p>
          <p>{stats.totalUsers}</p>
        </div>
       </div>
      </Layout>
      
    </div>
  )
}

export default AdminDashbaord
