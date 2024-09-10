import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import Home from './Pages/Home_Components/Home'
import Services from './Pages/Services_Components/Services'
import Contact from './Pages/Contact_Components/Contact'
import './Styles/App.css'
import { ProtectedRoute } from './Pages/Admin/ProtectedRoute'
import { SHA256 } from 'crypto-js'
import { AdminDashboard } from './Pages/Admin/AdminDashboard'
import LoginForm from './Pages/Admin/login'
import { CameraAdd, CameraBoard, CameraEdit } from './Pages/Admin/CameraBoard'
import { QuoteBoard } from './Pages/Admin/QuoteBoard'

function App() {

  const hashedRoute = SHA256('admin-dashboard').toString()
  const hashedRoute2 = SHA256('camera-board').toString()
  const hashedRoute3 = SHA256('camera-edit').toString()
  const hashedRoute4 = SHA256('camera-add').toString()
  const hashedRoute5 = SHA256('quote-board').toString()

  return (
    <div className='container-fluid'>
      <Router>
        <Routes>
          <Route path='/home' element={<Home />} />
          <Route path='/services' element={<Services />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/' element={<Navigate to='/home' />} />

          <Route path='/login' element={<LoginForm />} />

          <Route path={`/admin-dashboard/${hashedRoute}`} element={<ProtectedRoute component={AdminDashboard} />} />
          <Route path={`/admin-dashboard/${hashedRoute2}`} element={<ProtectedRoute component={CameraBoard} />} />
          <Route path={`/admin-dashboard/${hashedRoute3}/:id`} element={<ProtectedRoute component={CameraEdit} />} />
          <Route path={`/admin-dashboard/${hashedRoute4}`} element={<ProtectedRoute component={CameraAdd} />} />
          <Route path={`/admin-dashboard/${hashedRoute5}`} element={<ProtectedRoute component={QuoteBoard} />} />

        </Routes>
      </Router>
    </div>
  )
}

export default App