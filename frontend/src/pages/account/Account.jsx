import React from 'react'
import "./account.css"
import { RiDashboardHorizontalFill } from "react-icons/ri";
const Account = () => {
    return (
        <div>
            <div className="profile">
                <h2>
                    My Profile
                </h2>
                <div className="profile-info">
                    <p>
                        <strong>Name-Vishal</strong>
                    </p>
                    <p>
                        <strong>
                            Email-vishal11@gmail.com
                        </strong>

                    </p>
                   
                        <button className="common-btn">
                          <RiDashboardHorizontalFill />
                           Dashboard
                        </button>
                        
                    
                </div>
            </div>
        </div>
    )
}

export default Account
