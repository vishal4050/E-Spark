import React from 'react';
import "./courses.css"
import CourseCard from '../../components/coursecard/CourseCard';
import { CourseData } from '../../context/CourseContext';
const Courses = () => {
  const {courses}=CourseData();
  return (
    <div className='courses'>
      <h2>Available Courses</h2>
      <div className="course-container">
          {
            courses && courses.length>0? courses.map((e)=>(
              <CourseCard key={e.id} course={e} />
            )):<p>No Courses Yet!</p>
          }
      </div>
      
    </div>
  );
};

export default Courses