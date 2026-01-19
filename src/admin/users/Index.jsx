import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import { List } from './List';
import { AddEdit } from './AddEdit';

function Users() {
    const { path } = useRouteMatch();

    return (
        <Switch>
            <Route exact path={path} component={List} />
            <Route path={`${path}/add`} component={AddEdit} />
            <Route path={`${path}/edit/:id`} component={AddEdit} />
        </Switch>
    );
}

export { Users };