import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';

import { useAuth } from '@/contexts/AuthContext';

function Details() {
    const { path } = useRouteMatch();
    const { user } = useAuth();

    return (
        <div>
            <h1>My Profile</h1>
            <p>
                <strong>Name: </strong> {user.title} {user.firstName} {user.lastName}<br />
                <strong>Email: </strong> {user.email}
            </p>
            <p><Link to={`${path}/update`}>Update Profile</Link></p>
        </div>
    );
}

export { Details };