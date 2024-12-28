import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import User from './Routes/User'
import { Toaster } from 'sonner'
import Employer from './Routes/Employer'
import Admin from './Routes/Admin'

function App() {
  return (
    <>
    <Router>
      <Routes>
          <Route path='/*' element={<User />} />
          <Route path='/employer/*' element={<Employer />} />
          <Route path='/admin/*' element={<Admin />} />
          
      </Routes>
    </Router>
    <Toaster position="top-right" expand={true} closeButton richColors duration={5000} />
    </>
  )
}

export default App