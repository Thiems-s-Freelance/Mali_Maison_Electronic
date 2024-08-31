import { Link, useLocation } from 'react-router-dom'
import '../../Styles/App.css'
import '../../Styles/Home.css'
import frame from '../../assets/Frame.png'

const Home = () => {
    const location = useLocation()
    const currentPageClass = location.pathname.slice(1) || 'home'

    return (
        <div className={`${currentPageClass}-page`}>

            <div className='navBar my-3'>
                <Link to='/home' className='mx-3 accueil'>Accueil</Link>
                <Link to='/services' className='mx-3 service'>Services</Link>
                <Link to='/contact' className='mx-3 contact'>Contact</Link>
            </div>

            <div className=''>
                <img src={frame} className='home_present' alt="present" />
            </div>

        </div>
    )
}

export default Home