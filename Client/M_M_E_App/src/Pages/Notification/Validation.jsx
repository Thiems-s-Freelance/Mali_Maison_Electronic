import '../../Styles/notification.css'

export const Validate = () => {

    const overlayStyle = {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 9999, // S'assure que le spinner reste au-dessus des autres éléments
        backgroundColor: 'rgba(0, 0, 0, 0.4)', // Optionnel : fond transparent
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
    }

    return <div style={overlayStyle}>
        <div className="alert alert-success success-notif">
            <i className="bi bi-check-circle-fill" style={{fontSize: '2rem'}}></i>
        </div>
    </div>
}