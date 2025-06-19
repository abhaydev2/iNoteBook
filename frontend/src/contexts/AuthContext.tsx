import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  forgotPassword: (email: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, rememberMe = false): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user exists in registered users
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const existingUser = registeredUsers.find((u: any) => u.email === email);
    
    if (!existingUser) {
      setIsLoading(false);
      return false;
    }
    
    const mockUser: User = {
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email
    };
    
    setUser(mockUser);
    
    if (rememberMe) {
      localStorage.setItem('currentUser', JSON.stringify(mockUser));
    }
    
    setIsLoading(false);
    return true;
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Save user to registered users list
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password // In real app, this would be hashed
    };
    
    registeredUsers.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    // Simulate password reset email
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true;
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      logout,
      isLoading,
      forgotPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};