import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import { Overview } from './Overview';
import { Users } from './users';

function Admin() {
    const { path } = useRouteMatch();

    return (
        <div className="p-4">
            <div className="container">
                <Switch>
                    <Route exact path={path} component={Overview} />
                    <Route path={`${path}/users`} component={Users} />
                </Switch>
            </div>
        </div>
    );
}

export { Admin };