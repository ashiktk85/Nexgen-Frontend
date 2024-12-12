import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import LoginPage from './pages/Login'

import LoginPage from './pages/Login' 

import ForgotPassword from './pages/ForgotPassword'
import RegisterOtp from './pages/RegisterOtp'


function App() {

  return (
    <>
      {/* <LoginPage /> */}
      <RegisterOtp />
    </>
  )
}

export default App
