import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CourseData } from '../../context/CourseContext';
import { UserData } from '../../context/UserContext';
import "./coursedescription.css";
import axios from 'axios';
import toast from 'react-hot-toast';
import Loading from '../../components/loading/Loading';

const server = "http://localhost:5000";

const CourseDescription = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { fetchCourse, course, fetchCourses } = CourseData();
  const { user, isAuth, fetchUser } = UserData();

  useEffect(() => {
    if (isAuth) fetchCourse(params.id);
  }, [params.id]);

  const checkoutHandler = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);

    try {
      const { data: { order } } = await axios.post(
        `${server}/api/course/checkout/${params.id}`,
        {},
        {
          headers: {
            token,
          }
        }
      );

      const options = {
        key: "rzp_test_ntTBOHADtdtMhB", // Your Razorpay test key
        amount: order.amount,
        currency: "INR",
        name: "EduSpark",
        description: "Learn with EduSpark",
        image: "/assets/app-icon.png",
        order_id: order.id,
        method: {
          upi: true,
          card: true,
          netbanking: true,
          wallet: true,
        },
        prefill: {
          method: "upi"
        },
        handler: async (response) => {
          const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
          } = response;

          try {
            const { data } = await axios.post(
              `${server}/api/verification/${params.id}`,
              {
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature
              },
              {
                headers: {
                  token,
                }
              }
            );

            await fetchUser();
            await fetchCourses();
            toast.success(data.message);
            setLoading(false);
            navigate(`/payment-success/${razorpay_payment_id}`);
          } catch (error) {
            toast.error(error.response.data.message);
            setLoading(false);
          }
        },
        theme: {
          color: "#8a4baf"
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error(error.response?.data?.message || "Checkout failed");
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? <Loading /> : (
        course && (
          <div className="course-description">
            <div className="course-header">
              <img src={`${server}/${course.image}`} alt="" className='course-image' />
              <div className="course-info">
                <h2>{course.title}</h2>
                <p>Instructor: {course.createdBy}</p>
                <p>Duration: {course.duration} weeks</p>
              </div>
              <p>Course Description: {course.description}</p>
              <p>Let's get started with this course at ₹{course.price}</p>
              {
                isAuth && user?.subscription?.includes(course._id) ? (
                  <button className='common-btn' onClick={() => navigate(`/course/study/${course._id}`)}>
                    Study
                  </button>
                ) : (
                  <button className='common-btn' onClick={checkoutHandler}>
                    Buy Now
                  </button>
                )
              }
            </div>
          </div>
        )
      )}
    </>
  );
};

export default CourseDescription;
