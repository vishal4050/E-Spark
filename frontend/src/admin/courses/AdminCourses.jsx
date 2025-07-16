import React, { useState } from "react";
import Layout from "../utils/Layout";
import { useNavigate } from "react-router-dom";
import { CourseData } from "../../context/CourseContext";
import CourseCard from "../../components/coursecard/CourseCard";
import "./admincourses.css";
import toast from "react-hot-toast";
import axios from "axios";

const categories=[
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

const server="http://localhost:5000"

const AdminCourses = ({user}) => {
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
  const [show,setShow]=useState(false);
  
  const changeImageHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImagePrev(reader.result);
      setImage(file);
    };
  };

  const submitHandler=async(e)=>{
        e.preventDefault();
        setBtnLoading(true);
        const myForm=new FormData();
        myForm.append("title",title);
        myForm.append("description",description);
        myForm.append("category",category);
        myForm.append("price",price);
        myForm.append("duration",duration)
        myForm.append("file",image);
        myForm.append("createdBy",createdBy);

        try{
            const {data}=await axios.post(`${server}/api/course/new`,myForm,{
                headers:{
                    token:localStorage.getItem("token"),
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
        catch(error){
              toast.error(error.response.data.message)
              setBtnLoading(false);
        }
  }

  return (
    <Layout>
      <div className={`admin-courses ${show ? 'form-open' : 'form-closed'}`}>
        <div className="left">
          <h1>All Courses</h1>
          <div className="dashboard-content">
            {courses && courses.length > 0 ? (
              courses.map((e) => {
                return <CourseCard key={e._id} course={e} />;
              })
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
                  <select name="category" value={category} onChange={e=>setCategory(e.target.value)}>
                      <option value={""}>Select Category</option>{
                          categories.map((e)=>(
                              <option value={e} key={e}>{e}</option>
                          ))
                      }
                  </select>
                  <input type="file" required onChange={changeImageHandler} />

                  {imagePrev && <img src={imagePrev} alt="" width={300}></img>}
                  <button type="submit" disabled={btnloading} className="common-btn">
                      {btnloading?"Please wait...":"Add"}
                      </button>
                </form>
              </div>
            </div>
          </div>
        )}
        <div className="toggle-button-container">
          <button className="common-btn" onClick={()=>setShow(!show)}>
            {show?"Close":"Add New Course +"}
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default AdminCourses;