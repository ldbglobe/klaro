import React from 'react'
import ConsentModal from './consent-modal'
import {getPurposes} from 'utils/config'

export default class ConsentNotice extends React.Component {

    componentWillReceiveProps(props){
        if (props.show)
            this.setState({modal : undefined})
    }

    render(){

        const {modal} = this.state
        const {config, manager, show, t} = this.props

        const purposes = getPurposes(config)
        const purposesText = purposes.map((purpose) => t(['purposes', purpose])).join(", ")

        const showModal = (e) => {
            if (e !== undefined)
                e.preventDefault()
            this.setState({modal: true})
        }
        const hide = (e) => {
            if (e !== undefined)
                e.preventDefault()
            this.setState({modal: false})
        }

        const saveAndHide = (e) => {
            if (e !== undefined)
                e.preventDefault()
            manager.saveAndApplyConsents()
            this.setState({modal: false})
        }

        const declineAndHide = (e) => {
            manager.declineAll()
            manager.saveAndApplyConsents()
            this.setState({modal: false})
        }

        var changesText

        if (manager.changed)
            changesText = <p className="cn-changes">{t(['consentNotice', 'changeDescription'])}</p>

        if (manager.confirmed && !show)
            return <div />
        
        if (modal || (show && modal === undefined) || (config.mustConsent && !manager.confirmed))
            return <ConsentModal t={t} config={config} hide={hide} declineAndHide={declineAndHide} saveAndHide={saveAndHide} manager={manager} />
        
        if (!manager.confirmed && !config.noNotice)
            return <div className="cookie-notice">
                <div className="cn-body">
                    <p>
                        {t(['consentNotice', 'description'], {purposes: <b>{purposesText}</b>})}
                        <a className="" href="#" onClick={showModal}>{t(['consentNotice', 'learnMore'])}</a>
                    </p>
                    {changesText}
                    <p className="cn-ok">
                        <a className="cm-btn cm-btn-sm cm-btn-success" href="#" onClick={saveAndHide}>{t(['ok'])}</a>
                        <a className="cm-btn cm-btn-sm cm-btn-danger cn-decline" href="#" onClick={declineAndHide}>{t(['decline'])}</a>
                    </p>
                </div>
            </div>

        return <div />
    }
}
