import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Button, Drawer, Avatar, Dropdown } from 'antd';
import { 
  MenuOutlined, 
  HomeOutlined, 
  ShoppingOutlined, 
  ShoppingCartOutlined, 
  PhoneOutlined,
  UserOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import './Navbar.css';

const Navbar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { key: '/', label: 'Home', icon: <HomeOutlined /> },
    { key: '/katalog', label: 'Katalog', icon: <ShoppingOutlined /> },
    { key: '/pesanan', label: 'Pesanan', icon: <ShoppingCartOutlined /> },
    { key: '/kontak', label: 'Kontak', icon: <PhoneOutlined /> },
  ];

  const userMenuItems = [
    {
      key: 'profile',
      label: <Link to="/profile">Profile</Link>,
      icon: <UserOutlined />
    },
    {
      key: 'admin',
      label: <Link to="/admin">Admin Dashboard</Link>,
      icon: <UserOutlined />
    },
    {
      key: 'logout',
      label: 'Logout',
      icon: <LogoutOutlined />,
      danger: true
    }
  ];

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
          <Link to="/" className="navbar-brand">
            My Costum
          </Link>
        </div>

        <div className="navbar-right">
          <Menu 
            mode="horizontal" 
            selectedKeys={[location.pathname]}
            items={menuItems.map(item => ({
              key: item.key,
              icon: item.icon,
              label: <Link to={item.key}>{item.label}</Link>
            }))}
          />
          <Dropdown 
            menu={{ items: userMenuItems }} 
            placement="bottomRight"
            trigger={['click']}
          >
            <Avatar 
              icon={<UserOutlined />} 
              className="avatar"
            />
          </Dropdown>
        </div>
      </div>

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
    </nav>
  );
};

export default Navbar; 