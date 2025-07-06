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

      {/* Kontak admin */}
      <div className="sidebar-admin">
        <div>Kontak Admin</div>
        <div className="sidebar-admin-contact">
          <span className="icon-phone"/>
          <a
            href="https://wa.me/6285784978009"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'white', marginLeft: 8, textDecoration: 'underline' }}
          >
            085784978009
          </a>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;