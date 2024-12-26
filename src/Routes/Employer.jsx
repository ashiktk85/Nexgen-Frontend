import { Routes, Route } from 'react-router-dom'
import Dashboard from '../pages/Employer/Dashboard'
import Login from '../pages/Employer/Login'
import Register from '../pages/Employer/Regitser'
import Profile from '../pages/Employer/Profile'

function Employer() {
    return (
        <Routes>
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/profile' element={<Profile />} />
        </Routes>
    )
}

export default Employer