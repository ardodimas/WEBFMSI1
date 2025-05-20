import { Routes, Route, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import './App.css'
import Profile from './pages/Profile'
import Katalog from './pages/katalog'
import LoginPage from './pages/login/LoginPage'
import Dashboard from './pages/Dashboard/Dashboard'


const pageTitles = {
  '/': 'Login',
  '/login': 'Login',
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
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/katalog" element={<Katalog />} />
        <Route path="/pesanan" element={<div>Ini halaman Pesanan</div>} />
        <Route path="/kontak" element={<div>Ini halaman Kontak</div>} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <div className="app-main">
      <Sidebar />
      <MainContent />
    </div>
  )
}

export default App
