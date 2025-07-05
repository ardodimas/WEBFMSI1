import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from './providers/AuthProvider';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const { userProfile, logout } = useContext(AuthContext);
  
  // Menu untuk User biasa
  const userMenu = [
    { label: 'Katalog', path: '/costumes' },
    { label: 'Pesanan', path: '/pesanan' },
  ];

  // Menu untuk Admin
  const adminMenu = [
    { label: 'Katalog Admin', path: '/katalog-admin' },
  ];

  // Menu settings untuk semua user
  const settingsMenu = [
    { label: 'Profile', path: '/profile' },
  ];

  // Tentukan menu yang akan ditampilkan berdasarkan role
  const getMenuItems = () => {
    if (userProfile?.role === 'admin') {
      return adminMenu;
    } else {
      return userMenu;
    }
  };

  const menuItems = getMenuItems();

  // Handle logout dengan debugging
  const handleLogout = async () => {
    console.log("Logout button clicked");
    try {
      await logout();
      console.log("Logout completed successfully");
    } catch (error) {
      console.error("Logout error in sidebar:", error);
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-title">My Costum</div>
      {userProfile?.role === 'admin' && (
        <div className="sidebar-admin-badge">
          <span>ADMIN</span>
        </div>
      )}
      
      {/* Menu utama berdasarkan role */}
      <div className="sidebar-menu">
        {menuItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={location.pathname === item.path ? 'active' : ''}
          >
            <span className="icon-box"/> {item.label}
          </Link>
        ))}
      </div>

      {/* Settings menu */}
      <div className="sidebar-settings">Settings</div>
      <div className="sidebar-menu">
        {settingsMenu.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={location.pathname === item.path ? 'active' : ''}
          >
            <span className="icon-box"/> {item.label}
          </Link>
        ))}
      </div>

      {/* User info dan logout */}
      <div className="sidebar-user-info">
        <div className="user-role">
          {userProfile?.role === 'admin' ? 'Admin' : 'User'}
        </div>
        <button 
          onClick={handleLogout}
          className="logout-button"
          type="button"
        >
          Logout
        </button>
      </div>

      {/* Kontak admin */}
      <div className="sidebar-admin">
        <div>Kontak Admin</div>
        <div className="sidebar-admin-contact">
          <span className="icon-phone"/> 089507406743
        </div>
      </div>
    </div>
  );
};

export default Sidebar;