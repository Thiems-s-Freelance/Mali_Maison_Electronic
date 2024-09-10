import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import '../../Styles/command_window.css'


export const QuoteForm = ({ onClose, onSubmit }) => {

    const validationSchema = Yup.object({
        firstName: Yup.string().required('Le prénom est réquis'),
        name: Yup.string().required('Le nom est réquis'),
        email: Yup.string().email('Email is invalid').required("l'email est réquis")
    })

    const initialValues = {
        firstName: '',
        name: '', 
        email: ''
    }

    const handleSubmit = (values, { setSubmitting, resetForm }) => {
        onSubmit(values),
        setSubmitting(false),
        resetForm()
    }

    return (
        <div className='container global-form-container'>
            <Formik initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit} >
                        {({ isSubmitting }) => (
                            <Form className='form-container container my-2'>
                                <div className='mt-3'> 
                                    <h2>Souscription</h2>
                                    <i className="bi bi-person-circle" style={{fontSize: '75px'}}></i>
                                </div>

                                <div className='mb-3' >
                                    <label className='form-label'>Prénom</label>
                                    <Field type="text" id='firstName' name='firstName' className='form-control form' />
                                    <ErrorMessage name="firstName" component="div" className="error" />
                                </div>

                                <div className='mb-3'>
                                    <label className='form-label'>Nom</label>
                                    <Field type="text" id='name' name='name' className='form-control form' />
                                    <ErrorMessage name="name" component="div" className="error" />
                                </div>

                                <div className='mb-3'>
                                    <label className='form-label'>Email</label>
                                    <Field type="email" id='email' name='email' className='form-control form' />
                                    <ErrorMessage name="email" component="div" className="error" />
                                </div>

                                <div>
                                    <button type="submit" 
                                            disabled={isSubmitting} 
                                            className='btn btn-success mx-2 mb-3 mt-2'
                                            style={{borderRadius: '2px'}}>Soumettre</button> 
                                    <button type="button"
                                            onClick={onClose} 
                                            className='btn btn-danger mx-2 mb-3 mt-2'
                                            style={{borderRadius: '2px'}}>Annuler</button>
                                </div>
                            </Form>
                        )}
                    </Formik>
        </div>
    )
}

QuoteForm.propTypes = {
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
}