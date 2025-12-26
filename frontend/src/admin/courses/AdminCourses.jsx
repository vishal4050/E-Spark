import React, { useState, useEffect } from "react";
import Layout from "../utils/Layout";
import { useNavigate } from "react-router-dom";
import { CourseData } from "../../context/CourseContext";
import CourseCard from "../../components/coursecard/CourseCard";
import "./admincourses.css";
import toast from "react-hot-toast";
import axios from "axios";

const categories = [
    "Web Development",
    "Data Science",
    "Artificial Intelligence",
    "Cyber Security",
    "Networking",
    "Cloud Computing",
    "App Development",
    "Game Development",
    "Civil Engineering",
]

const server = "http://localhost:5000"

const AdminCourses = ({ user }) => {
  const navigate = useNavigate();
  if (user.role !== "admin") navigate("/");
  const { courses, fetchCourses } = CourseData();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [duration, setDuration] = useState("");
  const [image, setImage] = useState("");
  const [imagePrev, setImagePrev] = useState("");
  const [btnloading, setBtnLoading] = useState(false);
  const [show, setShow] = useState(false);
  
  // Search functionality states
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);

  // Filter courses based on search term
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredCourses(courses);
    } else {
      const filtered = courses.filter(course =>
        course.createdBy.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCourses(filtered);
    }
  }, [searchTerm, courses]);

  const changeImageHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImagePrev(reader.result);
      setImage(file);
    };
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setBtnLoading(true);
    const myForm = new FormData();
    myForm.append("title", title);
    myForm.append("description", description);
    myForm.append("category", category);
    myForm.append("price", price);
    myForm.append("duration", duration)
    myForm.append("image", image);
    myForm.append("createdBy", createdBy);

    try {
      const { data } = await axios.post(`${server}/api/course/new`, myForm, {
        headers: {
          token: localStorage.getItem("token"),
        }
      });
      toast.success(data.message);
      setBtnLoading(false);
      await fetchCourses();
      setImage("");
      setTitle("");
      setDescription("");
      setCategory("");
      setPrice("");
      setDuration("");
      setCreatedBy("");
      setImagePrev("");

    }
    catch (error) {
      toast.error(error.response.data.message)
      setBtnLoading(false);
    }
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  }

  const clearSearch = () => {
    setSearchTerm("");
  }

  return (
    <Layout>
      <div className={`admin-courses ${show ? 'form-open' : 'form-closed'}`}>
        <div className="left">
          <h1>All Courses</h1>
          
          {/* Search Input */}
          <div className="search-container" style={{ marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="Search courses by instructor/creator..."
              value={searchTerm}
              onChange={handleSearchChange}
              style={{
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                width: '300px',
                marginRight: '10px'
              }}
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                style={{
                  padding: '10px 15px',
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Clear
              </button>
            )}
          </div>

          {/* Results count */}
          <div style={{ marginBottom: '15px', color: '#666' }}>
            {searchTerm ? 
              `Found ${filteredCourses.length} course(s) created by "${searchTerm}"` : 
              `Total courses: ${courses.length}`
            }
          </div>

          <div className="dashboard-content">
            {filteredCourses && filteredCourses.length > 0 ? (
              filteredCourses.map((e) => {
                return <CourseCard key={e._id} course={e} />;
              })
            ) : searchTerm ? (
              <div style={{ textAlign: 'center', marginTop: '20px', color: '#999' }}>
                No courses found created by "{searchTerm}"
              </div>
            ) : (
              <p>No Courses Yet!</p>
            )}
          </div>
        </div>
        
        {show && (
          <div className="right">
            <div className="add-course">
              <div className="course-form">
                <h2>Add Course</h2>
                <form onSubmit={submitHandler}>
                  <label htmlFor="title">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                  <label htmlFor="description">Description</label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                  <label htmlFor="price">Price</label>
                  <input
                    type="number"
                    placeholder="₹"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                  <label htmlFor="duration">Duration</label>
                  <input
                    placeholder="Weeks"
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    required
                  />
                  <label htmlFor="createdBy">CreatedBy</label>
                  <input
                    type="text"
                    value={createdBy}
                    onChange={(e) => setCreatedBy(e.target.value)}
                    required
                  />
                  <select name="category" value={category} onChange={e => setCategory(e.target.value)}>
                    <option value={""}>Select Category</option>{
                      categories.map((e) => (
                        <option value={e} key={e}>{e}</option>
                      ))
                    }
                  </select>
                  <input name="image" type="file" required onChange={changeImageHandler} />

                  {imagePrev && <img src={imagePrev} alt="" width={300}></img>}
                  <button type="submit" disabled={btnloading} className="common-btn">
                    {btnloading ? "Please wait..." : "Add"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
        
        <div className="toggle-button-container">
          <button className="common-btn" onClick={() => setShow(!show)}>
            {show ? "Close" : "Add New Course +"}
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default AdminCourses;