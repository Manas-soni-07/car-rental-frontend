import { Route, Routes } from 'react-router-dom'
import React from 'react'
import "react-responsive-carousel/lib/styles/carousel.min.css"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './App.css'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import Home from './pages/Home/Home'
import Navbar from './component/Navbar/Navbar'
import CarDetails from './pages/CarDetails/CarDetails'
import MyBookings from './pages/MyBookings/MyBookings'
import HostAddCar from './pages/HostDashBoard/HostAddCar'
import UserDashboard from './pages/UserDashBoard/UserDashBoard';
import HostDashboard from './pages/HostDashBoard/HostDashBoard';


function App() {
  return (
    <>
    <Navbar/>
    <div className="pt-15 md:pt-15"> 
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/car/:id' element={<CarDetails />}/>
      {/* <Route path='/my-bookings' element={<MyBookings/>} /> */}
      <Route  path='/host/add-car' element={<HostAddCar/>} />
      <Route  path='/host/dashboard' element={<HostDashboard/>} />
      <Route path="/user/dashboard" element={<UserDashboard />} />
      
    </Routes>

     <ToastContainer position="top-right" autoClose={3000} />
     </div>
    </>
  )
}

export default App