<<<<<<< HEAD
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import './App.css'
import Profile from './pages/Profile'
import Katalog from './pages/katalog'
<<<<<<< HEAD
import AdminDashboard from './pages/admin'
import Home from './pages/home'
=======
import LoginPage from './pages/login/LoginPage'
import Dashboard from './pages/Dashboard/Dashboard'

=======
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import './App.css';
import Profile from './pages/Profile';
import Katalog from './pages/katalog';
import LoginPage from './pages/login';
import Dashboard from './pages/Dashboard/Dashboard';
import Pesanan from './pages/user/Pesanan';
import TransferPaymentPage from './pages/Transfer';
import OrderManagementPage from './pages/admin/OrderManagement';
import QRISPaymentPage from './pages/Transfer/QRISPayment';
import KatalogAdmin from './pages/Katalog_Admin';
import RegisterPage from './pages/Register';
import { useContext } from "react";
import { AuthContext } from "./providers/AuthProvider";
>>>>>>> 66540431b895c07c0410c2dc5c76676fde18b506

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/costumes': 'Katalog',
  '/pesanan': 'Pesanan',
  '/transfer': 'Transfer',
  '/profile': 'Profile',
<<<<<<< HEAD
}
>>>>>>> 10b97cdb98ac0466c4c657c8ec8632c109c4883c

function MainContent() {
=======
  '/admin/orders': 'Manajemen Pesanan',
  '/katalog-admin': 'Katalog Admin'
};

const ErrorPage = ({ message, redirectPath }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '60vh',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h1 style={{ color: '#a7374a', marginBottom: '20px' }}>Akses Ditolak</h1>
      <p style={{ fontSize: '18px', marginBottom: '30px' }}>{message}</p>
      <button
        onClick={() => window.location.href = redirectPath}
        style={{
          background: '#a7374a',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '6px',
          fontSize: '16px',
          cursor: 'pointer'
        }}
      >
        Kembali ke Beranda
      </button>
    </div>
  );
};

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isLoggedIn, userProfile } = useContext(AuthContext);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(userProfile?.role)) {
    const message = userProfile?.role === 'admin'
      ? "Admin tidak dapat mengakses halaman ini. Silakan gunakan menu Katalog Admin."
      : "User tidak dapat mengakses halaman ini. Silakan gunakan menu Katalog, Pesanan, atau Transfer.";
    const redirectPath = userProfile?.role === 'admin' ? '/katalog-admin' : '/costumes';

    return <ErrorPage message={message} redirectPath={redirectPath} />;
  }

  return children;
};

function MainContent() {
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'Katalog';

>>>>>>> 66540431b895c07c0410c2dc5c76676fde18b506
  return (
    <div className="main-content">
      <Routes>
<<<<<<< HEAD
<<<<<<< HEAD
        <Route path="/" element={<Home />} />
=======
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
>>>>>>> 10b97cdb98ac0466c4c657c8ec8632c109c4883c
        <Route path="/katalog" element={<Katalog />} />
        <Route path="/pesanan" element={<div>Ini halaman Pesanan</div>} />
        <Route path="/kontak" element={<div>Ini halaman Kontak</div>} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<AdminDashboard />} />
=======
        {/* User */}
        <Route 
          path="/costumes" 
          element={<ProtectedRoute allowedRoles={['user']}><Katalog /></ProtectedRoute>} 
        />
        <Route 
          path="/pesanan" 
          element={<ProtectedRoute allowedRoles={['user']}><Pesanan /></ProtectedRoute>} 
        />
        <Route 
          path="/transfer" 
          element={<ProtectedRoute allowedRoles={['user']}><TransferPaymentPage /></ProtectedRoute>} 
        />

        {/* Admin */}
        <Route 
          path="/katalog-admin" 
          element={<ProtectedRoute allowedRoles={['admin']}><KatalogAdmin /></ProtectedRoute>} 
        />
        <Route 
          path="/admin/orders" 
          element={<ProtectedRoute allowedRoles={['admin']}><OrderManagementPage /></ProtectedRoute>} 
        />

        {/* Umum */}
        <Route 
          path="/profile" 
          element={<ProtectedRoute><Profile /></ProtectedRoute>} 
        />
        <Route 
          path="/pembayaran/transfer/:id" 
          element={<ProtectedRoute allowedRoles={['user']}><TransferPaymentPage /></ProtectedRoute>} 
        />
        <Route 
          path="/pembayaran/qris/:id" 
          element={<ProtectedRoute allowedRoles={['user']}><QRISPaymentPage /></ProtectedRoute>} 
        />

        {/* Redirect */}
        <Route path="/" element={<Navigate to="/costumes" replace />} />
        <Route path="/dashboard" element={<Navigate to="/costumes" replace />} />
>>>>>>> 66540431b895c07c0410c2dc5c76676fde18b506
      </Routes>
    </div>
  );
}

function App() {
  const location = useLocation();
  const { isLoadingScreen } = useContext(AuthContext);

  if (isLoadingScreen) {
    return <div>Loading...</div>;
  }

  // 🔧 Tambahkan "/register" ke daftar auth page
  const isAuthPage = ["/", "/login", "/register"].includes(location.pathname);

  return isAuthPage ? (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  ) : (
    <div className="app-main">
      <Navbar />
      <MainContent />
    </div>
  );
}

export default App;
