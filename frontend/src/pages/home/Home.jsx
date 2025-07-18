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
                    <h1>Welcome to E Spark</h1>
                    <p>Explore a wide range of courses and enhance your skills.</p>
                    <button className='common-btn' onClick={() => navigate('/courses')}>Get Started</button>
                </div>
            </div>
            <h1 className='student-testimonials'>What our student says</h1>
            <Testimonial/>
        </div>
    )
}

export default Home
