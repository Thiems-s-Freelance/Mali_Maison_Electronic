import { Link, useLocation } from 'react-router-dom'
import '../../Styles/App.css'

const Services = () => {
    const location = useLocation()
    const currentPageClass = location.pathname.slice(1) || 'service'

    
    return (
        <div className={`${currentPageClass}-page`}>

            <div className='navBar my-3'>
                <Link to='/home' className='mx-3 accueil'>Accueil</Link>
                <Link to='/services' className='mx-3 service'>Services</Link>
                <Link to='/contact' className='mx-3 contact'>Contact</Link>
            </div>

            <div className='container-fluid my-3'>Services</div>

        </div>
        
    )
}

export default Services