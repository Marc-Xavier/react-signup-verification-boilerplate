import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import config from 'config';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [refreshTokenTimeout, setRefreshTokenTimeout] = useState(null);

    const baseUrl = `${config.apiUrl}/accounts`;

    // Helper to parse JWT token
    const parseJwt = (token) => {
        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch (e) {
            return null;
        }
    };

    // Start refresh token timer
    const startRefreshTokenTimer = useCallback((jwtToken) => {
        const jwtData = parseJwt(jwtToken);
        if (!jwtData) return;

        const expires = new Date(jwtData.exp * 1000);
        const timeout = expires.getTime() - Date.now() - (60 * 1000);

        const timeoutId = setTimeout(() => {
            refreshToken();
        }, timeout);

        setRefreshTokenTimeout(timeoutId);
    }, []);

    // Stop refresh token timer
    const stopRefreshTokenTimer = useCallback(() => {
        if (refreshTokenTimeout) {
            clearTimeout(refreshTokenTimeout);
            setRefreshTokenTimeout(null);
        }
    }, [refreshTokenTimeout]);

    // Login function using native fetch
    const login = async (email, password) => {
        const response = await fetch(`${baseUrl}/authenticate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            const text = await response.text();
            const data = text ? JSON.parse(text) : {};
            const error = (data && data.message) || response.statusText;
            throw new Error(error);
        }

        const text = await response.text();
        const userData = text ? JSON.parse(text) : null;

        setUser(userData);
        startRefreshTokenTimer(userData.jwtToken);
        return userData;
    };

    // Logout function using native fetch
    const logout = useCallback(async () => {
        try {
            await fetch(`${baseUrl}/revoke-token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(user?.jwtToken ? { Authorization: `Bearer ${user.jwtToken}` } : {})
                },
                credentials: 'include',
                body: JSON.stringify({})
            });
        } catch (error) {
            // Ignore errors during logout
        }

        stopRefreshTokenTimer();
        setUser(null);
    }, [user, stopRefreshTokenTimer, baseUrl]);

    // Refresh token function using native fetch
    const refreshToken = useCallback(async () => {
        try {
            const response = await fetch(`${baseUrl}/refresh-token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({})
            });

            if (!response.ok) {
                throw new Error('Token refresh failed');
            }

            const text = await response.text();
            const userData = text ? JSON.parse(text) : null;

            setUser(userData);
            startRefreshTokenTimer(userData.jwtToken);
            return userData;
        } catch (error) {
            // If refresh fails, logout
            await logout();
            throw error;
        }
    }, [baseUrl, startRefreshTokenTimer, logout]);

    // Register function using native fetch
    const register = async (params) => {
        const response = await fetch(`${baseUrl}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        });

        if (!response.ok) {
            const text = await response.text();
            const data = text ? JSON.parse(text) : {};
            const error = (data && data.message) || response.statusText;
            throw new Error(error);
        }

        const text = await response.text();
        return text ? JSON.parse(text) : null;
    };

    // Verify email function using native fetch
    const verifyEmail = async (token) => {
        const response = await fetch(`${baseUrl}/verify-email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token })
        });

        if (!response.ok) {
            const text = await response.text();
            const data = text ? JSON.parse(text) : {};
            const error = (data && data.message) || response.statusText;
            throw new Error(error);
        }

        const text = await response.text();
        return text ? JSON.parse(text) : null;
    };

    // Forgot password function using native fetch
    const forgotPassword = async (email) => {
        const response = await fetch(`${baseUrl}/forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });

        if (!response.ok) {
            const text = await response.text();
            const data = text ? JSON.parse(text) : {};
            const error = (data && data.message) || response.statusText;
            throw new Error(error);
        }

        const text = await response.text();
        return text ? JSON.parse(text) : null;
    };

    // Validate reset token function using native fetch
    const validateResetToken = async (token) => {
        const response = await fetch(`${baseUrl}/validate-reset-token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token })
        });

        if (!response.ok) {
            const text = await response.text();
            const data = text ? JSON.parse(text) : {};
            const error = (data && data.message) || response.statusText;
            throw new Error(error);
        }

        const text = await response.text();
        return text ? JSON.parse(text) : null;
    };

    // Reset password function using native fetch
    const resetPassword = async ({ token, password, confirmPassword }) => {
        const response = await fetch(`${baseUrl}/reset-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token, password, confirmPassword })
        });

        if (!response.ok) {
            const text = await response.text();
            const data = text ? JSON.parse(text) : {};
            const error = (data && data.message) || response.statusText;
            throw new Error(error);
        }

        const text = await response.text();
        return text ? JSON.parse(text) : null;
    };

    // Get current user profile using native fetch
    const getById = async (id) => {
        const response = await fetch(`${baseUrl}/${id}`, {
            method: 'GET',
            headers: {
                ...(user?.jwtToken ? { Authorization: `Bearer ${user.jwtToken}` } : {})
            }
        });

        if (!response.ok) {
            if ([401, 403].includes(response.status) && user) {
                await logout();
            }
            const text = await response.text();
            const data = text ? JSON.parse(text) : {};
            const error = (data && data.message) || response.statusText;
            throw new Error(error);
        }

        const text = await response.text();
        return text ? JSON.parse(text) : null;
    };

    // Update user profile using native fetch
    const update = async (id, params) => {
        const response = await fetch(`${baseUrl}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...(user?.jwtToken ? { Authorization: `Bearer ${user.jwtToken}` } : {})
            },
            body: JSON.stringify(params)
        });

        if (!response.ok) {
            if ([401, 403].includes(response.status) && user) {
                await logout();
            }
            const text = await response.text();
            const data = text ? JSON.parse(text) : {};
            const error = (data && data.message) || response.statusText;
            throw new Error(error);
        }

        const text = await response.text();
        const updatedUser = text ? JSON.parse(text) : null;

        // Update stored user if the logged in user updated their own record
        if (updatedUser && user && updatedUser.id === user.id) {
            setUser({ ...user, ...updatedUser });
        }

        return updatedUser;
    };

    // Delete user using native fetch
    const deleteUser = async (id) => {
        const response = await fetch(`${baseUrl}/${id}`, {
            method: 'DELETE',
            headers: {
                ...(user?.jwtToken ? { Authorization: `Bearer ${user.jwtToken}` } : {})
            }
        });

        if (!response.ok) {
            if ([401, 403].includes(response.status) && user) {
                await logout();
            }
            const text = await response.text();
            const data = text ? JSON.parse(text) : {};
            const error = (data && data.message) || response.statusText;
            throw new Error(error);
        }

        // Auto logout if the logged in user deleted their own record
        if (user && id === user.id) {
            await logout();
        }

        const text = await response.text();
        return text ? JSON.parse(text) : null;
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopRefreshTokenTimer();
        };
    }, [stopRefreshTokenTimer]);

    const value = {
        user,
        login,
        logout,
        refreshToken,
        register,
        verifyEmail,
        forgotPassword,
        validateResetToken,
        resetPassword,
        getById,
        update,
        deleteUser
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
