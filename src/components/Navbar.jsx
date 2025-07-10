import { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Button, Drawer, Avatar, Dropdown, Modal } from 'antd';
import {
  MenuOutlined,
  HomeOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  PhoneOutlined,
  UserOutlined,
  LogoutOutlined,
  ToolOutlined,
  ProfileOutlined,
  DashboardOutlined
} from '@ant-design/icons';
import './Navbar.css';
import { AuthContext } from '../providers/AuthProvider';
import LoginPage from '../pages/login';

const Navbar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { isLoggedIn, userProfile, logout } = useContext(AuthContext);
  const [isLogoutConfirmVisible, setIsLogoutConfirmVisible] = useState(false);

  // Menu utama navbar (Home, Katalog, dll)
  const menuItems = [
    { key: '/home', label: 'Home', icon: <HomeOutlined /> },
    { key: '/katalog', label: 'Koleksi', icon: <ShoppingOutlined /> },
  ];

  // Tambahkan menu user
  if (isLoggedIn && userProfile?.role === 'user') {
    menuItems.push({ key: '/pesanan', label: 'Pesanan', icon: <ShoppingCartOutlined /> });
  }

  // Tambahkan menu admin
  if (isLoggedIn && userProfile?.role === 'admin') {
    menuItems.push(
      { key: 'dashboard-admin', label: <Link to="/admin">Dashboard Admin</Link>, icon: <DashboardOutlined />},
      { key: '/katalog-admin', label: 'Katalog Admin', icon: <ToolOutlined /> },
      { key: '/manajemen-pesanan', label: 'Manajemen Pesanan', icon: <ProfileOutlined /> }
    );
  }

  const handleMenuClick = ({ key }) => {
    if (key === 'logout') {
      showLogoutConfirm(); // tampilkan modal konfirmasi logout
    }
  };
  

  // Dropdown avatar hanya untuk Profile, Dashboard Admin (khusus admin), dan Logout
  const userMenuItems = [
    {
      key: 'profile',
      label: <Link to="/profile">Profile</Link>,
      icon: <UserOutlined />
    },
    {
      key: 'logout',
      label: 'Logout',
      icon: <LogoutOutlined />,
      danger: true
    }
  ];

  const showLogoutConfirm = () => {
    setIsLogoutConfirmVisible(true);
  };
  
  const handleConfirmLogout = () => {
    setIsLogoutConfirmVisible(false);
    logout();
    navigate('/login');
  };
  
  const handleCancelLogout = () => {
    setIsLogoutConfirmVisible(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setIsDrawerOpen(true)}
            className="menu-button"
          />
          <Link to="/home" className="navbar-brand" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src="/images/logo.png" alt="Rentique Logo" style={{ height: 40, width: 'auto', display: 'block' }} />
          </Link>
        </div>

        <div className="navbar-right">
          {/* Menu utama */}
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <Menu
              mode="horizontal"
              selectedKeys={[location.pathname]}
              overflowedIndicator={null}
              items={menuItems.map(item => ({
                key: item.key,
                icon: item.icon,
                label: <Link to={item.key}>{item.label}</Link>
              }))}
            />
          </div>

          {/* Login button / Avatar */}
          {isLoggedIn ? (
            <Dropdown
              menu={{ items: userMenuItems, onClick: handleMenuClick }}
              placement="bottomRight"
              trigger={['click']}
            >
              <Avatar icon={<UserOutlined />} className="avatar" />
            </Dropdown>
          ) : (
            <Button type="primary" onClick={() => navigate('/login')}>
              Login
            </Button>
          )}
        </div>
      </div>

      {/* Drawer untuk mobile */}
      <Drawer
        title="Menu"
        placement="left"
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        className="mobile-drawer"
      >
        <Menu
          mode="vertical"
          selectedKeys={[location.pathname]}
          items={menuItems.map(item => ({
            key: item.key,
            icon: item.icon,
            label: <Link to={item.key}>{item.label}</Link>
          }))}
        />
        <div className="drawer-footer">
          <div className="admin-contact">
            <div>Kontak Admin</div>
            <div className="admin-phone">
              <PhoneOutlined /> 089507406743
            </div>
          </div>
        </div>
      </Drawer>

      <Modal
        title="Konfirmasi Logout"
        open={isLogoutConfirmVisible}
        onOk={handleConfirmLogout}
        onCancel={handleCancelLogout}
        okText="Ya"
        cancelText="Tidak"
        okButtonProps={{
          style: {
            backgroundColor: '#a7374a',
            borderColor: '#a7374a',
            color: '#fff'
          }
        }}
        cancelButtonProps={{
          style: {
            borderColor: '#a7374a',
            color: '#a7374a'
          }
        }}
        centered
      >
        <p style={{ color: '#333', fontSize: '16px' }}>
          Apakah Anda yakin ingin logout?
        </p>
      </Modal>
    </nav>
  );
};

export default Navbar;
