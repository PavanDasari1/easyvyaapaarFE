import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import Navbar from './components/Navbar/Navbar';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Transactions from './pages/Transactions';
import Settings from './pages/Settings';
import Reports from './pages/Reports';
import { useLanguage } from './i18n';

function App() {
  const { lang, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleOpenAddModal = () => {
    navigate('/products');
  };

  return (
    <div className="app-layout">
      <Sidebar onOpenAddModal={handleOpenAddModal} />
      <div className="app-main-wrapper">
        <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <main className="main-content-body">
          <Routes>
            <Route path="/" element={<Dashboard searchQuery={searchQuery} />} />
            <Route path="/products" element={<Products searchQuery={searchQuery} />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
