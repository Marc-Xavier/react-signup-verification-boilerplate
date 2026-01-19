import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render } from 'react-dom';

import { AuthProvider } from './contexts/AuthContext';
import { AlertProvider } from './contexts/AlertContext';
import { App } from './app';

import './styles.less';

// setup fake backend
import { configureFakeBackend } from './_helpers';
configureFakeBackend();

render(
    <BrowserRouter>
        <AuthProvider>
            <AlertProvider>
                <App />
            </AlertProvider>
        </AuthProvider>
    </BrowserRouter>,
    document.getElementById('app')
);