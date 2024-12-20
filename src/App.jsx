import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import User from './Routes/User'
import { Toaster } from 'sonner'
import ProfilePage from './pages/Profile'

function App() {

  return (
    <>
    <Router>
      <Routes>
          <Route path='/*' element={<User />} />
          <Route path='/profile' element={<ProfilePage />} />
          
      </Routes>
    </Router>
    <Toaster position="top-right" expand={true} closeButton richColors duration={5000} />
    </>
  )
}

export default App