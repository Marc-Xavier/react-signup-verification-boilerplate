import React from 'react';

import { useAuth } from '@/contexts/AuthContext';

function Home() {
    const { user } = useAuth();

    return (
        <div className="p-4">
            <div className="container">
                <h1>Hi {user.firstName}!</h1>
                <p>You're logged in with React & JWT!!</p>
            </div>
        </div>
    );
}

export { Home };