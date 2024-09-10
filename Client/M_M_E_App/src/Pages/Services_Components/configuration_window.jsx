import { PresentWindow } from "./window_present"
import PropTypes from 'prop-types'

export const ConfigurationWindow = ({ onClose }) => {

    const title = () => {
        return <h2>Configuration</h2>
    }

    const body = () => {
        return (
            <p className='container my-5 window-text' style={{textAlign: 'center'}}>
                Notre équipe se charge de la configuration complète de vos systèmes de surveillance. Nous optimisons chaque installation pour une performance maximale, en tenant compte des spécificités de votre espace et de vos objectifs de sécurité.<br /><br />
                Nous commençons par une évaluation approfondie pour sélectionner les équipements adaptés, que ce soit des caméras haute définition ou de systèmes de détection de mouvement. une installation de manière professionnelle est réalisée pour couvrir tous les angles importants.<br /><br />
                Nous effectuons des tests rigoureux pour garantir une performance optimale. Nous offrons aussi un service de maintenance régulier pour nous assurer que votre système reste efficace.<br /><br />
                Faites confiance à notre expertise pour sécuriser vos espaces de manière optimale. Contactez-nous pour découvrir nos solutions.
            </p>
        )
    }

    return (
        <>
            <PresentWindow onClose={onClose} body={body} title={title} />
        </>
    )
}

ConfigurationWindow.propTypes = {
    onClose: PropTypes.func.isRequired
}