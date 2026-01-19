import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';

import { useAlert } from '@/contexts/AlertContext';
import { AlertType } from '@/constants/alertTypes';

const propTypes = {
    id: PropTypes.string,
    fade: PropTypes.bool
};

const defaultProps = {
    id: 'default-alert',
    fade: true
};

function Alert({ id, fade }) {
    const { getAlerts, clear } = useAlert();
    const location = useLocation();
    const [displayAlerts, setDisplayAlerts] = useState([]);

    useEffect(() => {
        // Get alerts for this component
        const currentAlerts = getAlerts(id);
        setDisplayAlerts(currentAlerts);
    }, [getAlerts, id]);

    useEffect(() => {
        // Clear alerts on location change
        const pathname = location.pathname;
        // don't clear if pathname has trailing slash because this will be auto redirected again
        if (pathname.endsWith('/')) return;

        setDisplayAlerts(alerts => {
            // filter out alerts without 'keepAfterRouteChange' flag
            const filteredAlerts = alerts.filter(x => x.keepAfterRouteChange);
            // remove 'keepAfterRouteChange' flag on the rest
            filteredAlerts.forEach(x => delete x.keepAfterRouteChange);
            return filteredAlerts;
        });
    }, [location]);

    function removeAlert(alert) {
        if (fade) {
            // fade out alert
            const alertWithFade = { ...alert, fade: true };
            setDisplayAlerts(alerts => alerts.map(x => x === alert ? alertWithFade : x));

            // remove alert after faded out
            setTimeout(() => {
                setDisplayAlerts(alerts => alerts.filter(x => x !== alertWithFade));
            }, 250);
        } else {
            // remove alert
            setDisplayAlerts(alerts => alerts.filter(x => x !== alert));
        }
    }

    function cssClasses(alert) {
        if (!alert) return;

        const classes = ['alert', 'alert-dismissable'];
                
        const alertTypeClass = {
            [AlertType.Success]: 'alert alert-success',
            [AlertType.Error]: 'alert alert-danger',
            [AlertType.Info]: 'alert alert-info',
            [AlertType.Warning]: 'alert alert-warning'
        }

        classes.push(alertTypeClass[alert.type]);

        if (alert.fade) {
            classes.push('fade');
        }

        return classes.join(' ');
    }

    if (!displayAlerts.length) return null;

    return (
        <div className="container">
            <div className="m-3">
                {displayAlerts.map((alert, index) =>
                    <div key={index} className={cssClasses(alert)}>
                        <a className="close" onClick={() => removeAlert(alert)}>&times;</a>
                        <span dangerouslySetInnerHTML={{__html: alert.message}}></span>
                    </div>
                )}
            </div>
        </div>
    );
}

Alert.propTypes = propTypes;
Alert.defaultProps = defaultProps;
export { Alert };