import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './Pages/Home_Components/Home'
import Services from './Pages/Services_Components/Services'
import Contact from './Pages/Contact_Components/Contact'

function App() {

  return (
    <div className="container">
      <Router>
        <Routes>
          <Route path='/home' element={<Home />} />
          <Route path='/services' element={<Services />} />
          <Route path='/contact' element={<Contact />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App