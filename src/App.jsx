import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import './App.css'
import Profile from './pages/Profile'
import Katalog from './pages/katalog'
import AdminDashboard from './pages/admin'
import Home from './pages/home'

function MainContent() {
  return (
    <div className="main-content">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/katalog" element={<Katalog />} />
        <Route path="/pesanan" element={<div>Ini halaman Pesanan</div>} />
        <Route path="/kontak" element={<div>Ini halaman Kontak</div>} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <div className="app-main">
      <Navbar />
      <MainContent />
    </div>
  )
}

export default App
