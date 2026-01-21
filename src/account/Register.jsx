import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { useAuth } from '@/contexts/AuthContext';
import { useAlert } from '@/contexts/AlertContext';

function Register() {
    const { register } = useAuth();
    const { success, error: showError } = useAlert();
    const history = useHistory();

    const [values, setValues] = useState({
        title: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false
    });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    function validateField(name, value, allValues = values) {
        switch (name) {
            case 'title':
                if (!value) return 'Title is required';
                return '';
            case 'firstName':
                if (!value) return 'First Name is required';
                return '';
            case 'lastName':
                if (!value) return 'Last Name is required';
                return '';
            case 'email':
                if (!value) return 'Email is required';
                if (!/\S+@\S+\.\S+/.test(value)) return 'Email is invalid';
                return '';
            case 'password':
                if (!value) return 'Password is required';
                if (value.length < 6) return 'Password must be at least 6 characters';
                return '';
            case 'confirmPassword':
                if (!value) return 'Confirm Password is required';
                if (value !== allValues.password) return 'Passwords must match';
                return '';
            case 'acceptTerms':
                if (!value) return 'Accept Terms & Conditions is required';
                return '';
            default:
                return '';
        }
    }

    function handleChange(e) {
        const { name, value, type, checked } = e.target;
        const fieldValue = type === 'checkbox' ? checked : value;
        const newValues = { ...values, [name]: fieldValue };
        setValues(newValues);

        // Validate on change if field was touched
        if (touched[name]) {
            const error = validateField(name, fieldValue, newValues);
            setErrors(prev => ({ ...prev, [name]: error }));
        }

        // Also revalidate confirmPassword when password changes
        if (name === 'password' && touched.confirmPassword) {
            const confirmError = validateField('confirmPassword', newValues.confirmPassword, newValues);
            setErrors(prev => ({ ...prev, confirmPassword: confirmError }));
        }
    }

    function handleBlur(e) {
        const { name, value, type, checked } = e.target;
        const fieldValue = type === 'checkbox' ? checked : value;
        setTouched(prev => ({ ...prev, [name]: true }));

        const error = validateField(name, fieldValue);
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
        const allTouched = Object.keys(values).reduce((acc, key) => ({ ...acc, [key]: true }), {});
        setTouched(allTouched);

        // Stop if there are errors
        if (Object.keys(newErrors).length > 0) return;

        setIsSubmitting(true);

        try {
            await register(values);
            success('Registration successful! You can now login', { keepAfterRouteChange: true });
            history.push('login');
        } catch (error) {
            setIsSubmitting(false);
            showError(error.message);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h3 className="card-header">Register</h3>
            <div className="card-body">
                <div className="form-row">
                    <div className="form-group col">
                        <label>Title</label>
                        <select
                            name="title"
                            value={values.title}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={'form-control' + (errors.title && touched.title ? ' is-invalid' : '')}
                        >
                            <option value=""></option>
                            <option value="Mr">Mr</option>
                            <option value="Mrs">Mrs</option>
                            <option value="Miss">Miss</option>
                            <option value="Ms">Ms</option>
                        </select>
                        {errors.title && touched.title && (
                            <div className="invalid-feedback">{errors.title}</div>
                        )}
                    </div>
                    <div className="form-group col-5">
                        <label>First Name</label>
                        <input
                            name="firstName"
                            type="text"
                            value={values.firstName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={'form-control' + (errors.firstName && touched.firstName ? ' is-invalid' : '')}
                        />
                        {errors.firstName && touched.firstName && (
                            <div className="invalid-feedback">{errors.firstName}</div>
                        )}
                    </div>
                    <div className="form-group col-5">
                        <label>Last Name</label>
                        <input
                            name="lastName"
                            type="text"
                            value={values.lastName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={'form-control' + (errors.lastName && touched.lastName ? ' is-invalid' : '')}
                        />
                        {errors.lastName && touched.lastName && (
                            <div className="invalid-feedback">{errors.lastName}</div>
                        )}
                    </div>
                </div>
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
                <div className="form-row">
                    <div className="form-group col">
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
                    <div className="form-group col">
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
                </div>
                <div className="form-group form-check">
                    <input
                        type="checkbox"
                        name="acceptTerms"
                        id="acceptTerms"
                        checked={values.acceptTerms}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={'form-check-input ' + (errors.acceptTerms && touched.acceptTerms ? ' is-invalid' : '')}
                    />
                    <label htmlFor="acceptTerms" className="form-check-label">Accept Terms & Conditions</label>
                    {errors.acceptTerms && touched.acceptTerms && (
                        <div className="invalid-feedback">{errors.acceptTerms}</div>
                    )}
                </div>
                <div className="form-group">
                    <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                        {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                        Register
                    </button>
                    <Link to="login" className="btn btn-link">Cancel</Link>
                </div>
            </div>
        </form>
    )
}

export { Register };
