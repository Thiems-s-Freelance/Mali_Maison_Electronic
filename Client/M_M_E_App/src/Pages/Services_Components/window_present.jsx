import PropTypes from 'prop-types'
import '../../Styles/command_window.css'

export const PresentWindow = ({ title, body, onClose }) => {
    return (
        <div className='container'>
            <div className='window-container' style={{background: 'rgba(255, 255, 255, 0.648)'}}>
                <div className='window'>
                    <i className='bi-x-square close' onClick={onClose}></i>
                    <div className='title'>{title()}</div>
                    <div className='container'>
                        {body()}
                    </div>
                </div>
            </div>
        </div>
    )
}

PresentWindow.propTypes = {
    title: PropTypes.func.isRequired,
    body: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
}