import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '@/contexts/AuthContext';
import { useAlert } from '@/contexts/AlertContext';

function ForgotPassword() {
    const { forgotPassword } = useAuth();
    const { clear, success, error: showError } = useAlert();

    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [touched, setTouched] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    function validateEmail(value) {
        if (!value) return 'Email is required';
        if (!/\S+@\S+\.\S+/.test(value)) return 'Email is invalid';
        return '';
    }

    function handleChange(e) {
        const value = e.target.value;
        setEmail(value);

        if (touched) {
            setError(validateEmail(value));
        }
    }

    function handleBlur() {
        setTouched(true);
        setError(validateEmail(email));
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const validationError = validateEmail(email);
        setError(validationError);
        setTouched(true);

        if (validationError) return;

        clear();
        setIsSubmitting(true);

        try {
            await forgotPassword(email);
            success('Please check your email for password reset instructions');
        } catch (error) {
            showError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h3 className="card-header">Forgot Password</h3>
            <div className="card-body">
                <div className="form-group">
                    <label>Email</label>
                    <input
                        name="email"
                        type="text"
                        value={email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={'form-control' + (error && touched ? ' is-invalid' : '')}
                    />
                    {error && touched && (
                        <div className="invalid-feedback">{error}</div>
                    )}
                </div>
                <div className="form-row">
                    <div className="form-group col">
                        <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                            {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                            Submit
                        </button>
                        <Link to="login" className="btn btn-link">Cancel</Link>
                    </div>
                </div>
            </div>
        </form>
    )
}

export { ForgotPassword };
