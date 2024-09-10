import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useCallback } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import '../../Styles/command_window.css'
import { toast } from "react-toastify";
import { jwtDecode } from 'jwt-decode'
import { SHA256 } from 'crypto-js'
import { Loading } from '../Notification/Loading';


const LoginForm = () => {

    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const hashedRoute = SHA256('admin-dashboard').toString()

    const handleSubmit = useCallback(async (values) => {
        setLoading(true)
    
        try {
            const response = await fetch('https://localhost:7048/api/Auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values)
            })

            if(!response.ok) {
                const errorData = await response.json()
                console.error('Login error', errorData)
                return
            }

            const data = await response.json()
            localStorage.setItem('token', data.token)
            navigate(`/admin-dashboard/${hashedRoute}`)

            const decodedToken = jwtDecode(data.token)
            console.log(decodedToken)


        } catch(error) {
            console.error('Login Error', error)
            toast.error('Login failed')
        } finally {
            setLoading(false)
        }
    }, [navigate, hashedRoute])

    const validationSchema = Yup.object({
        username: Yup.string().required('The username is required'),
        password: Yup.string().required('The password is required')
    })

    const initialValues = {
        username: '',
        password: ''
    }

    return (
        <div className='container'>
            {loading && <Loading />}

            <Formik initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit} >
                            <Form className='form-container container' style={{width:'20rem'}}>
                                <div className='mt-3 center'> 
                                    <h2>Connexion</h2>
                                    <i className="bi bi-person-circle" style={{fontSize: '75px'}}></i>
                                </div>

                                <div className='mb-3'>
                                    <label className='form-label'>Username</label>
                                    <Field type="text" id='username' name='username' className='form-control form' />
                                    <ErrorMessage name="firstName" component="div" className="error" />
                                </div>

                                <div className='mb-3'>
                                    <label className='form-label'>Password</label>
                                    <Field type="password" id='password' name='password' className='form-control form' />
                                    <ErrorMessage name="name" component="div" className="error" />
                                </div>

                                <div>
                                    <button type="submit" 
                                            className='btn btn-success mx-2 mb-3 mt-2'
                                            style={{borderRadius: '2px'}}>Connexion</button> 
                                </div>
                            </Form>
                    </Formik>
            </div>
    )
}

export default LoginForm