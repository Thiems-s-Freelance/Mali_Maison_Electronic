import { PresentWindow } from "./window_present"
import PropTypes from 'prop-types'

export const VenteWindow = ({ onClose }) => {

    const title = () => {
        return <h2>Vente</h2>
    }

    const body = () => {
        return (
            <p className='container my-5 window-text' style={{textAlign: 'center'}}>
                Nous offrons une large sélection de caméras de surveillance de haute qualité, adaptées à divers environnements et besoins spécifiques. Que ce soit pour une résidence privée, un site commercial, ou des espaces industriels, nous avons le nécessaire pour garantir une surveillance efficace et discrète. <br /><br />
    
                Nos caméras sont conçues pour offrir une performance exceptionnelle, même dans des conditions difficiles, telles que des environnements à faible luminosité ou des zones sujettes à des intempéries. De plus, nous proposons des options de vision nocturne, des caméras à haute résolution, et des systèmes avec capacité de détection de mouvement pour une sécurité renforcée. <br /><br />
    
                Nous mettons également à disposition des solutions personnalisées, comprenant installation et la maintenance de vos équipements de surveillance. Notre équipe est à votre écoute pour évaluer vos besoins et vous conseiller sur les meilleures options, afin de protéger vos biens et garantir votre tranquillité. <br /><br />
    
                Faites confiance à Mali Maison Electronique pour la sécurité de vos espaces. Nous nous engageons à vous offrir des produits à la pointe de la technologie et des services de qualité, toujours adaptés à vos exigences spécifiques. Contactez-nous pour découvrir nos offres et obtenir une consultation gratuite pour vos projets de sécurité.
            </p>
        )
    }

    return (
        <>
            <PresentWindow onClose={onClose} body={body} title={title} />
        </>
    )
}

VenteWindow.propTypes = {
    onClose: PropTypes.func.isRequired
}