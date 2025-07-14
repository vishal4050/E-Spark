import React from 'react'
import "./App.css" 
import Home from "./pages/home/Home.jsx"
import Header from "./components/header/header.jsx"
import Login from "./pages/auth/Login.jsx"
import Register from './pages/auth/Register.jsx'
import Verify from './pages/auth/Verify.jsx'
import About from './pages/about/about.jsx'
import Account from "./pages/account/Account.jsx"
// 
import {
  BrowserRouter,Route, Routes
} from 'react-router-dom'
import Footer from './components/footer/Footer.jsx'
import { UserData } from './context/UserContext.jsx'
const App = () => {
 const { isAuth } = UserData();
  return <>
  <BrowserRouter>
      <Header isAuth={isAuth} />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={isAuth?<Home/>:<Register />} />
      <Route path="/login" element={isAuth?<Home/>:<Login/>} />
      <Route path="/verify" element={isAuth?<Home/>:<Verify/>}/>
      <Route path="/about" element={<About/>} />
      <Route path="/contact" element={<h1>Contact Us</h1>} />
      <Route path="/account" element={isAuth?<Account/>:<Login/>}/>
    </Routes>
   <Footer/>
  </BrowserRouter>
  </>
}

export default App
