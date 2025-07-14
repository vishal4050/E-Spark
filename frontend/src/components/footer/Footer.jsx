import React from 'react'
import "./footer.css"
import { RiTwitterXFill, RiLinkedinBoxFill, RiInstagramFill } from "react-icons/ri";
import { GiNestedHearts } from "react-icons/gi";
const Footer = () => {
    return (
        <footer>
            <div className="footer-content">
                <p>
                    &copy; 2025 Your E-Learning Plateform. All rights reserved.<br />
                    Made with <GiNestedHearts/> <a href=''>Vishal</a>
                </p>
                <div className="social-links">
                    <a href="">
                        <RiTwitterXFill />
                    </a>
                    <a href="">
                        <RiLinkedinBoxFill />
                    </a>
                    <a href="">
                        <RiInstagramFill />
                    </a>
                </div>
            </div>
        </footer>


    )
}

export default Footer
