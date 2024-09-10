import { PresentWindow } from "./window_present"
import PropTypes from 'prop-types'

export const MaintenanceWindow = ({ onClose }) => {

    const title = () => {
        return <h2>Maintenance</h2>
    }

    const body = () => {
        return (
            <p className='container my-5 window-text' style={{textAlign: 'center'}}>
                Pour garantir le bon fonctionnement de vos systèmes de surveillance sur le long terme, nous proposons des services de maintenance réguliers. Notre équipe intervient rapidement en cas de besoin pour résoudre tout problème technique et assurer la pérennité de votre installation.<br /><br />
                Nous effectuons des vérifications périodiques pour détecter et prévenir de possibles dysfonctionnements qui peuvent des problèmes majeurs. De plus, nous offrons un support technique réactif pour répondre à toutes vos questions et besoins en matière de maintenance.<br /><br />
                En choisissant nos services, vos systèmes de surveillance sont entre de bonnes mains et nous veillerons à leur bon état de fonctionnement en tout temps.
            </p>
        )
    }

    return (
        <>
            <PresentWindow onClose={onClose} body={body} title={title} />
        </>
    )
}

MaintenanceWindow.propTypes = {
    onClose: PropTypes.func.isRequired
}