import React from "react";
import "./App.css";
import Home from "./pages/home/Home.jsx";
import Header from "./components/header/header.jsx";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import Verify from "./pages/auth/Verify.jsx";
import About from "./pages/about/About.jsx";
import Account from "./pages/account/Account.jsx";
import Footer from "./components/footer/Footer.jsx";
import Loading from "./components/loading/Loading.jsx";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { UserData } from "./context/UserContext.jsx";
import Courses from "./pages/courses/Courses.jsx";
import CourseDescription from "./pages/coursedescription/CourseDescription.jsx";
import PaymentSuccess from "./pages/paymentsuccess/PaymentSuccess.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import CourseStudy from "./pages/coursestudy/CourseStudy.jsx";
import Lecture from "./pages/lectures/Lecture.jsx";
import AdminDashboard from "./admin/dashboard/AdminDashboard.jsx";
import AdminCourses from "./admin/courses/AdminCourses.jsx";
import AdminUsers from "./admin/users/AdminUsers.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";
import ResetPassword from "./pages/auth/ResetPassword.jsx";
import LiveClassroom from "./pages/live/LiveClassroom.jsx";
import TeacherRoom from "./pages/live/TeacherRoom";
import StudentRoom from "./pages/live/StudentRoom";
const App = () => {
  const { isAuth, user, loading } = UserData();

  if (loading) return <Loading />;

  return (
    <BrowserRouter>
      <Header isAuth={isAuth} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={isAuth ? <Home /> : <Register />} />
        <Route path="/login" element={isAuth ? <Home /> : <Login />} />
        <Route path="/verify" element={isAuth ? <Home /> : <Verify />} />
        <Route path="/forgot" element={isAuth?<Home/>:<ForgotPassword/>}/>
        <Route path="/reset-password/:token" element={isAuth?<Home/>:<ResetPassword/>}/>
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<h1>Contact Us</h1>} />
         <Route path="/courses" element={<Courses/>} />
        <Route path="/account" element={isAuth ? <Account user={user} /> : <Login />} />
        <Route path="/course/:id" element={isAuth?<CourseDescription />:<Login/>}/>
        <Route path="/payment-success/:id" element={isAuth?<PaymentSuccess user={user}/>:<Login/>}/>
        <Route path="/:id/dashboard" element={isAuth?<Dashboard user={user}/>:<Login/>}/>
        <Route path="/course/study/:id" element={isAuth?<CourseStudy user={user}/>:<Login/>}/>
        <Route path="/lectures/:id" element={isAuth?<Lecture user={user}/>:<Login/>}/>
        <Route path="/admin/dashboard" element={isAuth?<AdminDashboard user={user}/>:<Login/>}/>
         <Route path="/admin/course" element={isAuth?<AdminCourses user={user}/>:<Login/>}/>
         <Route path="/admin/users" element={isAuth?<AdminUsers user={user}/>:<Login/>}/>
         <Route path="/live-class" element={<LiveClassroom />} />
         <Route path="/live/teacher/:id" element={<TeacherRoom />} />
         <Route path="/live/student/:id" element={<StudentRoom />} />  
         

         
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
