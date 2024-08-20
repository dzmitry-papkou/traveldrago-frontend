import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiService from '../services/apiService';
import { ENDPOINTS } from '../constants/endpoints';

interface User {
    username: string;
    email: string; // Add email to the User interface
    token: string;
}

interface UserContextType {
    user: User | null;
    login: (userData: User) => void;
    logout: () => Promise<void>;
    refreshUserData: () => Promise<void>; // Method to refresh user data
    updateUser: (updatedData: Partial<User>) => void; // Method to update user data
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error("useUser must be used within a UserProvider");
    return context;
};

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(JSON.parse(localStorage.getItem('user') || 'null'));

    const login = (userData: User) => {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = (): Promise<void> => {
        return new Promise((resolve) => {
            localStorage.removeItem('user');
            setUser(null);
            resolve();
        });
    };

    const refreshUserData = async (): Promise<void> => {
        if (!user) return;
        try {
            const response = await apiService.makeRequestAsync<User>({
                url: ENDPOINTS.USER_INFO,
                httpMethod: 'GET',
                authToken: user.token,
            });
            if ('data' in response) {
                const updatedUser = { ...user, ...response.data }; // Merge the new data with existing user data
                localStorage.setItem('user', JSON.stringify(updatedUser)); // Update local storage
                setUser(updatedUser);
            }
        } catch (error) {
            console.error("Failed to refresh user data", error);
        }
    };

    const updateUser = (updatedData: Partial<User>) => {
        if (!user) return;
        const updatedUser = { ...user, ...updatedData };
        localStorage.setItem('user', JSON.stringify(updatedUser)); // Update local storage
        setUser(updatedUser);
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    return (
        <UserContext.Provider value={{ user, login, logout, refreshUserData, updateUser }}>
            {children}
        </UserContext.Provider>
    );
};

// Correct way to export if using default export for an object
const UserExports = { useUser, UserProvider };
export default UserExports;
