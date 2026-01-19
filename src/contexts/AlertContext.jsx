import React, { createContext, useContext, useState, useCallback } from 'react';
import { AlertType } from '../constants/alertTypes';

const AlertContext = createContext(null);

export const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error('useAlert must be used within AlertProvider');
    }
    return context;
};

export const AlertProvider = ({ children }) => {
    const [alerts, setAlerts] = useState([]);
    const defaultId = 'default-alert';

    const alert = useCallback((alertData) => {
        const newAlert = {
            id: alertData.id || defaultId,
            type: alertData.type,
            message: alertData.message,
            autoClose: alertData.autoClose === undefined ? true : alertData.autoClose,
            keepAfterRouteChange: alertData.keepAfterRouteChange || false
        };

        setAlerts(prev => [...prev, newAlert]);

        // Auto close after 3 seconds if enabled
        if (newAlert.autoClose) {
            setTimeout(() => {
                setAlerts(prev => prev.filter(a => a !== newAlert));
            }, 3000);
        }
    }, []);

    const success = useCallback((message, options = {}) => {
        alert({ ...options, type: AlertType.Success, message });
    }, [alert]);

    const error = useCallback((message, options = {}) => {
        alert({ ...options, type: AlertType.Error, message });
    }, [alert]);

    const info = useCallback((message, options = {}) => {
        alert({ ...options, type: AlertType.Info, message });
    }, [alert]);

    const warn = useCallback((message, options = {}) => {
        alert({ ...options, type: AlertType.Warning, message });
    }, [alert]);

    const clear = useCallback((id = defaultId) => {
        setAlerts(prev => prev.filter(a => a.id !== id));
    }, []);

    const getAlerts = useCallback((id = defaultId) => {
        return alerts.filter(a => a.id === id);
    }, [alerts]);

    const value = {
        alerts,
        alert,
        success,
        error,
        info,
        warn,
        clear,
        getAlerts
    };

    return <AlertContext.Provider value={value}>{children}</AlertContext.Provider>;
};
