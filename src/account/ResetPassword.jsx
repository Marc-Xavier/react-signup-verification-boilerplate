import React, { useState, useEffect } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import queryString from 'query-string';

import { useAuth } from '@/contexts/AuthContext';
import { useAlert } from '@/contexts/AlertContext';

function ResetPassword() {
    const { validateResetToken, resetPassword } = useAuth();
    const { clear, success, error: showError } = useAlert();
    const history = useHistory();
    const location = useLocation();

    const TokenStatus = {
        Validating: 'Validating',
        Valid: 'Valid',
        Invalid: 'Invalid'
    }

    const [token, setToken] = useState(null);
    const [tokenStatus, setTokenStatus] = useState(TokenStatus.Validating);
    const [values, setValues] = useState({
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const { token } = queryString.parse(location.search);

        // remove token from url to prevent http referer leakage
        history.replace(location.pathname);

        validateResetToken(token)
            .then(() => {
                setToken(token);
                setTokenStatus(TokenStatus.Valid);
            })
            .catch(() => {
                setTokenStatus(TokenStatus.Invalid);
            });
    }, []);

    function validateField(name, value, allValues = values) {
        switch (name) {
            case 'password':
                if (!value) return 'Password is required';
                if (value.length < 6) return 'Password must be at least 6 characters';
                return '';
            case 'confirmPassword':
                if (!value && allValues.password) return 'Confirm Password is required';
                if (value !== allValues.password) return 'Passwords must match';
                return '';
            default:
                return '';
        }
    }

    function handleChange(e) {
        const { name, value } = e.target;
        const newValues = { ...values, [name]: value };
        setValues(newValues);

        // Validate on change if field was touched
        if (touched[name]) {
            const error = validateField(name, value, newValues);
            setErrors(prev => ({ ...prev, [name]: error }));
        }

        // Also revalidate confirmPassword when password changes
        if (name === 'password' && touched.confirmPassword) {
            const confirmError = validateField('confirmPassword', newValues.confirmPassword, newValues);
            setErrors(prev => ({ ...prev, confirmPassword: confirmError }));
        }
    }

    function handleBlur(e) {
        const { name, value } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));

        const error = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: error }));
    }

    async function handleSubmit(e) {
        e.preventDefault();

        // Validate all fields
        const newErrors = {};
        Object.keys(values).forEach(key => {
            const error = validateField(key, values[key]);
            if (error) newErrors[key] = error;
        });

        setErrors(newErrors);
        setTouched({ password: true, confirmPassword: true });

        // Stop if there are errors
        if (Object.keys(newErrors).length > 0) return;

        clear();
        setIsSubmitting(true);

        try {
            await resetPassword({ token, password: values.password, confirmPassword: values.confirmPassword });
            success('Password reset successful, you can now login', { keepAfterRouteChange: true });
            history.push('login');
        } catch (error) {
            setIsSubmitting(false);
            showError(error.message);
        }
    }

    function getForm() {
        return (
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        name="password"
                        type="password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')}
                    />
                    {errors.password && touched.password && (
                        <div className="invalid-feedback">{errors.password}</div>
                    )}
                </div>
                <div className="form-group">
                    <label>Confirm Password</label>
                    <input
                        name="confirmPassword"
                        type="password"
                        value={values.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={'form-control' + (errors.confirmPassword && touched.confirmPassword ? ' is-invalid' : '')}
                    />
                    {errors.confirmPassword && touched.confirmPassword && (
                        <div className="invalid-feedback">{errors.confirmPassword}</div>
                    )}
                </div>
                <div className="form-row">
                    <div className="form-group col">
                        <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                            {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                            Reset Password
                        </button>
                        <Link to="login" className="btn btn-link">Cancel</Link>
                    </div>
                </div>
            </form>
        );
    }

    function getBody() {
        switch (tokenStatus) {
            case TokenStatus.Valid:
                return getForm();
            case TokenStatus.Invalid:
                return <div>Token validation failed, if the token has expired you can get a new one at the <Link to="forgot-password">forgot password</Link> page.</div>;
            case TokenStatus.Validating:
                return <div>Validating token...</div>;
        }
    }

    return (
        <div>
            <h3 className="card-header">Reset Password</h3>
            <div className="card-body">{getBody()}</div>
        </div>
    )
}

export { ResetPassword };
