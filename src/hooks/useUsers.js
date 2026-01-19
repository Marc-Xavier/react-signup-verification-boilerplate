import { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import config from 'config';

export const useUsers = () => {
    const { user, logout } = useAuth();
    const [loading, setLoading] = useState(false);
    const baseUrl = `${config.apiUrl}/accounts`;

    // Helper function to handle fetch response
    const handleResponse = async (response) => {
        const text = await response.text();
        const data = text ? JSON.parse(text) : null;

        if (!response.ok) {
            // Auto logout if 401 Unauthorized or 403 Forbidden
            if ([401, 403].includes(response.status) && user) {
                await logout();
            }
            const error = (data && data.message) || response.statusText;
            throw new Error(error);
        }

        return data;
    };

    // Get all users using native fetch
    const getAll = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(baseUrl, {
                method: 'GET',
                headers: {
                    ...(user?.jwtToken ? { Authorization: `Bearer ${user.jwtToken}` } : {})
                }
            });
            return await handleResponse(response);
        } finally {
            setLoading(false);
        }
    }, [user, baseUrl]);

    // Get user by ID using native fetch
    const getById = useCallback(async (id) => {
        setLoading(true);
        try {
            const response = await fetch(`${baseUrl}/${id}`, {
                method: 'GET',
                headers: {
                    ...(user?.jwtToken ? { Authorization: `Bearer ${user.jwtToken}` } : {})
                }
            });
            return await handleResponse(response);
        } finally {
            setLoading(false);
        }
    }, [user, baseUrl]);

    // Create user using native fetch
    const create = useCallback(async (params) => {
        setLoading(true);
        try {
            const response = await fetch(baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(user?.jwtToken ? { Authorization: `Bearer ${user.jwtToken}` } : {})
                },
                body: JSON.stringify(params)
            });
            return await handleResponse(response);
        } finally {
            setLoading(false);
        }
    }, [user, baseUrl]);

    // Update user using native fetch
    const update = useCallback(async (id, params) => {
        setLoading(true);
        try {
            const response = await fetch(`${baseUrl}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...(user?.jwtToken ? { Authorization: `Bearer ${user.jwtToken}` } : {})
                },
                body: JSON.stringify(params)
            });
            return await handleResponse(response);
        } finally {
            setLoading(false);
        }
    }, [user, baseUrl]);

    // Delete user using native fetch
    const deleteUser = useCallback(async (id) => {
        setLoading(true);
        try {
            const response = await fetch(`${baseUrl}/${id}`, {
                method: 'DELETE',
                headers: {
                    ...(user?.jwtToken ? { Authorization: `Bearer ${user.jwtToken}` } : {})
                }
            });

            const result = await handleResponse(response);

            // Auto logout if the logged in user deleted their own record
            if (user && id === user.id) {
                await logout();
            }

            return result;
        } finally {
            setLoading(false);
        }
    }, [user, baseUrl, logout]);

    return {
        loading,
        getAll,
        getById,
        create,
        update,
        deleteUser
    };
};
