import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiService from '../services/apiService';
import { ENDPOINTS } from '../constants/endpoints';

interface User {
  username: string;
  email: string;
  token: string;
  idToken: string;
}

interface UserContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (userData: User) => void;
  logout: () => Promise<void>;
  refreshUserData: () => Promise<void>;
  updateUser: (updatedData: Partial<User>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
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
    return new Promise(resolve => {
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
        const updatedUser = { ...user, ...response.data };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
    } catch (error) {
      console.error('Failed to refresh user data', error);
    }
  };

  const updateUser = (updatedData: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updatedData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const isLoggedIn = !!user;

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, isLoggedIn, login, logout, refreshUserData, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

const UserContextExports = { useUser, UserProvider };
export default UserContextExports;
