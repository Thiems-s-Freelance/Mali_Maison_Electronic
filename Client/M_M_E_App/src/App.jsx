import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import Home from './Pages/Home_Components/Home'
import Services from './Pages/Services_Components/Services'
import Contact from './Pages/Contact_Components/Contact'
import './Styles/App.css'

function App() {

  return (
    <div className='container-fluid'>
      <Router>
        <Routes>
          <Route path='/home' element={<Home />} />
          <Route path='/services' element={<Services />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/' element={<Navigate to='/home' />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App