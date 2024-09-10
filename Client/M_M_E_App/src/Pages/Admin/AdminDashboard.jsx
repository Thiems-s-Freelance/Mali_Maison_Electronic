import { useNavigate } from 'react-router-dom'
import '../../Styles/admindashboard.css'
import { SHA256 } from 'crypto-js'

export const AdminDashboard = () => {
    const navigate = useNavigate()
    const hashedRoute2 = SHA256('camera-board').toString()
    const hashedRoute5 = SHA256('quote-board').toString()
    return (
       <>
        <div className='container dashboard-container'>
            <div className='container dashboard'>
                <h1>Tableau de bord</h1>
                <div className='menu-container mt-5 container'>

                    <div className='btn item mx-5' onClick={() => navigate(`/admin-dashboard/${hashedRoute2}`) } >
                        <i className="bi bi-camera-video-fill" style={{fontSize: '5.5rem'}}></i>
                        <h4>Caméras de surveillance</h4>
                    </div>
                    <div className='btn item mx-5' onClick={() => navigate(`/admin-dashboard/${hashedRoute5}`) }>
                        <i className="bi bi-journal-text" style={{fontSize: '5.5rem'}}></i>
                        <h4>Demandes de devis</h4>
                    </div>

                </div>
            </div>
        </div>
       </>
    )
}