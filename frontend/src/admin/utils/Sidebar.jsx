import React from 'react'
import "./common.css"
import { Link } from 'react-router-dom'
import { IoHome,IoBook } from "react-icons/io5";
import { FaUserSecret } from "react-icons/fa";
import { RiLogoutCircleLine } from "react-icons/ri";
const Sidebar = () => {
  return (
   <div className="sidebar">
    <ul>
      <li>
       <Link to={'/admin/dashboard'}>
       <div className="icon">
         <IoHome/>
       </div>
       <span>Home</span>
       </Link>
      </li>
      <li>
       <Link to={'/admin/course'}>
       <div className="icon">
         <IoBook />
       </div>
       <span>Course</span>
       </Link>
      </li>
     <li>
       <Link to={'/admin/users'}>
       <div className="icon">
       <FaUserSecret />
       </div>
       <span>Users</span>
       </Link>
      </li>
      <li>
       <Link to={'/account'}>
       <div className="icon">
       <RiLogoutCircleLine />
       </div>
       <span>Logout</span>
       </Link>
      </li>
    </ul>
   </div>
  )
}

export default Sidebar
