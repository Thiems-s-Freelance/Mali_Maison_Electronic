import { Link, useLocation } from 'react-router-dom'
import '../../Styles/App.css'
import '../../Styles/services.css'
import logo from '../../assets/Main_Logo.png'
import { useState } from 'react'
import { VenteWindow } from './vente_window'
import { ConfigurationWindow } from './configuration_window'
import { MaintenanceWindow } from './maintenance_window'

const Services = () => {
    const location = useLocation()
    const currentPageClass = location.pathname.slice(1) || 'service'
    const [window, setWindow] = useState(false)
    const [configuration, setConfiguration] = useState(false)
    const [maintenance, setMaintenance] = useState(false)

    const handleWindow = () => {
        setWindow(true)
    }

    const handleCloseWindow = () => {
        setWindow(false)
    }

    const handleConfiguration = () => {
        setConfiguration(true)
    }

    const handleCloseConfiguration = () => {
        setConfiguration(false)
    }

    const handleMaintenance = () => {
        setMaintenance(true)
    }

    const handleCloseMaintenance = () => {
        setMaintenance(false)
    }
    
    return (
        <div className={`${currentPageClass}-page container`}>

            {window && <VenteWindow onClose={handleCloseWindow} />}
            {configuration && <ConfigurationWindow onClose={handleCloseConfiguration} />}
            {maintenance && <MaintenanceWindow onClose={handleCloseMaintenance} />}

            <div className='navBar my-3'>
                <Link to='/home' className='mx-3 accueil' style={{fontWeight: 'normal'}}>Accueil</Link>
                <Link to='/services' className='mx-3' style={{fontWeight: 'normal'}}>Services</Link>
                <Link to='/contact' className='mx-3 contact' style={{fontWeight: 'normal'}}>Contact</Link>
            </div>

            <div>
                <img src={logo} alt="logo" className='service-image'/>
            </div>

            <div className='service-container'>
                <i className="bi bi-tools mx-2" style={{fontSize: '50px', color: '#0084e3', cursor: 'pointer'}}></i>
                <div className='bar-service mx-2'></div>
                <h1 className='present-text mx-2' style={{textDecoration: 'underline'}}>Services</h1>
            </div>

            <div className='my-2'>
                <p className='mx-5'>Chez Mali Maison Electronique, nous mettons à votre disposition une gamme complète de solutions électroniques pour sécuriser <br /> et équiper votre maison ou votre entreprise. Notre expertise dans le domaine électronique, domestique et divers vous garantit des produits de qualité <br /> et des services sur mesure, adaptés à vos besoins.</p>
            </div>

            <div className='icon-container my-5 container'>
                <div className='icon-box mx-5' onClick={handleWindow}>
                    <i className="bi bi-shop mx-5 icon"></i>
                    <h2>Vente</h2>
                </div>

                <div className='icon-box mx-5' onClick={handleConfiguration}>
                    <i className="bi bi-gear-wide-connected mx-5 icon"></i>
                    <h2>Configuration</h2>
                </div>

                <div className='icon-box mx-5 my-2' onClick={handleMaintenance}>
                    <i className="bi bi-wrench-adjustable-circle mx-5 icon"></i>
                    <h2>Maintenance</h2>
                </div>
            </div>

            <div className='foot'>
                <div className='bar2 my-1'></div>
            </div>

            <div className='rs-logos'>
                <i className='bi bi-whatsapp mx-4 logo'></i>
                <i className='bi bi-facebook mx-5 logo'></i>
                <i className='bi bi-instagram mx-4 logo'></i>
            </div>
        </div>
        
    )
}

export default Services