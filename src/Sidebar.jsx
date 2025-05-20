import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const menu = [
  { label: 'Home', path: '/dashboard' },
  { label: 'Katalog', path: '/katalog' },
  { label: 'Pesanan', path: '/pesanan' },
  { label: 'Kontak', path: '/kontak' },
];
const settings = [
  { label: 'Profile', path: '/profile' },
];

const Sidebar = () => {
  const location = useLocation();
  return (
    <div className="sidebar">
      <div className="sidebar-title">My Costum</div>
      <div className="sidebar-menu">
        {menu.map(item => (
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