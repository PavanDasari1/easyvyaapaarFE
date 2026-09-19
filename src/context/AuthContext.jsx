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
      upiId: '9876543210@ybl',
      status: 'ACTIVE'
    };
  });

  useEffect(() => {
    localStorage.setItem('easyvyaapaar_auth', isAuthenticated);
    localStorage.setItem('easyvyaapaar_role', role);
    localStorage.setItem('easyvyaapaar_user', JSON.stringify(user));
  }, [isAuthenticated, role, user]);

  const updateUserProfile = (updatedData) => {
    setUser(prev => {
      const newObj = { ...prev, ...updatedData };
      localStorage.setItem('easyvyaapaar_user', JSON.stringify(newObj));
      return newObj;
    });
  };

  // Persistent Users Database in LocalStorage
  const [usersDb, setUsersDb] = useState(() => {
    const saved = localStorage.getItem('easyvyaapaar_users_db');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      {
        id: 1,
        name: 'Dasari Pavan (Admin)',
        email: 'admin@easyvyaapaar.com',
        mobile: '9876543210',
        password: 'Admin@123',
        role: 'SUPER_ADMIN',
        shopName: 'System Administration',
        status: 'ACTIVE'
      },
      {
        id: 2,
        name: 'Ramesh Kumar',
        email: 'shopkeeper@easyvyaapaar.com',
        mobile: '9123456789',
        password: 'Shopkeeper@123',
        role: 'SHOP_KEEPER',
        shopName: 'Sri Lakshmi Kirana & General Store',
        status: 'ACTIVE'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('easyvyaapaar_users_db', JSON.stringify(usersDb));
  }, [usersDb]);

  const cleanPhone = (phoneStr) => {
    return phoneStr ? phoneStr.replace(/[^0-9]/g, '') : '';
  };

  const checkUserExists = (mobile, email) => {
    const targetMobile = cleanPhone(mobile);
    const targetEmail = email ? email.toLowerCase().trim() : '';

    const phoneExists = usersDb.some(u => cleanPhone(u.mobile) === targetMobile && targetMobile !== '');
    const emailExists = usersDb.some(u => u.email.toLowerCase().trim() === targetEmail && targetEmail !== '');

    return { phoneExists, emailExists };
  };

  const registerUser = (userData) => {
    const { phoneExists, emailExists } = checkUserExists(userData.mobile, userData.email);
    if (phoneExists) {
      throw new Error(`Phone number ${userData.mobile} is already registered with an existing account.`);
    }
    if (emailExists) {
      throw new Error(`Email address ${userData.email} is already registered.`);
    }

    const newUser = {
      id: Date.now(),
      name: userData.fullName || userData.name,
      email: userData.email.toLowerCase().trim(),
      mobile: userData.mobile.trim(),
      password: userData.password,
      role: userData.role || 'SHOP_KEEPER',
      shopName: userData.shopName || 'My Kirana Store',
      status: 'ACTIVE',
      createdAt: new Date().toISOString()
    };

    setUsersDb(prev => [...prev, newUser]);
    login(newUser);
    return newUser;
  };

  const findUserByCredentials = (inputStr, password, roleFilter) => {
    const target = inputStr.toLowerCase().trim();
    const targetPhone = cleanPhone(inputStr);

    return usersDb.find(u => {
      const matchesId = u.email.toLowerCase().trim() === target || (targetPhone !== '' && cleanPhone(u.mobile) === targetPhone);
      const matchesPass = u.password === password;
      const matchesRole = roleFilter ? u.role === roleFilter : true;
      return matchesId && matchesPass && matchesRole;
    });
  };

  const login = (userData) => {
    const newRole = userData.role || 'SHOP_KEEPER';
    setUser(userData);
    setRole(newRole);
    setIsAuthenticated(true);
  };

  const signup = (userData) => {
    return registerUser(userData);
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
      setUser,
      updateUserProfile,
      usersDb,
      checkUserExists,
      findUserByCredentials
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
