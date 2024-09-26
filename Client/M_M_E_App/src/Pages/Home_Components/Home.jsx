import { Link, useLocation } from 'react-router-dom'
import '../../Styles/App.css'
import '../../Styles/Home.css'
import logo from '../../assets/Main_Logo.png'
import { useState } from 'react'
import WindowCommand from './Command_Window'
import { Maintenance } from '../Maintenance'

const Home = () => {
    const location = useLocation()
    const currentPageClass = location.pathname.slice(1) || 'home'
    
    const [window, setWindow] = useState(false)

    const handleWindow = () => {
        setWindow(true)
    }

    const handleCloseWindow = () => {
        setWindow(false)
    }

    return (
        <Maintenance />
       /* <div className={`${currentPageClass}-page container`}>

            {window && <WindowCommand onClose={handleCloseWindow} />}

            <div className='navBar my-3'>
                <Link to='/home' className='mx-3 accueil' style={{fontWeight: 'normal'}}>Accueil</Link>
                <Link to='/services' className='mx-3 service' style={{fontWeight: 'normal'}}>Services</Link>
                <Link to='/contact' className='mx-3 contact' style={{fontWeight: 'normal'}}>Contact</Link>
            </div>

            <div className='present-container'>
                <img src={logo} className='home_present' alt="present" />
                <div className='bar mx-2'></div>
                <div>
                    <h1 className='present-text mx-2'>Mali Maison Electronique</h1>
                    <h4 className='present-text2 mx-4'>Entreprise spécialisée dans la <br/> Vente et Configuration de caméras de surveillance</h4>
                </div>
            </div>

            <div className='btn-container'>
                <button type="button" 
                        className='present-btn btn'
                        onClick={handleWindow} >Obtenez votre devis gratuit</button>
            </div>

            <div className='text-container'>
                <p className='text'>Votre sécurité, notre expertise - Protégez vos espaces, privés ou professionnels.</p>
            </div>

            <div className='foot'>
                <div className='bar2 my-4'></div>
            </div>

            <div className='rs-logos'>
                <i className='bi bi-whatsapp mx-4 logo'></i>
                <i className='bi bi-facebook mx-5 logo'></i>
                <i className='bi bi-instagram mx-4 logo'></i>
            </div>

        </div> */
    )
}

export default Home