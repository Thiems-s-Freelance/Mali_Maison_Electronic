import { Link, useLocation } from 'react-router-dom'
import '../../Styles/App.css'
import '../../Styles/contact.css'

const Contact = () => {
    const location  = useLocation()
    const currentPageClass = location.pathname.slice(1) || 'contact'

    return (
        <div className={`${currentPageClass}-page container`}>

            <div className='navBar my-3'>
                <Link to='/home' className='mx-3 accueil' style={{fontWeight: 'normal'}}>Accueil</Link>
                <Link to='/services' className='mx-3 service' style={{fontWeight: 'normal'}}>Services</Link>
                <Link to='/contact' className='mx-3 contact' style={{fontWeight: 'normal'}}>Contact</Link>
            </div>

            <div className='container-fluid my-3'>
                <div className="contact-header">
                    <h1>Contactez-nous</h1>
                    <p>Vous pouvez nous joindre via les informations ci-dessous pour toute question ou demande.</p>
                </div>

                <div>
                    <h5 className='my-4' style={{fontSize: '15px'}}><i className="bi bi-telephone"></i > +223 || 92 59 63 44 / 53 03 11 23 </h5>
                    <h5 className='my-4' style={{fontSize: '15px'}}><i className="bi bi-geo-alt-fill"></i> Bamako - Sébénicoro</h5>
                    <h5 className='my-4' style={{fontSize: '15px'}}><i className="bi bi-clock"></i> Ouvert de 7h à 23h</h5>
                </div>

                <div className="contact-info my-5">

                    <a href="https://www.instagram.com/mali_maison_electronique_/?utm_source=ig_web_button_share_sheet" target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none'}}>
                        <div className="contact-item mx-5">
                            <i className="bi bi-instagram" style={{fontSize: '5rem', color: 'black'}}></i>
                        </div>
                    </a>

                    <a href="https://www.facebook.com/share/o8xKpmTgijEa8WNZ/?mibextid=LQQJ4d" target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none'}}>
                        <div className="contact-item mx-5">
                            <i className="bi bi-facebook" style={{fontSize: '5rem', color: 'blue'}}></i>
                        </div>
                    </a>

                    <a href="https://wa.me/22392596344" target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none'}}>
                        <div className="contact-item mx-5">
                            <i className="bi bi-whatsapp" style={{fontSize: '5rem', color: 'green'}}></i>
                        </div>
                    </a>

                </div>
            </div>

        </div>
    )
}

export default Contact