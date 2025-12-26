import React, { useEffect, useState } from "react";
import "./lecture.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Loading from "../../components/loading/Loading";
import toast from "react-hot-toast";
import { IoCheckmarkDoneCircle } from "react-icons/io5";

const server = "http://localhost:5000";

const Lecture = ({ user }) => {
  const [lectures, setLectures] = useState([]);
  const [lecture, setLecture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lecLoading, setLecLoading] = useState(false);
  const [show, setShow] = useState(false);
  const params = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState(null);
  const [videoPrev, setVideoPrev] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);

  const [completed, setCompleted] = useState(0);
  const [completedLec, setCompletedLec] = useState(0);
  const [lectLength, setLectLength] = useState(0);
  const [progress, setProgress] = useState({ completedLectures: [] });

  // Navigation guard for unauthorized users
  useEffect(() => {
    if (user && user.role !== "admin" && (!user.subscription.includes(params.id))) {
      navigate("/");
    }
  }, [user, params.id, navigate]);

  // Fetch all lectures for the course
  const fetchLectures = async () => {
    try {
      const { data } = await axios.get(`${server}/api/lectures/${params.id}`, {
        headers: { token: localStorage.getItem("token") },
      });
      setLectures(data.lectures);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch lectures");
    } finally {
      setLoading(false);
    }
  };

  // Fetch single lecture by ID
  const fetchLecture = async (id) => {
    try {
      setLecLoading(true);
      const { data } = await axios.get(`${server}/api/lecture/${id}`, {
        headers: { token: localStorage.getItem("token") },
      });
      setLecture(data.lecture);
      setShow(false); // close form
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch lecture");
    } finally {
      setLecLoading(false);
    }
  };

  // Add a new lecture
  const submitHandler = async (e) => {
    e.preventDefault();
    setBtnLoading(true);
    const myForm = new FormData();
    myForm.append("title", title);
    myForm.append("description", description);
    myForm.append("file", video);

    try {
      const { data } = await axios.post(`${server}/api/course/${params.id}/lecture`, myForm, {
        headers: { token: localStorage.getItem("token") },
      });
      toast.success(data.message);
      setShow(false);
      await fetchLectures();
      setTitle("");
      setDescription("");
      setVideo(null);
      setVideoPrev("");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add lecture");
    } finally {
      setBtnLoading(false);
    }
  };

  // Delete lecture
  const deleteHandler = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lecture?")) return;
    try {
      const { data } = await axios.delete(`${server}/api/lecture/${id}`, {
        headers: { token: localStorage.getItem("token") },
      });
      toast.success(data.message);
      fetchLectures();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete lecture");
    }
  };

  // Handle video file change
  const changeVideoHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setVideoPrev(reader.result);
      setVideo(file);
    };
  };

  // Add progress when video ends
  const addProgress = async (id) => {
    try {
      await axios.post(`${server}/api/user/progress`, null, {
        params: { course: params.id, lectureId: id },
        headers: { token: localStorage.getItem("token") },
      });
      fetchProgress();
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch user progress
  const fetchProgress = async () => {
    try {
      const { data } = await axios.get(`${server}/api/user/progress`, {
        params: { course: params.id },
        headers: { token: localStorage.getItem("token") },
      });
      setCompleted(data.courseProgressPercentage || 0);
      setCompletedLec(data.completedLectures?.length || 0);
      setLectLength(data.allLectures || 0);
      setProgress({ completedLectures: data.completedLectures || [] });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchLectures();
    fetchProgress();
  }, [params.id]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="progress">
            Lecture completed: {completedLec} out of {lectLength}
            <br />
            <progress value={completed} max={100}></progress> <p>{Math.round(completed)}%</p>
          </div>
          <div className="lecture-page">
            <div className="left">
              {lecLoading ? (
                <Loading />
              ) : show ? (
                <div className="lecture-form">
                  <h2>Add lecture</h2>
                  <form onSubmit={submitHandler}>
                    <label>Title</label>
                    <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} />
                    <label>Description</label>
                    <input type="text" required value={description} onChange={(e) => setDescription(e.target.value)} />
                    <input type="file" placeholder="choose video" required onChange={changeVideoHandler} />
                    {videoPrev && <video src={videoPrev} width={300} height={300} controls></video>}
                    <button disabled={btnLoading} type="submit" className="common-btn">
                      {btnLoading ? "Please wait..." : "Add"}
                    </button>
                  </form>
                </div>
              ) : lecture?.video ? (
                <>
                  <video
                    src={lecture.video}
                    width="100%"
                    controls
                    controlsList="nodownload noremoteplayback"
                    disablePictureInPicture
                    disableRemotePlayback
                    autoPlay
                    onEnded={() => addProgress(lecture._id)}
                  ></video>
                  <h1>{lecture.title}</h1>
                  <h3>Description: {lecture.description}</h3>
                </>
              ) : (
                <h1>Please Select a Lecture</h1>
              )}
            </div>
            <div className="right">
              {user?.role === "admin" && (
                <button className="common-btn" onClick={() => setShow(!show)}>
                  {show ? "Close Form" : "Add Lecture +"}
                </button>
              )}
              <div style={{ textAlign: "center", padding: "20px" }}>
                <h3>Lectures</h3>
              </div>
              {lectures.length > 0 ? (
                lectures.map((e, i) => (
                  <div key={e._id} className="lecture-item">
                    <div
                      onClick={() => fetchLecture(e._id)}
                      className={`lecture-number ${e._id === lecture?._id ? "active" : ""}`}
                    >
                      {i + 1}. {e.title}{" "}
                      {progress.completedLectures.includes(e._id) && (
                        <span style={{ color: "green", padding: "5px", borderRadius: "10px" }}>
                          <IoCheckmarkDoneCircle />
                        </span>
                      )}
                    </div>
                    {user?.role === "admin" && (
                      <button
                        style={{ background: "red" }}
                        className="common-btn"
                        onClick={() => deleteHandler(e._id)}
                      >
                        Delete {e.title}
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <p>No Lecture Yet!</p>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Lecture;
