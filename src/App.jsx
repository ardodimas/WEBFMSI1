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


const pageTitles = {
  '/': 'Login',
  '/login': 'Login',
  '/dashboard': 'Dashboard',
  '/katalog': 'Katalog',
  '/pesanan': 'Pesanan',
  '/kontak': 'Kontak',
  '/profile': 'Profile',
}
>>>>>>> 10b97cdb98ac0466c4c657c8ec8632c109c4883c

function MainContent() {
  return (
    <div className="main-content">
      <Routes>
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
