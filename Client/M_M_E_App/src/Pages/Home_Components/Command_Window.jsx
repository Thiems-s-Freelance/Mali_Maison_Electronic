import { useEffect, useState } from 'react'
import '../../Styles/command_window.css'
import PropTypes from 'prop-types'
import { CameraRow } from './CameraRow'
import ReactPaginate from 'react-paginate'
import { QuoteForm } from './Form'
import { Loading } from '../Notification/Loading'
import { Validate } from '../Notification/Validation'
import { Error as ErrorNotification } from '../Notification/Error';

const WindowCommand = ({ onClose }) => {
    const [cameras, setCameras] = useState([])
    const [loading, setLoading] = useState(false)
    const [validate, setValidate] = useState(false)
    const [error, setError] = useState('')
    const [currentPage, setCurrentPage] = useState(0);
    const [showForm, setShowForm] = useState(false)
    const [quantities, setQuantities] = useState({});
    const itemsPerPage = 3
    const hasSelectedCamera = Object.values(quantities).some(quantity => quantity > 0)

    const fetchCamera = async () => {
        try {
            setLoading(true);
            const response = await fetch('https://localhost:7048/api/Product');

            if (!response.ok) {
                throw new Error(`Echec, erreur HTTP statut: ${response.status}`);
            }
            
            const data = await response.json();
            setCameras(data);
        } catch (error) {
            console.error('Erreur', error);
            setError(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCamera();
    }, [])

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected)
    }

    const handleAdd = (cameraId) => {
        setQuantities(prev => ({
            ...prev,
            [cameraId]: (prev[cameraId] || 0) + 1
        }))
    }

    const handleRemove = (cameraId) => {
        setQuantities(prev => ({
            ...prev,
            [cameraId]: Math.max((prev[cameraId] || 0) - 1, 0)
        }))
    }

    const handleFormSubmit = async (formData) => {
        setLoading(true)

        const quoteRequest = {
            firstName: formData.firstName,
            name: formData.name, 
            email: formData.email,
            requestTime: new Date().toISOString(),
            products: Object.entries(quantities).filter(([quantity]) => quantity > 0).map(([id, quantity]) => ({
                productId: parseInt(id, 10),
                quantity
            }))
        }
        try {
            const response = await fetch('https://localhost:7048/api/QuoteRequest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(quoteRequest)
            })
            console.log(quoteRequest)

            if(!response.ok) {
                const errorResponse = await response.json()
                throw new Error(errorResponse.message || `Erreur lors de la soumission, statut: ${response.status}`)
            }

            const result = await response.json()
            console.log('succès', result)
            setValidate(true)
            

            setQuantities({})
        } catch (error) {
            console.error('erreur lors de la soumission', error)
            setError(error)
        } finally {
            setLoading(false)
        }
    }

    const handleNextCLick = () => {

        if(hasSelectedCamera) {
            setShowForm(true)
        }

    }

    useEffect(() => {
        if(validate) {
            const timer = setTimeout(() => {
                setValidate(false)
                setShowForm(false)
            }, 2000)

            return () => clearTimeout(timer)
        }

        if(error) {
            const timer = setTimeout(() => {
                setError('')
            }, 2000)

            return () => clearTimeout(timer)
        }

    }, [validate, error])

    // Calcule les éléments à afficher pour la page actuelle
    const offset = currentPage * itemsPerPage;
    const currentPageItems = cameras.slice(offset, offset + itemsPerPage);

    return (
        <>
        {loading && <Loading />}
        {validate && <Validate />}
        {error && <ErrorNotification />}
            <div className='window-container'>
                <div className='window'>
                    <i className='bi-x-square close' onClick={onClose}></i>
                    <h2 className='title'>Damande de devis</h2>

                { showForm ? (
                    <QuoteForm onClose={() => setShowForm(false)} onSubmit={handleFormSubmit} />
                ) : (
                    <>
                    <div className='table-container'>
                        <h2 className='table-title my-3'>Choix des produits</h2>
                        <table className="table my-4">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Nom</th>
                                    <th>Modèle</th>
                                    <th>Prix</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td>
                                            <Loading />
                                        </td>
                                    </tr>
                                ) : (
                                    currentPageItems.map(camera => (
                                        <CameraRow 
                                            key={camera.id} 
                                            camera={camera} 
                                            onAdd={handleAdd} 
                                            onRemove={handleRemove} 
                                            quantity={quantities[camera.id] || 0} 
                                        />
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <ReactPaginate
                        previousLabel={"← Précédent"}
                        nextLabel={"Suivant →"}
                        breakLabel={"..."}
                        pageCount={Math.ceil(cameras.length / itemsPerPage)}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={3}
                        onPageChange={handlePageClick}
                        containerClassName={"pagination"}
                        activeClassName={"active"}
                        pageClassName={"page-item"}
                        pageLinkClassName={"page-link"}
                        previousClassName={"page-item"}
                        previousLinkClassName={"page-link"}
                        nextClassName={"page-item"}
                        nextLinkClassName={"page-link"}
                        breakClassName={"page-item"}
                        breakLinkClassName={"page-link"}
                        className='pagination'
                    />

                    <div>
                        {currentPageItems.map(camera => (
                            <div key={camera.id} style={{ position: 'relative', display: 'inline-block' }} className='image-container'>
                                <img 
                                    src={`https://localhost:7048${camera.imageUrl}`} 
                                    alt={`Camera`}
                                    style={{ height: '75px', display: 'block', borderRadius: '2.5px' }} 
                                    className='mx-2'
                                />
                                <span className='image-number'>{quantities[camera.id] || 0}</span>
                            </div>
                        ))}
                    </div>


                    <div>
                        <button type="button" className='btn btn-info suivant' onClick={handleNextCLick} disabled={!hasSelectedCamera}>Suivant</button>
                    </div> 
                </> )}
                </div> 
            </div>
        </>
    )
}

WindowCommand.propTypes = {
    onClose: PropTypes.func.isRequired
}

export default WindowCommand;
