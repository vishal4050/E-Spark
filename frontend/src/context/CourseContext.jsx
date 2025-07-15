import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const CourseContext = createContext();

export const CourseContextProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const server = "http://localhost:5000";
  const [course,setCourse]=useState(null);
  async function fetchCourses() {
    try {
      const { data } = await axios.get(`${server}/api/course/all`);
      setCourses(data.courses);
    } catch (error) {
      console.log(error);
    }
  }
  async function fetchCourse(id) {
       try{
        const { data } = await axios.get(`${server}/api/course/${id}`);
        setCourse(data.course);
       }
       catch(error){
        console.log(error);
       } 
    }

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <CourseContext.Provider value={{ courses, fetchCourses,fetchCourse,course }}>
      {children}
    </CourseContext.Provider>
  );
};

export const CourseData = () => useContext(CourseContext);
