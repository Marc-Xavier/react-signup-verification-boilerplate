import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';

import { AuthProvider } from './contexts/AuthContext';
import { AlertProvider } from './contexts/AlertContext';
import { App } from './app';

import './styles.less';

// setup fake backend
import { configureFakeBackend } from './_helpers';
configureFakeBackend();

const root = createRoot(document.getElementById('app'));
root.render(
    <BrowserRouter>
        <AuthProvider>
            <AlertProvider>
                <App />
            </AlertProvider>
        </AuthProvider>
    </BrowserRouter>
);