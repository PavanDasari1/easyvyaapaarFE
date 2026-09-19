import { useState } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import Navbar from './components/Navbar/Navbar';

// Auth Pages
import Login from './pages/Login';
import Signup from './pages/Signup';

// Admin Pages
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminUsers from './pages/Admin/AdminUsers';
import AdminShops from './pages/Admin/AdminShops';
import AdminReports from './pages/Admin/AdminReports';

// Shopkeeper Pages
import ShopkeeperDashboard from './pages/Shopkeeper/ShopkeeperDashboard';
import ShopkeeperInventory from './pages/Shopkeeper/ShopkeeperInventory';
import ShopkeeperSales from './pages/Shopkeeper/ShopkeeperSales';
import ShopkeeperReports from './pages/Shopkeeper/ShopkeeperReports';

// Shared Pages
import Products from './pages/Products';
import Transactions from './pages/Transactions';
import Settings from './pages/Settings';
import Reports from './pages/Reports';

import { useAuth } from './context/AuthContext';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const { isAuthenticated, isSuperAdmin } = useAuth();
  const navigate = useNavigate();

  const handleOpenAddModal = () => {
    navigate('/products');
  };

  // 1. Unauthenticated users MUST see the Login / Signup page first
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // 2. Authenticated users see the Full App Layout
  return (
    <div className="app-layout">
      <Sidebar onOpenAddModal={handleOpenAddModal} />
      <div className="app-main-wrapper">
        <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <main className="main-content-body">
          <Routes>
            {/* Login/Signup redirects to home for logged in users */}
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="/signup" element={<Navigate to="/" replace />} />

            {/* Dynamic Root Route based on Active Role */}
            <Route 
              path="/" 
              element={isSuperAdmin ? <AdminDashboard /> : <ShopkeeperDashboard searchQuery={searchQuery} />} 
            />

            {/* Dedicated Admin Routes */}
            <Route 
              path="/AdminDashboard" 
              element={isSuperAdmin ? <AdminDashboard /> : <Navigate to="/ShopkeeperDashboard" replace />} 
            />
            <Route 
              path="/AdminUsers" 
              element={isSuperAdmin ? <AdminUsers /> : <Navigate to="/ShopkeeperDashboard" replace />} 
            />
            <Route 
              path="/AdminShops" 
              element={isSuperAdmin ? <AdminShops /> : <Navigate to="/ShopkeeperDashboard" replace />} 
            />
            <Route 
              path="/AdminReports" 
              element={isSuperAdmin ? <AdminReports /> : <Navigate to="/ShopkeeperReports" replace />} 
            />

            {/* Dedicated Shopkeeper Routes */}
            <Route 
              path="/ShopkeeperDashboard" 
              element={<ShopkeeperDashboard searchQuery={searchQuery} />} 
            />
            <Route 
              path="/ShopkeeperInventory" 
              element={<ShopkeeperInventory />} 
            />
            <Route 
              path="/ShopkeeperSales" 
              element={<ShopkeeperSales />} 
            />
            <Route 
              path="/ShopkeeperReports" 
              element={<ShopkeeperReports />} 
            />

            {/* Shared Catalog & System Routes */}
            <Route path="/products" element={<Products searchQuery={searchQuery} />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />

            {/* Wildcard Fallback */}
            <Route 
              path="*" 
              element={isSuperAdmin ? <AdminDashboard /> : <ShopkeeperDashboard searchQuery={searchQuery} />} 
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
