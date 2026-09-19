import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('easyvyaapaar_auth') === 'true';
  });

  const [role, setRole] = useState(() => {
    return localStorage.getItem('easyvyaapaar_role') || 'SHOP_KEEPER';
  });

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('easyvyaapaar_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {}
    }
    return {
      id: 2,
      name: 'Shop Owner',
      email: 'shopkeeper@easyvyaapaar.com',
      mobile: '+91 9876543210',
      shopId: 101,
      shopName: 'Sri Lakshmi Kirana & General Store',
      status: 'ACTIVE'
    };
  });

  useEffect(() => {
    localStorage.setItem('easyvyaapaar_auth', isAuthenticated);
    localStorage.setItem('easyvyaapaar_role', role);
    localStorage.setItem('easyvyaapaar_user', JSON.stringify(user));
  }, [isAuthenticated, role, user]);

  const login = (userData) => {
    const newRole = userData.role || 'SHOP_KEEPER';
    setUser(userData);
    setRole(newRole);
    setIsAuthenticated(true);
  };

  const signup = (userData) => {
    login(userData);
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('easyvyaapaar_auth');
  };

  const toggleRole = (newRole) => {
    if (newRole) {
      setRole(newRole);
    } else {
      setRole(prev => (prev === 'SUPER_ADMIN' ? 'SHOP_KEEPER' : 'SUPER_ADMIN'));
    }
  };

  const isSuperAdmin = role === 'SUPER_ADMIN';
  const isShopkeeper = role === 'SHOP_KEEPER';

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      login, 
      signup, 
      logout, 
      role, 
      setRole, 
      toggleRole, 
      isSuperAdmin, 
      isShopkeeper, 
      user, 
      setUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
