import React from 'react';
import { MailOutlined, PhoneOutlined, EnvironmentOutlined } from '@ant-design/icons';

const Footer = () => (
  <footer style={{ background: '#a7374a', color: '#fff', width: '100%', margin: '0', padding: '48px 0 32px 0', position: 'relative' }}>
    <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 32, padding: '0 32px' }}>
      <div style={{ flex: 1, minWidth: 260 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 18 }}>
          <EnvironmentOutlined style={{ fontSize: 22, marginRight: 16 }} />
          <div>
            <div>Jl. Udayana No. 11</div>
            <div style={{ fontWeight: 700 }}>Singaraja, Bali, Indonesia</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 18 }}>
          <PhoneOutlined style={{ fontSize: 22, marginRight: 16 }} />
          <div style={{ fontWeight: 700 }}>+62 812 3456 7890</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 18 }}>
          <MailOutlined style={{ fontSize: 22, marginRight: 16 }} />
          <a href="mailto:support@rentique.com" style={{ color: '#fff', fontWeight: 700, textDecoration: 'underline' }}>support@rentique.com</a>
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 260 }}>
        <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 12 }}>Tentang Kami</div>
        <div style={{ color: '#f3eaea', marginBottom: 24 }}>
          Rentique adalah platform sewa kostum untuk segala acara. Koleksi lengkap, proses mudah, dan layanan ramah.
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <a href="#" style={{ color: '#fff', fontSize: 22, background: 'rgba(0,0,0,0.12)', borderRadius: 8, padding: 6 }}><i className="fab fa-facebook-f"></i></a>
          <a href="#" style={{ color: '#fff', fontSize: 22, background: 'rgba(0,0,0,0.12)', borderRadius: 8, padding: 6 }}><i className="fab fa-twitter"></i></a>
          <a href="#" style={{ color: '#fff', fontSize: 22, background: 'rgba(0,0,0,0.12)', borderRadius: 8, padding: 6 }}><i className="fab fa-linkedin-in"></i></a>
          <a href="#" style={{ color: '#fff', fontSize: 22, background: 'rgba(0,0,0,0.12)', borderRadius: 8, padding: 6 }}><i className="fab fa-github"></i></a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer; 