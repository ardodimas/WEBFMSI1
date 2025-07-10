import { Row, Col, Card, Statistic, Table, Typography, Tabs, Button, Modal, Form, Input, Popconfirm, Drawer, Select, notification } from 'antd';
import { ShoppingCartOutlined, DollarOutlined, ShoppingOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import './admin-tabs-red.css';

const { Title } = Typography;

const AdminDashboard = () => {
  const [api, contextHolder] = notification.useNotification();

  const openNotificationWithIcon = (type, title, msg) => {
    api[type]({
      message: title,
      description: msg,
    });
  };

  // --- CATEGORY CRUD ---
  const [categories, setCategories] = useState([]);
  const [catLoading, setCatLoading] = useState(false);
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [catEdit, setCatEdit] = useState(null);
  const [catForm] = Form.useForm();

  // Fetch categories
  const fetchCategories = () => {
    setCatLoading(true);
    fetch('http://127.0.0.1:5000/api/categories')
      .then(res => res.json())
      .then(data => setCategories(Array.isArray(data) ? data : []))
      .catch(() => openNotificationWithIcon('error', 'Gagal', 'Gagal mengambil data kategori'))
      .finally(() => setCatLoading(false));
  };
  useEffect(() => { fetchCategories(); }, []);

  // Tambah/Edit Category
  const handleCatOk = () => {
    catForm.validateFields().then(values => {
      const method = catEdit ? 'PUT' : 'POST';
      const url = catEdit ? `http://127.0.0.1:5000/api/categories/${catEdit.id}` : 'http://127.0.0.1:5000/api/categories';
      fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      })
        .then(res => res.json())
        .then(() => {
          setCatModalOpen(false);
          setCatEdit(null);
          catForm.resetFields();
          fetchCategories();
          openNotificationWithIcon('success', catEdit ? 'Kategori Diupdate' : 'Kategori Ditambah', catEdit ? 'Kategori berhasil diupdate' : 'Kategori berhasil ditambah');
        })
        .catch(() => openNotificationWithIcon('error', 'Gagal', 'Gagal simpan kategori'));
    });
  };
  // Hapus Category
  const handleCatDelete = (id) => {
    fetch(`http://127.0.0.1:5000/api/categories/${id}`, { method: 'DELETE' })
      .then(() => {
        fetchCategories();
        openNotificationWithIcon('success', 'Kategori Dihapus', 'Kategori berhasil dihapus');
      })
      .catch(() => openNotificationWithIcon('error', 'Gagal', 'Gagal hapus kategori'));
  };

  // --- COSTUME CRUD ---
  const [costumes, setCostumes] = useState([]);
  const [costumeLoading, setCostumeLoading] = useState(false);
  // Kategori untuk dropdown
  // (sudah ada categories dari tab kategori)

  // Fetch costumes
  const fetchCostumes = () => {
    setCostumeLoading(true);
    fetch('http://127.0.0.1:5000/api/costumes')
      .then(res => res.json())
      .then(data => setCostumes(Array.isArray(data) ? data : []))
      .catch(() => openNotificationWithIcon('error', 'Gagal', 'Gagal mengambil data kostum'))
      .finally(() => setCostumeLoading(false));
  };
  useEffect(() => { fetchCostumes(); }, []);

  // --- SIZE CRUD ---
  const [sizes, setSizes] = useState([]);
  const [sizeLoading, setSizeLoading] = useState(false);
  const [sizeModalOpen, setSizeModalOpen] = useState(false);
  const [sizeEdit, setSizeEdit] = useState(null);
  const [sizeForm] = Form.useForm();

  // Fetch sizes
  const fetchSizes = () => {
    setSizeLoading(true);
    fetch('http://127.0.0.1:5000/api/sizes')
      .then(res => res.json())
      .then(data => setSizes(Array.isArray(data) ? data : []))
      .catch(() => openNotificationWithIcon('error', 'Gagal', 'Gagal mengambil data size'))
      .finally(() => setSizeLoading(false));
  };
  useEffect(() => { fetchSizes(); }, []);

  // Tambah/Edit Size
  const handleSizeOk = () => {
    sizeForm.validateFields().then(values => {
      const method = sizeEdit ? 'PUT' : 'POST';
      const url = sizeEdit ? `http://127.0.0.1:5000/api/sizes/${sizeEdit.id}` : 'http://127.0.0.1:5000/api/sizes';
      fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      })
        .then(res => res.json())
        .then(() => {
          setSizeModalOpen(false);
          setSizeEdit(null);
          sizeForm.resetFields();
          fetchSizes();
          openNotificationWithIcon('success', sizeEdit ? 'Ukuran Diupdate' : 'Ukuran Ditambah', sizeEdit ? 'Ukuran berhasil diupdate' : 'Ukuran berhasil ditambah');
        })
        .catch(() => openNotificationWithIcon('error', 'Gagal', 'Gagal simpan ukuran'));
    });
  };
  // Hapus Size
  const handleSizeDelete = (id) => {
    fetch(`http://127.0.0.1:5000/api/sizes/${id}`, { method: 'DELETE' })
      .then(() => {
        fetchSizes();
        openNotificationWithIcon('success', 'Ukuran Dihapus', 'Ukuran berhasil dihapus');
      })
      .catch(() => openNotificationWithIcon('error', 'Gagal', 'Gagal hapus ukuran'));
  };

  // --- USER CRUD ---
  const [users, setUsers] = useState([]);
  const [userLoading, setUserLoading] = useState(false);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [userEdit, setUserEdit] = useState(null);
  const [userForm] = Form.useForm();

  // Fetch users
  const fetchUsers = () => {
    setUserLoading(true);
    fetch('http://127.0.0.1:5000/api/users')
      .then(res => res.json())
      .then(data => setUsers(Array.isArray(data) ? data : []))
      .catch(() => openNotificationWithIcon('error', 'Gagal', 'Gagal mengambil data user'))
      .finally(() => setUserLoading(false));
  };
  useEffect(() => { fetchUsers(); }, []);

  // Tambah/Edit User
  const handleUserOk = () => {
    userForm.validateFields().then(values => {
      // Hapus password jika edit dan tidak diisi
      if (userEdit && !values.password) delete values.password;
      const method = userEdit ? 'PUT' : 'POST';
      const url = userEdit ? `http://127.0.0.1:5000/api/users/${userEdit.id}` : 'http://127.0.0.1:5000/api/users';
      fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      })
        .then(res => res.json())
        .then(() => {
          setUserModalOpen(false);
          setUserEdit(null);
          userForm.resetFields();
          fetchUsers();
          openNotificationWithIcon('success', userEdit ? 'User Diupdate' : 'User Ditambah', userEdit ? 'User berhasil diupdate' : 'User berhasil ditambah');
        })
        .catch(() => openNotificationWithIcon('error', 'Gagal', 'Gagal simpan user'));
    });
  };
  // Hapus User
  const handleUserDelete = (id) => {
    fetch(`http://127.0.0.1:5000/api/users/${id}`, { method: 'DELETE' })
      .then(() => {
        fetchUsers();
        openNotificationWithIcon('success', 'User Dihapus', 'User berhasil dihapus');
      })
      .catch(() => openNotificationWithIcon('error', 'Gagal', 'Gagal hapus user'));
  };

  // --- ORDER CRUD ---
  const [orders, setOrders] = useState([]);
  const [orderLoading, setOrderLoading] = useState(false);

  // Fetch orders
  const fetchOrders = () => {
    setOrderLoading(true);
    fetch('http://127.0.0.1:5000/api/orders')
      .then(res => res.json())
      .then(data => setOrders(Array.isArray(data) ? data : []))
      .catch(() => openNotificationWithIcon('error', 'Gagal', 'Gagal mengambil data order'))
      .finally(() => setOrderLoading(false));
  };
  useEffect(() => { fetchOrders(); }, []);

  // --- PAYMENT CRUD ---
  // --- TABS ---
  const tabItems = [
    {
      key: 'category',
      label: 'Kategori',
      children: (
        <Card bordered={false} style={{ borderRadius: 15, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <Title level={4} style={{ margin: 0 }}>Data Kategori</Title>
            <Button icon={<PlusOutlined />} onClick={() => { setCatEdit(null); setCatModalOpen(true); }} className="admin-btn-red">Tambah</Button>
          </div>
          <Table
            dataSource={categories}
            loading={catLoading}
            rowKey="id"
            columns={[
              { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
              { title: 'Nama Kategori', dataIndex: 'name', key: 'name' },
              {
                title: 'Aksi',
                key: 'aksi',
                render: (_, rec) => (
                  <>
                    <Button icon={<EditOutlined />} size="small" style={{ marginRight: 8 }} onClick={() => { setCatEdit(rec); setCatModalOpen(true); catForm.setFieldsValue({ name: rec.name }); }} />
                    <Popconfirm title="Hapus kategori?" onConfirm={() => handleCatDelete(rec.id)} okText="Ya" cancelText="Batal">
                      <Button icon={<DeleteOutlined />} size="small" danger />
                    </Popconfirm>
                  </>
                )
              }
            ]}
          />
          <Drawer
            title={catEdit ? 'Edit Kategori' : 'Tambah Kategori'}
            open={catModalOpen}
            onClose={() => { setCatModalOpen(false); setCatEdit(null); catForm.resetFields(); }}
            width={400}
            footer={null}
          >
            <Form form={catForm} layout="vertical" onFinish={handleCatOk}>
              <Form.Item name="name" label="Nama Kategori" rules={[{ required: true, message: 'Nama kategori wajib diisi' }]}> 
                <Input />
              </Form.Item>
              <div style={{ textAlign: 'right' }}>
                <Button onClick={() => { setCatModalOpen(false); setCatEdit(null); catForm.resetFields(); }} style={{ marginRight: 8 }}>Batal</Button>
                <Button type="primary" htmlType="submit">{catEdit ? 'Update' : 'Tambah'}</Button>
              </div>
            </Form>
          </Drawer>
        </Card>
      )
    },
    {
      key: 'size',
      label: 'Ukuran',
      children: (
        <Card bordered={false} style={{ borderRadius: 15, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <Title level={4} style={{ margin: 0 }}>Data Ukuran</Title>
            <Button icon={<PlusOutlined />} onClick={() => { setSizeEdit(null); setSizeModalOpen(true); }} className="admin-btn-red">Tambah</Button>
          </div>
          <Table
            dataSource={sizes}
            loading={sizeLoading}
            rowKey="id"
            columns={[
              { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
              { title: 'Nama Ukuran', dataIndex: 'name', key: 'name' },
              {
                title: 'Aksi',
                key: 'aksi',
                render: (_, rec) => (
                  <>
                    <Button icon={<EditOutlined />} size="small" style={{ marginRight: 8 }} onClick={() => { setSizeEdit(rec); setSizeModalOpen(true); sizeForm.setFieldsValue({ name: rec.name }); }} />
                    <Popconfirm title="Hapus ukuran?" onConfirm={() => handleSizeDelete(rec.id)} okText="Ya" cancelText="Batal">
                      <Button icon={<DeleteOutlined />} size="small" danger />
                    </Popconfirm>
                  </>
                )
              }
            ]}
          />
          <Drawer
            title={sizeEdit ? 'Edit Ukuran' : 'Tambah Ukuran'}
            open={sizeModalOpen}
            onClose={() => { setSizeModalOpen(false); setSizeEdit(null); sizeForm.resetFields(); }}
            width={400}
            footer={null}
          >
            <Form form={sizeForm} layout="vertical" onFinish={handleSizeOk}>
              <Form.Item name="name" label="Nama Ukuran" rules={[{ required: true, message: 'Nama ukuran wajib diisi' }]}> 
                <Input />
              </Form.Item>
              <div style={{ textAlign: 'right' }}>
                <Button onClick={() => { setSizeModalOpen(false); setSizeEdit(null); sizeForm.resetFields(); }} style={{ marginRight: 8 }}>Batal</Button>
                <Button type="primary" htmlType="submit">{sizeEdit ? 'Update' : 'Tambah'}</Button>
              </div>
            </Form>
          </Drawer>
        </Card>
      )
    },
    {
      key: 'user',
      label: 'User',
      children: (
        <Card bordered={false} style={{ borderRadius: 15, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <Title level={4} style={{ margin: 0 }}>Data User</Title>
            <Button icon={<PlusOutlined />} onClick={() => { setUserEdit(null); setUserModalOpen(true); }} className="admin-btn-red">Tambah</Button>
          </div>
          <Table
            dataSource={users}
            loading={userLoading}
            rowKey="id"
            columns={[
              { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
              { title: 'Nama', dataIndex: 'name', key: 'name' },
              { title: 'Email', dataIndex: 'email', key: 'email' },
              { title: 'Telepon', dataIndex: 'phone', key: 'phone' },
              { title: 'Role', dataIndex: 'role', key: 'role' },
              {
                title: 'Aksi',
                key: 'aksi',
                render: (_, rec) => (
                  <>
                    <Button icon={<EditOutlined />} size="small" style={{ marginRight: 8 }} onClick={() => { setUserEdit(rec); setUserModalOpen(true); userForm.setFieldsValue({ ...rec, password: undefined }); }} />
                    <Popconfirm title="Hapus user?" onConfirm={() => handleUserDelete(rec.id)} okText="Ya" cancelText="Batal">
                      <Button icon={<DeleteOutlined />} size="small" danger />
                    </Popconfirm>
                  </>
                )
              }
            ]}
          />
          <Drawer
            title={userEdit ? 'Edit User' : 'Tambah User'}
            open={userModalOpen}
            onClose={() => { setUserModalOpen(false); setUserEdit(null); userForm.resetFields(); }}
            width={400}
            footer={null}
          >
            <Form form={userForm} layout="vertical" onFinish={handleUserOk}>
              <Form.Item name="name" label="Nama" rules={[{ required: true, message: 'Nama wajib diisi' }]}> 
                <Input />
              </Form.Item>
              <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Email wajib diisi' }]}> 
                <Input type="email" />
              </Form.Item>
              {!userEdit && (
                <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Password wajib diisi' }]}> 
                  <Input.Password />
                </Form.Item>
              )}
              <Form.Item name="phone" label="Telepon"> 
                <Input />
              </Form.Item>
              <Form.Item name="role" label="Role" rules={[{ required: true, message: 'Role wajib dipilih' }]}> 
                <Select placeholder="Pilih Role">
                  <Select.Option value="admin">Admin</Select.Option>
                  <Select.Option value="user">User</Select.Option>
                </Select>
              </Form.Item>
              <div style={{ textAlign: 'right' }}>
                <Button onClick={() => { setUserModalOpen(false); setUserEdit(null); userForm.resetFields(); }} style={{ marginRight: 8 }}>Batal</Button>
                <Button type="primary" htmlType="submit">{userEdit ? 'Update' : 'Tambah'}</Button>
              </div>
            </Form>
          </Drawer>
        </Card>
      )
    },
    // Tab lain (Costume, Size, User, Order, Payment, Order Item, Costume Size) bisa diduplikasi dari sini
  ];

  // Hitung total uang masuk dari order yang payment_status-nya 'paid'
  const totalUangMasuk = orders
    .filter(order => order.payment_status === 'paid')
    .reduce((sum, order) => sum + (order.total_price || 0), 0);

  return (
    <>
      {contextHolder}
      <div className="layout-content admin-dashboard-content">
        <Title level={2}>Dashboard Admin</Title>
        <Row gutter={[16, 16]} className="admin-stats-row">
          <Col xs={24} sm={8}>
            <Card bordered className="admin-stats-card">
              <Statistic title="Total Jenis Kostum" value={costumes.length} prefix={<ShoppingCartOutlined style={{ color: '#a7374a' }} />} valueStyle={{ color: '#a7374a' }} />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card bordered className="admin-stats-card">
              <Statistic title="Uang Masuk" value={totalUangMasuk} prefix={<DollarOutlined style={{ color: '#a7374a' }} />} valueStyle={{ color: '#a7374a' }} />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card bordered className="admin-stats-card">
              <Statistic title="Banyak Orderan Masuk" value={orders.length} prefix={<ShoppingOutlined style={{ color: '#a7374a' }} />} valueStyle={{ color: '#a7374a' }} />
            </Card>
          </Col>
        </Row>
        <Tabs
          items={tabItems}
          className="admin-tabs-red"
        />
      </div>
    </>
  );
};

export default AdminDashboard; 