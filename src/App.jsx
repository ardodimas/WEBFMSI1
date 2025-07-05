import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import './App.css'
import Profile from './pages/Profile'
import Katalog from './pages/katalog'
import LoginPage from './pages/login'
import Dashboard from './pages/Dashboard/Dashboard'
import Pesanan from './pages/user/Pesanan'
import TransferPaymentPage from './pages/Transfer'
import OrderManagementPage from './pages/admin/OrderManagement'
import QRISPaymentPage from './pages/Transfer/QRISPayment'
import KatalogAdmin from './pages/Katalog_Admin'
import { useContext } from "react";
import { AuthContext } from "./providers/AuthProvider";

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/costumes': 'Katalog',
  '/pesanan': 'Pesanan',
  '/transfer': 'Transfer',
  '/profile': 'Profile',
  '/admin/orders': 'Manajemen Pesanan',
  '/katalog-admin': 'Katalog Admin'
}

// Component untuk menampilkan error page
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

// Component untuk protected routes
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isLoggedIn, userProfile } = useContext(AuthContext);
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(userProfile?.role)) {
    // Tampilkan error page dengan pesan yang sesuai
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
  
  return (
    <div className="main-content">
      <div className="main-header">
        <h1 className="main-title">{title}</h1>
        <div className="main-header-divider" />
      </div>
      <Routes>
        {/* Routes untuk User biasa */}
        <Route 
          path="/costumes" 
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <Katalog />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/pesanan" 
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <Pesanan />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/transfer" 
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <TransferPaymentPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Routes untuk Admin */}
        <Route 
          path="/katalog-admin" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <KatalogAdmin />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/orders" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <OrderManagementPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Routes untuk semua user yang sudah login */}
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        
        {/* Route untuk transfer payment dengan ID */}
        <Route 
          path="/pembayaran/transfer/:id" 
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <TransferPaymentPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/pembayaran/qris/:id" 
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <QRISPaymentPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Redirect default routes */}
        <Route path="/" element={<Navigate to="/costumes" replace />} />
        <Route path="/dashboard" element={<Navigate to="/costumes" replace />} />
      </Routes>
    </div>
  )
}

function App() {
  const location = useLocation();
  const { isLoadingScreen } = useContext(AuthContext);

  if (isLoadingScreen) {
    // Tampilkan loading spinner
    return <div>Loading...</div>;
  }

  const isAuthPage = ["/", "/login"].includes(location.pathname);

  return isAuthPage ? (
    // jika di halaman login/register, tampilkan hanya LoginPage fullscreen
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  ) : (
    // selain itu, tampilkan Sidebar + MainContent
    <div className="app-main">
      <Sidebar />
      <MainContent />
    </div>
  );
}

export default App;
