import { createContext, useEffect, useState } from "react";
import { authAPI } from "../api/index";

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        try {
            const res = await authAPI.getMe();
            setUser(res.data);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);  
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (username, password) => {
        await authAPI.login(username, password);
        await checkAuth();
    };

    const register = async (username, password) => {
        await authAPI.register(username, password);
    };

    const resetPassword = async (username, newPassword) => {
        await authAPI.resetPassword(username, newPassword);
    };

    const logout = async () => {
        await authAPI.logout();
        setUser(null);
    };


    return (
        <AuthContext.Provider value={{ user, loading, login, register, resetPassword, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
