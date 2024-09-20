import PropTypes from 'prop-types'
import { useCallback, useEffect, useState } from 'react'
import { Loading } from '../Notification/Loading'
import ReactPaginate from 'react-paginate'
import { Validate } from '../Notification/Validation'
import { useNavigate, useParams } from 'react-router-dom'
import { SHA256 } from 'crypto-js'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import { ErrorMessage, Field, Form, Formik } from 'formik'

export const CameraBoard = () => {
    const [loading, setLoading] = useState(false)
    const [validate, setValidate] = useState(false)
    const [cameras, setCameras] = useState([])
    const [error, setError] = useState('')
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 6
    const token = localStorage.getItem('token')
    const navigate = useNavigate()
    const hashedRoute4 = SHA256('camera-add')

    const fetchCamera = async () => {
        try {
            setLoading(true);
            const response = await fetch('https://asp.mali-maison.com/api/Product');

            if (!response.ok) {
                throw new Error(`Echec, erreur HTTP statut: ${response.status}`);
            }
            
            const data = await response.json();
            setCameras(data)
        } catch (error) {
            console.error('Erreur', error)
            setError(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCamera();
    }, [])

    const deleteProduct = useCallback(async (id) => {
        setLoading(true)
        const response = await fetch(`https://localhost:7048/api/Product/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization' : `Bearer ${token}`
                }
        })

        if(response.status === 204) {
            setLoading(false)
            setValidate(true)
            return
        }
            const data = await response.json() 

            localStorage.setItem('token', data.token)

            await fetchCamera()
    }, [token])

    
    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected)
    }

    useEffect(() => {
        if(validate) {
            const timer = setTimeout(() => {
                setValidate(false)
                window.location.reload()
            }, 2000)
            return () => setTimeout(timer)
        }
    }, [validate])

    const offset = currentPage * itemsPerPage;
    const currentPageItems = cameras.slice(offset, offset + itemsPerPage);

    return (
        <div className='container' >
            {validate && <Validate />}
            {loading && <Loading />}
        { error ? (
            <div className="alert alert-danger">{error}</div>
        ) : (
            <div>
                <h2>Liste des cameras</h2>
                <table className="table my-4"  style={{overflowY: 'scroll'}}>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Nom</th>
                            <th>Modèle</th>
                            <th>Stock</th>
                            <th>Prix</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {cameras.length > 0 ? (
                            currentPageItems.map((camera) => (
                                <CameraBoardRow 
                                    key={camera.id} 
                                    camera={camera} 
                                    deleteProduct={deleteProduct}
                                />
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center">Aucune caméra trouvée</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        )}

        <div style={{display: 'flex', justifyContent: 'start'}}>
            <button className='btn btn-success' onClick={() => navigate(`/admin-dashboard/${hashedRoute4}`)}>
                <i className="bi bi-plus-square mx-1"></i>
                    Ajouter une camera
                <i className="bi bi-plus-square mx-1"></i>
            </button>
        </div>
        <div className='mt-2' style={{display: 'flex', justifyContent: 'start'}}>
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
            />
        </div>
    </div>
)
}




const CameraBoardRow = ({ camera, deleteProduct }) => {
    const imageUrl = `https://asp.mali-maison.com${camera.imageUrl}`
    const navigate = useNavigate()
    const hashedRoute3 = SHA256('camera-edit').toString()

    return  <tr>
        <td><img src={imageUrl} alt="" style={{ height: '50px', borderRadius: '1.5px' }} /></td>
        <td>{camera.name}</td>
        <td>{camera.model}</td>
        <td>{camera.stock}</td>
        <td>{camera.price} FCFA</td>
        <td>
            <button 
                className="btn btn-primary mx-1"
                style={{ borderRadius: '2px' }}
                onClick={() => navigate(`/admin-dashboard/${hashedRoute3}/${camera.id}`)}
            >
                <i className="bi bi-pencil-square"></i>
            </button>
            <button 
                className="btn btn-danger mx-1 mt-1" 
                style={{ borderRadius: '2px' }}
                onClick={() => deleteProduct(camera.id)}
            >
                <i className="bi bi-trash cart2"></i>
            </button>
        </td>
    </tr>
}




export const CameraAdd = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false) 
    const hashedRoute2 = SHA256('camera-board').toString()
    const token = localStorage.getItem('token')


    const handleSubmit = useCallback(async (values) => {
        setLoading(true)
    
        try {
            const formData = new FormData()
            formData.append('name', values.name)
            formData.append('model', values.model)
            formData.append('price', values.price)
            formData.append('stock', values.stock)
            formData.append('file', values.imageUrl)

            const response = await fetch(`https://asp.mali-maison.com/api/Product`, {
                method: 'POST',
                headers: {
                    'Authorization' : `Bearer ${token}`
                },
                body: formData
            })

            if(!response.ok) {
                const errorData = await response.json()
                console.error('Login error', errorData)
                return
            }

            if(response.status === 201) {
                navigate(`/admin-dashboard/${hashedRoute2}`)
            }

            const data = await response.json()

            if(data.token)
                localStorage.setItem('token', data.token)

        } catch(error) {
            console.error('failed to Add', error)
            toast.error('failed to Add')
        } finally {
            setLoading(false)
        }
    }, [navigate, hashedRoute2, token])

    const validationSchema = Yup.object({
        name: Yup.string().required('The name is required'),
        model: Yup.string().required('The model is required'),
        price: Yup.number().required('number is required'),
        stock: Yup.number().required('stock is required'),
        imageUrl: Yup.mixed().required("l'image est réquis")
    })

    const initialValues = {
        name: '',
        model: '',
        price: '',
        stock: '',
        imageUrl: null
    }


    return (
        <div className='container'>
            {loading && <Loading />}

            <Formik initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit} >
                            <Form className='form-container container' style={{width:'25rem'}}>
                                <div className='mt-3 center'> 
                                    <h2>Ajout</h2>
                                    <i className="bi bi-person-circle" style={{fontSize: '75px'}}></i>
                                </div>

                                <div className='mb-3'>
                                    <label className='form-label'>Nom</label>
                                    <Field type="text" id='name' name='name' className='form-control form' />
                                    <ErrorMessage name="name" component="div" className="error" />
                                </div>

                                <div className='mb-3'>
                                    <label className='form-label'>Modèle</label>
                                    <Field type="text" id='model' name='model' className='form-control form' />
                                    <ErrorMessage name="model" component="div" className="error" />
                                </div>

                                <div className='mb-3'>
                                    <label className='form-label'>Prix</label>
                                    <Field type="number" id='price' name='price' className='form-control form' />
                                    <ErrorMessage name="price" component="div" className="error" />
                                </div>

                                <div className='mb-3'>
                                    <label className='form-label'>Stock</label>
                                    <Field type="number" id='stock' name='stock' className='form-control form' />
                                    <ErrorMessage name="stock" component="div" className="error" />
                                </div>

                                <div className='mb-3'>
                                    <label className='form-label'>Veullez selectionner une image</label>
                                    <Field name="imageUrl">
                                        {({ form }) => (
                                            <input
                                            type="file"
                                            id="imageUrl"
                                            onChange={(event) => {
                                                form.setFieldValue("imageUrl", event.currentTarget.files[0]);
                                            }}
                                            className="form-control form"
                                            />
                                        )}
                                    </Field>
                                    <ErrorMessage name="imageUrl" component="div" className="error" />
                                </div>

                                <div>
                                    <button type="submit" 
                                            className='btn btn-success mx-2 mb-3 mt-2'
                                            style={{borderRadius: '2px'}}>Ajouter</button> 
                                </div>
                            </Form>
                    </Formik>
            </div>
    )
}




export const CameraEdit = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false) 
    const [camera, setCamera] = useState(null)
    const hashedRoute2 = SHA256('camera-board').toString()
    const {id} = useParams()
    const token = localStorage.getItem('token')

    
    const fetchCamera = useCallback(async () => {
            setLoading(true);
            const response = await fetch(`https://asp.mali-maison.com/api/Product/${id}`);

            if (!response.ok) {
                throw new Error(`Echec, erreur HTTP statut: ${response.status}`)
            }

            const data = await response.json()
            setCamera(data)

            setLoading(false)
    }, [id])

    useEffect(() => {
        fetchCamera()
    }, [fetchCamera])

    const handleSubmit = useCallback(async (values) => {
        setLoading(true)
    
        try {
            const response = await fetch(`https://asp.mali-maison.com/api/Product/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization' : `Bearer ${token}`
                },
                body: JSON.stringify(values)
            })

            if(!response.ok) {
                const errorData = await response.json()
                console.error('Login error', errorData)
                return
            }

            if(response.status === 204) {
                navigate(`/admin-dashboard/${hashedRoute2}`)
                return null
            }

            const data = await response.json()
            localStorage.setItem('token', data.token)

        } catch(error) {
            console.error('failed to update', error)
            toast.error('failed to update')
        } finally {
            setLoading(false)
        }
    }, [navigate, hashedRoute2, id, token])

    const validationSchema = Yup.object({
        name: Yup.string().required('The name is required'),
        model: Yup.string().required('The model is required'),
        price: Yup.number().required('number is required'),
        stock: Yup.number().required('stock is required')
    })

    const initialValues = camera || {
        name: '',
        model: '',
        price: '',
        stock: ''
    }

    return (
        <div className='container'>
            {loading && <Loading />}

            <Formik initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                    enableReinitialize >
                            <Form className='form-container container' style={{width:'25rem'}}>
                                <div className='mt-3 center'> 
                                    <h2>Modification</h2>
                                    <i className="bi bi-person-circle" style={{fontSize: '75px'}}></i>
                                </div>

                                <div className='mb-3'>
                                    <label className='form-label'>Nom</label>
                                    <Field type="text" id='name' name='name' className='form-control form' />
                                    <ErrorMessage name="name" component="div" className="error" />
                                </div>

                                <div className='mb-3'>
                                    <label className='form-label'>Modèle</label>
                                    <Field type="text" id='model' name='model' className='form-control form' />
                                    <ErrorMessage name="model" component="div" className="error" />
                                </div>

                                <div className='mb-3'>
                                    <label className='form-label'>Prix</label>
                                    <Field type="number" id='price' name='price' className='form-control form' />
                                    <ErrorMessage name="price" component="div" className="error" />
                                </div>

                                <div className='mb-3'>
                                    <label className='form-label'>Stock</label>
                                    <Field type="number" id='stock' name='stock' className='form-control form' />
                                    <ErrorMessage name="stock" component="div" className="error" />
                                </div>

                                <div>
                                    <button type="submit" 
                                            className='btn btn-success mx-2 mb-3 mt-2'
                                            style={{borderRadius: '2px'}}>Appliquer</button> 
                                </div>
                            </Form>
                    </Formik>
            </div>
    )
}

CameraBoardRow.propTypes = {
    camera: PropTypes.object.isRequired,
    deleteProduct: PropTypes.func.isRequired
}