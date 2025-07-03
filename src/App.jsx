import { Routes, Route, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import './App.css'
import Profile from './pages/Profile'
import Katalog from './pages/katalog'
import LoginPage from './pages/login'
import Dashboard from './pages/Dashboard/Dashboard'
import Pesanan from './pages/user/Pesanan'
import TransferPaymentPage from './pages/Transfer'
import { useContext } from "react";
import { AuthContext } from "./providers/AuthProvider";

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/katalog': 'Katalog',
  '/pesanan': 'Pesanan',
  '/kontak': 'Kontak',
  '/profile': 'Profile',
}

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
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/costumes" element={<Katalog />} />
        <Route path="/pesanan" element={<Pesanan />} />
        <Route path="/kontak" element={<div>Ini halaman Kontak</div>} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/pembayaran/transfer/:id" element={<TransferPaymentPage />} />
        {/* <Route path="/pembayaran/transfer/:orderId" element={<HalamanTransfer />} />
        <Route path="/pembayaran/qris/:orderId" element={<HalamanQRIS />} />  */}
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
