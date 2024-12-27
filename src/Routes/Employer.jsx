import { Routes, Route } from 'react-router-dom'
import Dashboard from '../pages/Employer/Dashboard'
import EmployerLogin from '../pages/Employer/EmployerLogin'
import Register from '../pages/Employer/Regitser'
import Profile from '../pages/Employer/Profile'

function Employer() {
    return (
        <Routes>
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/employer-login' element={<EmployerLogin />} />
            <Route path='/register' element={<Register />} />
            <Route path='/profile' element={<Profile />} />
        </Routes>
    )
}

export default Employer