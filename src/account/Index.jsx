import React, { useEffect } from 'react';
import { Route, Switch, useNavigate, useRouteMatch } from 'react-router-dom';

import { useAuth } from '@/contexts/AuthContext';

import { Login } from './Login';
import { Register } from './Register';
import { VerifyEmail } from './VerifyEmail';
import { ForgotPassword } from './ForgotPassword';
import { ResetPassword } from './ResetPassword';

function Account() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { path } = useRouteMatch();

    useEffect(() => {
        // redirect to home if already logged in
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    return (
        <div className="container">
            <div className="row">
                <div className="col-sm-8 offset-sm-2 mt-5">
                    <div className="card m-3">
                        <Switch>
                            <Route path={`${path}/login`} component={Login} />
                            <Route path={`${path}/register`} component={Register} />
                            <Route path={`${path}/verify-email`} component={VerifyEmail} />
                            <Route path={`${path}/forgot-password`} component={ForgotPassword} />
                            <Route path={`${path}/reset-password`} component={ResetPassword} />
                        </Switch>
                    </div>
                </div>
            </div>
        </div>
    );
}

export { Account };