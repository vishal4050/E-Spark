import React from 'react'
import { useNavigate } from 'react-router-dom'
import "./home.css"
import Testimonial from '../../components/testimonials/testimonials.jsx'
const Home = () => {
    const navigate = useNavigate();
    return (
        <div>
            <div className="home">
                <div className="home-content">
                    <h1>Welcome to E-learning Platform</h1>
                    <p>Explore a wide range of courses and enhance your skills.</p>
                    <button className='common-btn' onClick={() => navigate('/courses')}>Get Started</button>
                </div>
            </div>
            <Testimonial/>
        </div>
    )
}

export default Home
