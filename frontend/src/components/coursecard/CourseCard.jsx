import React from 'react';
import "./coursecard.css";
import { UserData } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
const server = "http://localhost:5000"; // define it here

const CourseCard = ({ course }) => {
  const {user,isAuth}=UserData();
  const navigate=useNavigate();
  return (
    <div className="course-card">
      <img src={`${server}/${course.image}`} alt="" className='course-image' />
      <h3>{course.title}</h3>
      <p>Instructor - {course.createdBy}</p>
      <p>Duration - {course.duration} weeks</p>
      <p>Price - ₹ {course.price}</p>
      {
        isAuth?<>
         {user&&user.role!=="admin"?(
          <>
          {
            user.subscription.includes(course._id)?(<button onClick={()=>navigate(`/course/study/${course._id}`)} className='common-btn'>Study</button>):(
              <button onClick={()=>navigate(`/course/${course._id}`)} className="common-btn">Get Started</button>
            )
          }
          </>
         ):(<button onClick={()=>navigate(`/course/study/${course._id}`)} className='common-btn'>Study</button>)}
        </>
        :
        (
          <button onClick={()=>navigate("/login")} className='common-btn'>Get Started</button>)
      }
      <br/>
      {
        user &&user.role==="admin" &&  <button className='common-btn' style={{background:"red", marginTop:"5px"}}>Delete</button>
      }
    </div>
  );
};

export default CourseCard;
