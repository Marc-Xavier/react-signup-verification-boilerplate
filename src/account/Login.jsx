import React, { useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';

import { useAuth } from '@/contexts/AuthContext';
import { useAlert } from '@/contexts/AlertContext';

function Login() {
    const { login } = useAuth();
    const { clear, error: showError } = useAlert();
    const history = useHistory();
    const location = useLocation();

    const [values, setValues] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    function validateField(name, value) {
        switch (name) {
            case 'email':
                if (!value) return 'Email is required';
                if (!/\S+@\S+\.\S+/.test(value)) return 'Email is invalid';
                return '';
            case 'password':
                if (!value) return 'Password is required';
                return '';
            default:
                return '';
        }
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setValues(prev => ({ ...prev, [name]: value }));

        // Validate on change if field was touched
        if (touched[name]) {
            const error = validateField(name, value);
            setErrors(prev => ({ ...prev, [name]: error }));
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
        setTouched({ email: true, password: true });

        // Stop if there are errors
        if (Object.keys(newErrors).length > 0) return;

        clear();
        setIsSubmitting(true);

        try {
            await login(values.email, values.password);
            const { from } = location.state || { from: { pathname: "/" } };
            history.push(from.pathname || '/');
        } catch (error) {
            setIsSubmitting(false);
            showError(error.message);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h3 className="card-header">Login</h3>
            <div className="card-body">
                <div className="form-group">
                    <label>Email</label>
                    <input
                        name="email"
                        type="text"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={'form-control' + (errors.email && touched.email ? ' is-invalid' : '')}
                    />
                    {errors.email && touched.email && (
                        <div className="invalid-feedback">{errors.email}</div>
                    )}
                </div>
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
                <div className="form-row">
                    <div className="form-group col">
                        <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                            {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                            Login
                        </button>
                        <Link to="register" className="btn btn-link">Register</Link>
                    </div>
                    <div className="form-group col text-right">
                        <Link to="forgot-password" className="btn btn-link pr-0">Forgot Password?</Link>
                    </div>
                </div>
            </div>
        </form>
    )
}

export { Login };
