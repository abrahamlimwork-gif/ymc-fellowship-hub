import React, { createContext, useContext, useState, useEffect } from 'react';
import { StorageService } from '../utils/storage';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => StorageService.getCurrentUser());
  const [users, setUsers] = useState(() => StorageService.getUsers());
  const [theme, setThemeState] = useState(() => StorageService.getTheme());

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setThemeState(nextTheme);
    StorageService.setTheme(nextTheme);
  };

  const switchUser = (user) => {
    setCurrentUser(user);
    StorageService.setCurrentUser(user);
  };

  const registerUser = (userData) => {
    const updatedUsers = StorageService.saveUser(userData);
    setUsers(updatedUsers);
    const created = updatedUsers.find(u => u.email.toLowerCase() === userData.email.toLowerCase()) || userData;
    switchUser(created);
    return created;
  };

  const isAdmin = currentUser?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        isAdmin,
        switchUser,
        registerUser,
        theme,
        toggleTheme
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
