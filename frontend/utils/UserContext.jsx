import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
  };

  export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
  
    const userlogin = (userData) => {
      setUser(userData);
    };
  
    const userlogout = () => {
      setUser(null);
    };
  
    return (
      <AuthContext.Provider value={{ user, userlogin, userlogout }}>
        {children}
      </AuthContext.Provider>
    );
  };