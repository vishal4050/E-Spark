import React from 'react';
import "./paymentsuccess.css";
import { useParams, Link } from 'react-router-dom';
import { UserData } from '../../context/UserContext';

const PaymentSuccess = () => {
    const params = useParams();
    const { user } = UserData(); // Get user from context
    
    return (
        <div className="payment-success-page">
            <div className="success-message">
                <div className="success-icon">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22,4 12,14.01 9,11.01"/>
                    </svg>
                </div>
                <h2>Payment Successful!</h2>
                <p>Thank you for your purchase!</p>
                <p className="reference-number">Reference no: {params.id}</p>
                
                <div className="action-buttons">
                    {user ? (
                        <Link to={`/${user._id}/dashboard`} className="common-btn">
                            Go to Dashboard
                        </Link>
                    ) : (
                        <Link to="/login" className="common-btn">
                            Login to Continue
                        </Link>
                    )}
                    <Link to="/courses" className="common-btn ">
                        Browse More Courses
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;