import React, { useEffect, useState } from 'react'
import "./users.css"
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import Layout from '../utils/Layout';
import toast from 'react-hot-toast';
const server="http://localhost:5000"
const Users = ({user}) => {
  const navigate=useNavigate();
  if(user && user.role!=="admin") return navigate("/")
  const [users,setUsers]=useState([])
async function fetchUsers() {
  try{
        const {data}=await axios.get(`${server}/api/users`,{
          headers:{
            token:localStorage.getItem("token")
          }
        })
        setUsers(data.users)

  }
  catch(error){
    console.log(error);
  }
}
useEffect(()=>{
  fetchUsers();
},[])
const updateRole=async(id)=>{
  toast.dismiss();
  if(confirm("Are you sure you want to update this user's role ?")){
    try{
      const {data}=await axios.put(`${server}/api/user/${id}`,{},{
        headers:{
          token:localStorage.getItem("token")
        }
      });
      toast.success(data.message);
      fetchUsers();
    }
    catch(error){
            toast.error(error.response.data.message);
    }
  }
}

  return (
  <Layout>
    <div className="users">
      <h1>Users</h1>
      <table border={"black"}>
        <thead>
          <tr>
            <td>Serial No.</td>
            <td>Name</td>
            <td>Email</td>
            <td>Role</td>
            <td>Update role</td>
            </tr>
        </thead>
        {
          users &&users.map((e,i)=>(
            <tbody>
              <tr>
                <td>{i+1}</td>
                <td>{e.name}</td>
                <td>{e.email}</td>
                <td>{e.role}</td>
                <td>
                  <button onClick={()=>updateRole(e._id)} className='common-btn'>{e.role=="admin"?"Change Role as User":"Change Role as Admin"}</button>
                </td>
              </tr>
            </tbody>
          ))
        }
      </table>
    </div>
  </Layout>
  )
}

export default Users
