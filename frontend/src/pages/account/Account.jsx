import React, { use } from 'react'
import "./account.css"
import { RiDashboardHorizontalFill,RiLogoutCircleLine } from "react-icons/ri";
import { UserData } from '../../context/UserContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
const Account = ({ user }) => {
    const {setIsAuth,setUser}=UserData();
    const navigate=useNavigate();
    const logoutHandler=()=>{
        localStorage.clear();
        setUser([]);
        setIsAuth(false);
        toast.success("Logged Out");
        navigate("/login")
    }
    return (
        <div>
            <div className="profile">
                <h2>
                    My Profile
                </h2>
                <div className="profile-info">
                    <p>
                        <strong>Name- {user.name}</strong>
                    </p>
                    <p>
                        <strong>
                            Email- {user.email}
                        </strong>

                    </p>

                    <button className="common-btn">
                        <RiDashboardHorizontalFill />
                        Dashboard
                    </button>
                    <br />
                    <button className="common-btn" style={{background:"red"}} onClick={logoutHandler}>
                       <RiLogoutCircleLine />
                        Logout
                    </button>


                </div>
            </div>
        </div>
    )
}

export default Account
