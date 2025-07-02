import { Row, Col, Card, Statistic, Table, Typography } from 'antd';
import { UserOutlined, ShoppingCartOutlined, DollarOutlined, ShoppingOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';

const { Title } = Typography;

const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(false);

  // Data dummy untuk statistik
  const stats = [
    {
      title: 'Total Pengguna',
      value: 1234,
      icon: <UserOutlined style={{ fontSize: '24px', color: '#a7374a' }} />,
      color: '#a7374a'
    },
    {
      title: 'Total Pesanan',
      value: 567,
      icon: <ShoppingCartOutlined style={{ fontSize: '24px', color: '#a7374a' }} />,
      color: '#a7374a'
    },
    {
      title: 'Pendapatan',
      value: 'Rp 15.000.000',
      icon: <DollarOutlined style={{ fontSize: '24px', color: '#a7374a' }} />,
      color: '#a7374a'
    },
    {
      title: 'Produk Terjual',
      value: 890,
      icon: <ShoppingOutlined style={{ fontSize: '24px', color: '#a7374a' }} />,
      color: '#a7374a'
    }
  ];

  // Data dummy untuk tabel pesanan terbaru
  const recentOrders = [
    {
      key: '1',
      id: 'ORD001',
      customer: 'John Doe',
      product: 'Gunung Bromo',
      amount: 'Rp 500.000',
      status: 'Selesai'
    },
    {
      key: '2',
      id: 'ORD002',
      customer: 'Jane Smith',
      product: 'Pantai Kuta',
      amount: 'Rp 750.000',
      status: 'Proses'
    },
    {
      key: '3',
      id: 'ORD003',
      customer: 'Mike Johnson',
      product: 'Danau Toba',
      amount: 'Rp 1.000.000',
      status: 'Menunggu'
    }
  ];

  const columns = [
    {
      title: 'ID Pesanan',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Pelanggan',
      dataIndex: 'customer',
      key: 'customer',
    },
    {
      title: 'Produk',
      dataIndex: 'product',
      key: 'product',
    },
    {
      title: 'Jumlah',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span style={{
          color: status === 'Selesai' ? '#52c41a' : 
                 status === 'Proses' ? '#1890ff' : '#faad14',
          fontWeight: 'bold'
        }}>
          {status}
        </span>
      )
    }
  ];

  return (
    <div className="layout-content">
      <Title level={2}>Dashboard Admin</Title>
      
      {/* Statistik Cards */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} md={6} key={index}>
            <Card bordered={false} style={{ borderRadius: '15px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={stat.icon}
                valueStyle={{ color: stat.color }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Tabel Pesanan Terbaru */}
      <Card 
        title="Pesanan Terbaru" 
        bordered={false}
        style={{ borderRadius: '15px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
      >
        <Table 
          columns={columns} 
          dataSource={recentOrders}
          loading={isLoading}
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default AdminDashboard; 