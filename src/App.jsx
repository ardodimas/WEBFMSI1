import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
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
import Home from './pages/home';
import AdminDashboard from './pages/admin';
import Footer from './components/Footer';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/katalog': 'Katalog',
  '/pesanan': 'Pesanan',
  '/transfer': 'Transfer',
  '/profile': 'Profile',
  '/manajemen-pesanan': 'Manajemen Pesanan',
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
    const redirectPath = userProfile?.role === 'admin' ? '/katalog-admin' : '/katalog';

    return <ErrorPage message={message} redirectPath={redirectPath} />;
  }

  return children;
};

function MainContent() {
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'Katalog';
  return (
    <div className="main-content">
      <Routes>
        {/* Home Public */}
        <Route path="/home" element={<Home />} />

        {/* Public Katalog */}
        <Route path="/katalog" element={<Katalog />} />

        {/* Checkout/Pesanan Protected */}
        <Route 
          path="/pesanan" 
          element={<ProtectedRoute allowedRoles={['user']}><Pesanan /></ProtectedRoute>} 
        />
        <Route 
          path="/transfer" 
          element={<ProtectedRoute allowedRoles={['user']}><TransferPaymentPage /></ProtectedRoute>} 
        />
        <Route 
          path="/pembayaran/transfer/:id" 
          element={<ProtectedRoute allowedRoles={['user']}><TransferPaymentPage /></ProtectedRoute>} 
        />
        <Route 
          path="/pembayaran/qris/:id" 
          element={<ProtectedRoute allowedRoles={['user']}><QRISPaymentPage /></ProtectedRoute>} 
        />

        {/* Admin */}
        <Route 
          path="/katalog-admin" 
          element={<ProtectedRoute allowedRoles={['admin']}><KatalogAdmin /></ProtectedRoute>} 
        />
        <Route 
          path="/manajemen-pesanan" 
          element={<ProtectedRoute allowedRoles={['admin']}><OrderManagementPage /></ProtectedRoute>} 
        />
        <Route 
          path="/admin" 
          element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} 
        />
        {/* Profile */}
        <Route 
          path="/profile" 
          element={<ProtectedRoute><Profile /></ProtectedRoute>} 
        />

        {/* Redirect */}
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Navigate to="/home" replace />} />
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

  const isAuthPage = [ "/login", "/register"].includes(location.pathname);

  return isAuthPage ? (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  ) : (
    <div className="app-main">
      <Navbar />
      <MainContent />
      <Footer />
    </div>
  );
}

export default App;
