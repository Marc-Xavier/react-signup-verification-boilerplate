import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';

function Overview() {
    const { path } = useRouteMatch();

    return (
        <div>
            <h1>Admin</h1>
            <p>This section can only be accessed by administrators.</p>
            <p><Link to={`${path}/users`}>Manage Users</Link></p>
        </div>
    );
}

export { Overview };