import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Default to SUPER_ADMIN for testing, or restore from localStorage
  const [role, setRole] = useState(() => {
    return localStorage.getItem('easyvyaapaar_role') || 'SUPER_ADMIN';
  });

  const [user, setUser] = useState({
    id: 1,
    name: 'Dasari Pavan',
    email: 'admin@easyvyaapaar.com',
    mobile: '+91 9876543210',
    shopId: 101,
    shopName: 'Sri Lakshmi Kirana & General Store',
    status: 'ACTIVE'
  });

  useEffect(() => {
    localStorage.setItem('easyvyaapaar_role', role);
  }, [role]);

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
    <AuthContext.Provider value={{ role, setRole, toggleRole, isSuperAdmin, isShopkeeper, user, setUser }}>
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
