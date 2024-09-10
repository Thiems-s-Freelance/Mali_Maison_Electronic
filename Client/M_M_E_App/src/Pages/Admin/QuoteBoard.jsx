import { useCallback, useEffect, useState } from "react"
import { Loading } from "../Notification/Loading"
import ReactPaginate from "react-paginate"
import PropTypes from 'prop-types'
import { Validate } from "../Notification/Validation"


export const QuoteBoard = () => {
    const [loading, setLoading] = useState(false)
    const [validate, setValidate] = useState(false)
    const [quotes, setQuotes] = useState([])
    const [error, setError] = useState('')
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 6
    const token = localStorage.getItem('token')

    const fetchQuotes = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch('https://localhost:7048/api/QuoteRequest', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization' : `Bearer ${token}`
                }
            })

            if (!response.ok) {
                throw new Error(`Echec, erreur HTTP statut: ${response.status}`);
            }
            
            const data = await response.json();
            setQuotes(data)
        } catch (error) {
            console.error('Erreur', error)
            setError(error)
        } finally {
            setLoading(false)
        }
    }, [token])

    const deleteQuote = useCallback(async (id) => {
        setLoading(true)
        const response = await fetch(`https://localhost:7048/api/QuoteRequest/${id}`, {
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
    }, [token])

    useEffect(() => {
        if (!token) {
            setError("Token manquant. Veuillez vous connecter.");
            return;
        }
            fetchQuotes()
    }, [fetchQuotes, token])

    useEffect(() => {
        if(validate) {
            const timer = setTimeout(() => {
                setValidate(false)
                window.location.reload()
            }, 2000)
            return () => setTimeout(timer)
        }
    }, [validate])
    
    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected)
    }

    const offset = currentPage * itemsPerPage;
    const currentPageItems = quotes.slice(offset, offset + itemsPerPage);

    return (
        <div className='container' >
            {loading && <Loading />}
            {validate && <Validate />}
        { error ? (
            <div className="alert alert-danger">{error}</div>
        ) : (
            <div>
                <h2>Liste des demandes de devis</h2>
                <table className="table my-4"  style={{overflowY: 'scroll'}}>
                    <thead>
                        <tr>
                            <th>client</th>
                            <th>Email</th>
                            <th>Produits</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {quotes.length > 0 ? (
                            currentPageItems.map((quote) => (
                                <QuoteBoardRow 
                                    key={quote.id} 
                                    quote={quote}
                                    deleteQuote={deleteQuote} 
                                />
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center">Aucune demande de devis trouvée</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        )}

        <div className='mt-2' style={{display: 'flex', justifyContent: 'start'}}>
            <ReactPaginate
                            previousLabel={"← Précédent"}
                            nextLabel={"Suivant →"}
                            breakLabel={"..."}
                            pageCount={Math.ceil(quotes.length / itemsPerPage)}
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





const QuoteBoardRow = ({ quote, deleteQuote }) => {

    return <tr>
        <td>{quote?.name} {quote?.firstName}</td>
        <td>{quote?.email}</td>
        <td>{quote?.products?.map((product, index) => (
                <div key={index}>
                {product.camera?.name} ({product.camera?.model}) : <strong>{product.quantity} unités</strong>
                </div>
            ))}</td>
        <td>
            <button 
                className="btn btn-danger mx-1 mt-1" 
                style={{ borderRadius: '2px' }}
                onClick={() => deleteQuote(quote.id)}>
                <i className="bi bi-trash cart2"></i>
            </button>
        </td>
    </tr>
}

QuoteBoardRow.propTypes = {
    quote: PropTypes.object.isRequired,
    deleteQuote: PropTypes.func.isRequired
}
