import PropTypes from 'prop-types';

export function CameraRow({ camera, onAdd, onRemove, quantity }) {
    const imageUrl = `https://localhost:7048${camera.imageUrl}`

    return (
        <tr>
            <td><img src={imageUrl} alt="" style={{ height: '50px', borderRadius: '1.5px' }} /></td>
            <td>{camera.name}</td>
            <td>{camera.model}</td>
            <td>{camera.price} FCFA</td>
            <td>
                <button 
                    className="btn btn-success mx-1 my-1" 
                    style={{ borderRadius: '2px' }}
                    onClick={() => onAdd(camera.id)}
                >
                    <i className="bi bi-cart-plus cart"></i>
                </button>
                <button 
                    className="btn btn-danger mx-1 my-1" 
                    style={{ borderRadius: '2px' }}
                    onClick={() => onRemove(camera.id)}
                >
                    <i className="bi bi-cart-dash cart2"></i>
                </button>
                <button className='btn btn-light' style={{ borderRadius: '2px', cursor: 'auto' }}>{quantity}</button>
            </td>
        </tr>
    )
}

CameraRow.propTypes = {
    camera: PropTypes.object.isRequired,
    onAdd: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    quantity: PropTypes.number.isRequired
}
