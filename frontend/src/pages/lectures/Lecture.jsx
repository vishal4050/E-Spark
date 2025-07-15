import React, { useEffect, useState } from 'react'
import "./lecture.css"
import { useParams } from 'react-router-dom'
import axios from 'axios'
import Loading from '../../components/loading/Loading'
import { RiH1 } from 'react-icons/ri'
const server = "http://localhost:5000"
const Lecture = ({ user }) => {
    const [lectures, setLectures] = useState([])
    const [lecture, setLecture] = useState([])
    const [loading, setLoading] = useState(true);
    const [lecLoading, setLecLoading] = useState(false)
    const [show, setShow] = useState(false);
    const params = useParams()

    async function fetchLectures() {
        try {
            const { data } = await axios.get(`${server}/api/lectures/${params.id}`, {
                headers: {
                    token: localStorage.getItem("token"),
                }
            });
            setLectures(data.lectures);
            setLoading(false);
        }
        catch (error) {
            console.log(error)
            setLoading(false);
        }
    }
    async function fetchLecture(id) {
        try {
            const { data } = await axios.get(`${server}/api/lecture/${id}`, {
                headers: {
                    token: localStorage.getItem("token"),
                }
            });
            setLecture(data.lecture);
            setLecLoading(false);
            setShow(false); // Close the form when a lecture is selected
        }
        catch (error) {
            console.log(error);
            setLecLoading(false);
        }
    }
    useEffect(() => {
        fetchLectures();
    }, [])
    return (
        <>
            {
                loading ? <Loading /> : <>
                    <div className="lecture-page">
                        <div className="left">
                            {
                                lecLoading ? <Loading /> : <>
                                    {
                                        show ? (
                                            <div className="lecture-form">
                                                <h2>Add lecture</h2>
                                                <form >
                                                    <label htmlFor="text">Title</label>
                                                    <input type="text" required />
                                                    <label htmlFor="text">Description</label>
                                                    <input type="text" required />

                                                    <input type="file" placeholder='choose video' required />
                                                    <button type="submit" className='common-btn'>Add</button>
                                                </form>
                                            </div>
                                        ) : (
                                            lecture.video ? <>
                                                <video src={`${server}/${lecture.video}`} width={"100%"} controls controlsList='nodownload noremoteplayback' disablePictureInPicture disableRemotePlayback autoPlay></video>
                                                <h1>{lecture.title}</h1>
                                                <h3>Description :  {lecture.description}</h3>
                                            </> : <h1>Please Select a Lecture</h1>
                                        )
                                    }
                                </>
                            }
                        </div>
                        <div className="right">
                            {user && user.role === "admin" && (
                                <button className='common-btn' onClick={() => setShow(!show)}>
                                    {show?"Close Form":"Add Lecture +"}
                                </button>
                            )}
                            {
                                lectures && lectures.length > 0 ? lectures.map((e, i) => (
                                    <><div onClick={() => fetchLecture(e._id)} key={i} className={`lecture-number ${e._id === lecture._id ? "active" : ""}`}>
                                        {i + 1}. {e.title}
                                    </div>
                                        {
                                            user && user.role === "admin" && (<button style={{ background: "red" }} className='common-btn' onClick={() => deleteLecture(e._id)}>Delete {e.title}</button>)
                                        }
                                    </>)) : <p>No Lecture Yet!</p>
                            }
                        </div>
                    </div>
                </>
            }
        </>
    )
}

export default Lecture