import React, { useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';

import { useUsers } from '@/hooks/useUsers';
import { useAlert } from '@/contexts/AlertContext';

function AddEdit() {
    const { id } = useParams();
    const history = useHistory();
    const { getById, create, update } = useUsers();
    const { success, error: showError } = useAlert();
    const isAddMode = !id;

    const [values, setValues] = useState({
        title: '',
        firstName: '',
        lastName: '',
        email: '',
        role: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(!isAddMode);

    useEffect(() => {
        if (!isAddMode) {
            // get user and set form fields
            getById(id).then(user => {
                setValues({
                    title: user.title || '',
                    firstName: user.firstName || '',
                    lastName: user.lastName || '',
                    email: user.email || '',
                    role: user.role || '',
                    password: '',
                    confirmPassword: ''
                });
                setIsLoading(false);
            }).catch(() => {
                setIsLoading(false);
            });
        }
    }, [id, isAddMode, getById]);

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
            case 'role':
                if (!value) return 'Role is required';
                return '';
            case 'password':
                if (isAddMode && !value) return 'Password is required';
                if (value && value.length < 6) return 'Password must be at least 6 characters';
                return '';
            case 'confirmPassword':
                if (allValues.password && value !== allValues.password) return 'Passwords must match';
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
        const allTouched = Object.keys(values).reduce((acc, key) => ({ ...acc, [key]: true }), {});
        setTouched(allTouched);

        // Stop if there are errors
        if (Object.keys(newErrors).length > 0) return;

        setIsSubmitting(true);

        if (isAddMode) {
            await createUser(values);
        } else {
            await updateUser(id, values);
        }
    }

    async function createUser(fields) {
        try {
            await create(fields);
            success('User added successfully', { keepAfterRouteChange: true });
            history.push('.');
        } catch (error) {
            setIsSubmitting(false);
            showError(error.message);
        }
    }

    async function updateUser(id, fields) {
        try {
            await update(id, fields);
            success('Update successful', { keepAfterRouteChange: true });
            history.push('..');
        } catch (error) {
            setIsSubmitting(false);
            showError(error.message);
        }
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <form onSubmit={handleSubmit}>
            <h1>{isAddMode ? 'Add User' : 'Edit User'}</h1>
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
            <div className="form-row">
                <div className="form-group col-7">
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
                <div className="form-group col">
                    <label>Role</label>
                    <select
                        name="role"
                        value={values.role}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={'form-control' + (errors.role && touched.role ? ' is-invalid' : '')}
                    >
                        <option value=""></option>
                        <option value="User">User</option>
                        <option value="Admin">Admin</option>
                    </select>
                    {errors.role && touched.role && (
                        <div className="invalid-feedback">{errors.role}</div>
                    )}
                </div>
            </div>
            {!isAddMode &&
                <div>
                    <h3 className="pt-3">Change Password</h3>
                    <p>Leave blank to keep the same password</p>
                </div>
            }
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
            <div className="form-group">
                <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                    {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                    Save
                </button>
                <Link to={isAddMode ? '.' : '..'} className="btn btn-link">Cancel</Link>
            </div>
        </form>
    );
}

export { AddEdit };
