import { Routes, Route, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import './App.css'
import Profile from './pages/Profile'
import Katalog from './pages/katalog'

const pageTitles = {
  '/': 'Home',
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
        <Route path="/" element={<div>Ini halaman Home</div>} />
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
