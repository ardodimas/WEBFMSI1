import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from './providers/AuthProvider';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const { userProfile } = useContext(AuthContext);

  const userMenu = [
    { label: 'Katalog', path: '/costumes' },
    { label: 'Pesanan', path: '/pesanan' },
    { label: 'Kontak', path: '/kontak' },
  ];

  const adminMenu = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Manajemen Pesanan', path: '/admin/orders' },
    { label: 'Katalog', path: '/costumes' },
    { label: 'Kontak', path: '/kontak' },
  ];

  const settings = [
    { label: 'Profile', path: '/profile' },
  ];

  const currentMenu = userProfile?.role === 'admin' ? adminMenu : userMenu;

  return (
    <div className="sidebar">
      <div className="sidebar-title">My Costum</div>
      {userProfile?.role === 'admin' && (
        <div className="sidebar-admin-badge">
          <span>ADMIN</span>
        </div>
      )}
      <div className="sidebar-menu">
        {currentMenu.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={location.pathname === item.path ? 'active' : ''}
          >
            <span className="icon-box"/> {item.label}
          </Link>
        ))}
      </div>
      <div className="sidebar-settings">Settings</div>
      <div className="sidebar-menu">
        {settings.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={location.pathname === item.path ? 'active' : ''}
          >
            <span className="icon-box"/> {item.label}
          </Link>
        ))}
      </div>
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