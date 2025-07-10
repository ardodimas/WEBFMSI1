import { Row, Col, Card, Statistic, Table, Typography, Tabs, Button, Modal, Form, Input, Popconfirm, message, Drawer, Select } from 'antd';
import { UserOutlined, ShoppingCartOutlined, DollarOutlined, ShoppingOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import './admin-tabs-red.css';

const { Title } = Typography;

const AdminDashboard = () => {
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
      .catch(() => message.error('Gagal mengambil data kategori'))
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
          message.success(catEdit ? 'Kategori diupdate' : 'Kategori ditambah');
        })
        .catch(() => message.error('Gagal simpan kategori'));
    });
  };
  // Hapus Category
  const handleCatDelete = (id) => {
    fetch(`http://127.0.0.1:5000/api/categories/${id}`, { method: 'DELETE' })
      .then(() => {
        fetchCategories();
        message.success('Kategori dihapus');
      })
      .catch(() => message.error('Gagal hapus kategori'));
  };

  // --- COSTUME CRUD ---
  const [costumes, setCostumes] = useState([]);
  const [costumeLoading, setCostumeLoading] = useState(false);
  const [costumeModalOpen, setCostumeModalOpen] = useState(false);
  const [costumeEdit, setCostumeEdit] = useState(null);
  const [costumeForm] = Form.useForm();
  // Kategori untuk dropdown
  // (sudah ada categories dari tab kategori)

  // Fetch costumes
  const fetchCostumes = () => {
    setCostumeLoading(true);
    fetch('http://127.0.0.1:5000/api/costumes')
      .then(res => res.json())
      .then(data => setCostumes(Array.isArray(data) ? data : []))
      .catch(() => message.error('Gagal mengambil data kostum'))
      .finally(() => setCostumeLoading(false));
  };
  useEffect(() => { fetchCostumes(); }, []);

  // Tambah/Edit Costume
  const handleCostumeOk = () => {
    costumeForm.validateFields().then(values => {
      const method = costumeEdit ? 'PUT' : 'POST';
      const url = costumeEdit ? `http://127.0.0.1:5000/api/costumes/${costumeEdit.id}` : 'http://127.0.0.1:5000/api/costumes';
      fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      })
        .then(res => res.json())
        .then(() => {
          setCostumeModalOpen(false);
          setCostumeEdit(null);
          costumeForm.resetFields();
          fetchCostumes();
          message.success(costumeEdit ? 'Kostum diupdate' : 'Kostum ditambah');
        })
        .catch(() => message.error('Gagal simpan kostum'));
    });
  };
  // Hapus Costume
  const handleCostumeDelete = (id) => {
    fetch(`http://127.0.0.1:5000/api/costumes/${id}`, { method: 'DELETE' })
      .then(() => {
        fetchCostumes();
        message.success('Kostum dihapus');
      })
      .catch(() => message.error('Gagal hapus kostum'));
  };

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
      .catch(() => message.error('Gagal mengambil data size'))
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
          message.success(sizeEdit ? 'Ukuran diupdate' : 'Ukuran ditambah');
        })
        .catch(() => message.error('Gagal simpan ukuran'));
    });
  };
  // Hapus Size
  const handleSizeDelete = (id) => {
    fetch(`http://127.0.0.1:5000/api/sizes/${id}`, { method: 'DELETE' })
      .then(() => {
        fetchSizes();
        message.success('Ukuran dihapus');
      })
      .catch(() => message.error('Gagal hapus ukuran'));
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
      .catch(() => message.error('Gagal mengambil data user'))
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
          message.success(userEdit ? 'User diupdate' : 'User ditambah');
        })
        .catch(() => message.error('Gagal simpan user'));
    });
  };
  // Hapus User
  const handleUserDelete = (id) => {
    fetch(`http://127.0.0.1:5000/api/users/${id}`, { method: 'DELETE' })
      .then(() => {
        fetchUsers();
        message.success('User dihapus');
      })
      .catch(() => message.error('Gagal hapus user'));
  };

  // --- ORDER CRUD ---
  const [orders, setOrders] = useState([]);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [orderEdit, setOrderEdit] = useState(null);
  const [orderForm] = Form.useForm();

  // Fetch orders
  const fetchOrders = () => {
    setOrderLoading(true);
    fetch('http://127.0.0.1:5000/api/orders')
      .then(res => res.json())
      .then(data => setOrders(Array.isArray(data) ? data : []))
      .catch(() => message.error('Gagal mengambil data order'))
      .finally(() => setOrderLoading(false));
  };
  useEffect(() => { fetchOrders(); }, []);

  // Tambah/Edit Order
  const handleOrderOk = () => {
    orderForm.validateFields().then(values => {
      // Format tanggal
      if (values.rental_date) values.rental_date = dayjs(values.rental_date).format('YYYY-MM-DD');
      if (values.return_date) values.return_date = dayjs(values.return_date).format('YYYY-MM-DD');
      const method = orderEdit ? 'PUT' : 'POST';
      const url = orderEdit ? `http://127.0.0.1:5000/api/orders/${orderEdit.id}` : 'http://127.0.0.1:5000/api/orders';
      fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      })
        .then(res => res.json())
        .then(() => {
          setOrderModalOpen(false);
          setOrderEdit(null);
          orderForm.resetFields();
          fetchOrders();
          message.success(orderEdit ? 'Order diupdate' : 'Order ditambah');
        })
        .catch(() => message.error('Gagal simpan order'));
    });
  };
  // Hapus Order
  const handleOrderDelete = (id) => {
    fetch(`http://127.0.0.1:5000/api/orders/${id}`, { method: 'DELETE' })
      .then(() => {
        fetchOrders();
        message.success('Order dihapus');
      })
      .catch(() => message.error('Gagal hapus order'));
  };

  // --- PAYMENT CRUD ---
  const [payments, setPayments] = useState([]);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentEdit, setPaymentEdit] = useState(null);
  const [paymentForm] = Form.useForm();

  // Fetch payments
  const fetchPayments = () => {
    setPaymentLoading(true);
    fetch('http://127.0.0.1:5000/api/payments')
      .then(res => res.json())
      .then(data => setPayments(Array.isArray(data) ? data : []))
      .catch(() => message.error('Gagal mengambil data payment'))
      .finally(() => setPaymentLoading(false));
  };
  useEffect(() => { fetchPayments(); }, []);

  // Tambah/Edit Payment
  const handlePaymentOk = () => {
    paymentForm.validateFields().then(values => {
      if (values.payment_date) values.payment_date = dayjs(values.payment_date).format('YYYY-MM-DD');
      const method = paymentEdit ? 'PUT' : 'POST';
      const url = paymentEdit ? `http://127.0.0.1:5000/api/payments/${paymentEdit.id}` : 'http://127.0.0.1:5000/api/payments';
      fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      })
        .then(res => res.json())
        .then(() => {
          setPaymentModalOpen(false);
          setPaymentEdit(null);
          paymentForm.resetFields();
          fetchPayments();
          message.success(paymentEdit ? 'Payment diupdate' : 'Payment ditambah');
        })
        .catch(() => message.error('Gagal simpan payment'));
    });
  };
  // Hapus Payment
  const handlePaymentDelete = (id) => {
    fetch(`http://127.0.0.1:5000/api/payments/${id}`, { method: 'DELETE' })
      .then(() => {
        fetchPayments();
        message.success('Payment dihapus');
      })
      .catch(() => message.error('Gagal hapus payment'));
  };

  // --- ORDER ITEM CRUD ---
  const [orderItems, setOrderItems] = useState([]);
  const [orderItemLoading, setOrderItemLoading] = useState(false);
  const [orderItemModalOpen, setOrderItemModalOpen] = useState(false);
  const [orderItemEdit, setOrderItemEdit] = useState(null);
  const [orderItemForm] = Form.useForm();

  // Fetch order items
  const fetchOrderItems = () => {
    setOrderItemLoading(true);
    fetch('http://127.0.0.1:5000/api/order-items')
      .then(res => res.json())
      .then(data => setOrderItems(Array.isArray(data) ? data : []))
      .catch(() => message.error('Gagal mengambil data order item'))
      .finally(() => setOrderItemLoading(false));
  };
  useEffect(() => { fetchOrderItems(); }, []);

  // Tambah/Edit Order Item
  const handleOrderItemOk = () => {
    orderItemForm.validateFields().then(values => {
      const method = orderItemEdit ? 'PUT' : 'POST';
      const url = orderItemEdit ? `http://127.0.0.1:5000/api/order-items/${orderItemEdit.id}` : 'http://127.0.0.1:5000/api/order-items';
      fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      })
        .then(res => res.json())
        .then(() => {
          setOrderItemModalOpen(false);
          setOrderItemEdit(null);
          orderItemForm.resetFields();
          fetchOrderItems();
          message.success(orderItemEdit ? 'Order item diupdate' : 'Order item ditambah');
        })
        .catch(() => message.error('Gagal simpan order item'));
    });
  };
  // Hapus Order Item
  const handleOrderItemDelete = (id) => {
    fetch(`http://127.0.0.1:5000/api/order-items/${id}`, { method: 'DELETE' })
      .then(() => {
        fetchOrderItems();
        message.success('Order item dihapus');
      })
      .catch(() => message.error('Gagal hapus order item'));
  };

  // --- COSTUME SIZE CRUD ---
  const [costumeSizes, setCostumeSizes] = useState([]);
  const [costumeSizeLoading, setCostumeSizeLoading] = useState(false);
  const [costumeSizeModalOpen, setCostumeSizeModalOpen] = useState(false);
  const [costumeSizeEdit, setCostumeSizeEdit] = useState(null);
  const [costumeSizeForm] = Form.useForm();

  // Fetch costume sizes
  const fetchCostumeSizes = () => {
    setCostumeSizeLoading(true);
    fetch('http://127.0.0.1:5000/api/costume_sizes')
      .then(res => res.json())
      .then(data => setCostumeSizes(Array.isArray(data) ? data : []))
      .catch(() => message.error('Gagal mengambil data costume size'))
      .finally(() => setCostumeSizeLoading(false));
  };
  useEffect(() => { fetchCostumeSizes(); }, []);

  // Tambah/Edit Costume Size
  const handleCostumeSizeOk = () => {
    costumeSizeForm.validateFields().then(values => {
      const method = costumeSizeEdit ? 'PUT' : 'POST';
      const url = costumeSizeEdit ? `http://127.0.0.1:5000/api/costume_sizes/${costumeSizeEdit.id}` : 'http://127.0.0.1:5000/api/costume_sizes';
      fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      })
        .then(res => res.json())
        .then(() => {
          setCostumeSizeModalOpen(false);
          setCostumeSizeEdit(null);
          costumeSizeForm.resetFields();
          fetchCostumeSizes();
          message.success(costumeSizeEdit ? 'Costume size diupdate' : 'Costume size ditambah');
        })
        .catch(() => message.error('Gagal simpan costume size'));
    });
  };
  // Hapus Costume Size
  const handleCostumeSizeDelete = (id) => {
    fetch(`http://127.0.0.1:5000/api/costume_sizes/${id}`, { method: 'DELETE' })
      .then(() => {
        fetchCostumeSizes();
        message.success('Costume size dihapus');
      })
      .catch(() => message.error('Gagal hapus costume size'));
  };

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
      key: 'costume',
      label: 'Kostum',
      children: (
        <Card bordered={false} style={{ borderRadius: 15, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <Title level={4} style={{ margin: 0 }}>Data Kostum</Title>
            <Button icon={<PlusOutlined />} onClick={() => { setCostumeEdit(null); setCostumeModalOpen(true); }} className="admin-btn-red">Tambah</Button>
          </div>
          <Table
            dataSource={costumes}
            loading={costumeLoading}
            rowKey="id"
            columns={[
              { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
              { title: 'Nama Kostum', dataIndex: 'name', key: 'name' },
              { title: 'Kategori', dataIndex: 'category_id', key: 'category_id', render: (catId) => categories.find(c => c.id === catId)?.name || '-' },
              { title: 'Harga/Hari', dataIndex: 'price_per_day', key: 'price_per_day', render: v => v ? `Rp ${v.toLocaleString('id-ID')}` : '-' },
              { title: 'Stok', dataIndex: 'stock', key: 'stock' },
              { title: 'Status', dataIndex: 'status', key: 'status' },
              {
                title: 'Aksi',
                key: 'aksi',
                render: (_, rec) => (
                  <>
                    <Button icon={<EditOutlined />} size="small" style={{ marginRight: 8 }} onClick={() => { setCostumeEdit(rec); setCostumeModalOpen(true); costumeForm.setFieldsValue(rec); }} />
                    <Popconfirm title="Hapus kostum?" onConfirm={() => handleCostumeDelete(rec.id)} okText="Ya" cancelText="Batal">
                      <Button icon={<DeleteOutlined />} size="small" danger />
                    </Popconfirm>
                  </>
                )
              }
            ]}
          />
          <Drawer
            title={costumeEdit ? 'Edit Kostum' : 'Tambah Kostum'}
            open={costumeModalOpen}
            onClose={() => { setCostumeModalOpen(false); setCostumeEdit(null); costumeForm.resetFields(); }}
            width={500}
            footer={null}
          >
            <Form form={costumeForm} layout="vertical" onFinish={handleCostumeOk}>
              <Form.Item name="name" label="Nama Kostum" rules={[{ required: true, message: 'Nama kostum wajib diisi' }]}> 
                <Input />
              </Form.Item>
              <Form.Item name="category_id" label="Kategori" rules={[{ required: true, message: 'Kategori wajib dipilih' }]}> 
                <Select
                  placeholder="Pilih Kategori"
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {categories.map(cat => (
                    <Select.Option key={cat.id} value={cat.id}>{cat.name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="price_per_day" label="Harga per Hari" rules={[{ required: true, message: 'Harga wajib diisi' }]}> 
                <Input type="number" min={0} />
              </Form.Item>
              <Form.Item name="stock" label="Stok" rules={[{ required: true, message: 'Stok wajib diisi' }]}> 
                <Input type="number" min={0} />
              </Form.Item>
              <Form.Item name="status" label="Status" rules={[{ required: true, message: 'Status wajib diisi' }]}> 
                <Input />
              </Form.Item>
              <Form.Item name="description" label="Deskripsi"> 
                <Input.TextArea rows={3} />
              </Form.Item>
              <Form.Item name="image_url" label="URL Gambar"> 
                <Input />
              </Form.Item>
              <div style={{ textAlign: 'right' }}>
                <Button onClick={() => { setCostumeModalOpen(false); setCostumeEdit(null); costumeForm.resetFields(); }} style={{ marginRight: 8 }}>Batal</Button>
                <Button type="primary" htmlType="submit">{costumeEdit ? 'Update' : 'Tambah'}</Button>
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
    {
      key: 'order',
      label: 'Order',
      children: (
        <Card bordered={false} style={{ borderRadius: 15, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <Title level={4} style={{ margin: 0 }}>Data Order</Title>
            <Button icon={<PlusOutlined />} onClick={() => { setOrderEdit(null); setOrderModalOpen(true); }} className="admin-btn-red">Tambah</Button>
          </div>
          <Table
            dataSource={orders}
            loading={orderLoading}
            rowKey="id"
            columns={[
              { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
              { title: 'User', dataIndex: 'user_id', key: 'user_id', render: (uid) => users.find(u => u.id === uid)?.name || '-' },
              { title: 'Tanggal Sewa', dataIndex: 'rental_date', key: 'rental_date' },
              { title: 'Tanggal Kembali', dataIndex: 'return_date', key: 'return_date' },
              { title: 'Status', dataIndex: 'status', key: 'status' },
              { title: 'Payment Status', dataIndex: 'payment_status', key: 'payment_status' },
              { title: 'Total', dataIndex: 'total_price', key: 'total_price', render: v => v ? `Rp ${v.toLocaleString('id-ID')}` : '-' },
              {
                title: 'Aksi',
                key: 'aksi',
                render: (_, rec) => (
                  <>
                    <Button icon={<EditOutlined />} size="small" style={{ marginRight: 8 }} onClick={() => { setOrderEdit(rec); setOrderModalOpen(true); orderForm.setFieldsValue({ ...rec, rental_date: rec.rental_date ? dayjs(rec.rental_date) : null, return_date: rec.return_date ? dayjs(rec.return_date) : null }); }} />
                    <Popconfirm title="Hapus order?" onConfirm={() => handleOrderDelete(rec.id)} okText="Ya" cancelText="Batal">
                      <Button icon={<DeleteOutlined />} size="small" danger />
                    </Popconfirm>
                  </>
                )
              }
            ]}
          />
          <Drawer
            title={orderEdit ? 'Edit Order' : 'Tambah Order'}
            open={orderModalOpen}
            onClose={() => { setOrderModalOpen(false); setOrderEdit(null); orderForm.resetFields(); }}
            width={500}
            footer={null}
          >
            <Form form={orderForm} layout="vertical" onFinish={handleOrderOk}>
              <Form.Item name="user_id" label="User" rules={[{ required: true, message: 'User wajib dipilih' }]}> 
                <Select placeholder="Pilih User">
                  {users.map(u => (
                    <Select.Option key={u.id} value={u.id}>{u.name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="rental_date" label="Tanggal Sewa" rules={[{ required: true, message: 'Tanggal sewa wajib diisi' }]}> 
                <Input type="date" />
              </Form.Item>
              <Form.Item name="return_date" label="Tanggal Kembali" rules={[{ required: true, message: 'Tanggal kembali wajib diisi' }]}> 
                <Input type="date" />
              </Form.Item>
              <Form.Item name="status" label="Status" rules={[{ required: true, message: 'Status wajib diisi' }]}> 
                <Input />
              </Form.Item>
              <Form.Item name="payment_status" label="Payment Status" rules={[{ required: true, message: 'Payment status wajib diisi' }]}> 
                <Input />
              </Form.Item>
              <Form.Item name="address" label="Alamat"> 
                <Input.TextArea rows={2} />
              </Form.Item>
              <div style={{ textAlign: 'right' }}>
                <Button onClick={() => { setOrderModalOpen(false); setOrderEdit(null); orderForm.resetFields(); }} style={{ marginRight: 8 }}>Batal</Button>
                <Button type="primary" htmlType="submit">{orderEdit ? 'Update' : 'Tambah'}</Button>
              </div>
            </Form>
          </Drawer>
        </Card>
      )
    },
    {
      key: 'payment',
      label: 'Payment',
      children: (
        <Card bordered={false} style={{ borderRadius: 15, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <Title level={4} style={{ margin: 0 }}>Data Payment</Title>
            <Button icon={<PlusOutlined />} onClick={() => { setPaymentEdit(null); setPaymentModalOpen(true); }} className="admin-btn-red">Tambah</Button>
          </div>
          <Table
            dataSource={payments}
            loading={paymentLoading}
            rowKey="id"
            columns={[
              { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
              { title: 'Order', dataIndex: 'order_id', key: 'order_id', render: (oid) => orders.find(o => o.id === oid) ? `#${oid}` : '-' },
              { title: 'Metode', dataIndex: 'payment_method', key: 'payment_method' },
              { title: 'Status', dataIndex: 'status', key: 'status' },
              { title: 'Tgl Submit', dataIndex: 'submitted_at', key: 'submitted_at', render: v => v ? dayjs(v).format('YYYY-MM-DD HH:mm') : '-' },
              { title: 'Tgl Verifikasi', dataIndex: 'verified_at', key: 'verified_at', render: v => v ? dayjs(v).format('YYYY-MM-DD HH:mm') : '-' },
              {
                title: 'Aksi',
                key: 'aksi',
                render: (_, rec) => (
                  <>
                    <Button icon={<EditOutlined />} size="small" style={{ marginRight: 8 }} onClick={() => { setPaymentEdit(rec); setPaymentModalOpen(true); paymentForm.setFieldsValue(rec); }} />
                    <Popconfirm title="Hapus payment?" onConfirm={() => handlePaymentDelete(rec.id)} okText="Ya" cancelText="Batal">
                      <Button icon={<DeleteOutlined />} size="small" danger />
                    </Popconfirm>
                  </>
                )
              }
            ]}
          />
          <Drawer
            title={paymentEdit ? 'Edit Payment' : 'Tambah Payment'}
            open={paymentModalOpen}
            onClose={() => { setPaymentModalOpen(false); setPaymentEdit(null); paymentForm.resetFields(); }}
            width={500}
            footer={null}
          >
            <Form form={paymentForm} layout="vertical" onFinish={handlePaymentOk} encType="multipart/form-data">
              <Form.Item name="order_id" label="Order" rules={[{ required: true, message: 'Order wajib dipilih' }]}> 
                <Select placeholder="Pilih Order">
                  {orders.map(o => (
                    <Select.Option key={o.id} value={o.id}>{`#${o.id} - ${users.find(u => u.id === o.user_id)?.name || ''}`}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="payment_method" label="Metode" rules={[{ required: true, message: 'Metode wajib diisi' }]}> 
                <Input />
              </Form.Item>
              <Form.Item name="status" label="Status" rules={[{ required: true, message: 'Status wajib diisi' }]}> 
                <Input />
              </Form.Item>
              {paymentEdit && (
                <>
                  <Form.Item name="submitted_at" label="Tgl Submit">
                    <Input value={paymentEdit.submitted_at ? dayjs(paymentEdit.submitted_at).format('YYYY-MM-DD HH:mm') : '-'} disabled />
                  </Form.Item>
                  <Form.Item name="verified_at" label="Tgl Verifikasi">
                    <Input value={paymentEdit.verified_at ? dayjs(paymentEdit.verified_at).format('YYYY-MM-DD HH:mm') : '-'} disabled />
                  </Form.Item>
                </>
              )}
              <div style={{ textAlign: 'right' }}>
                <Button onClick={() => { setPaymentModalOpen(false); setPaymentEdit(null); paymentForm.resetFields(); }} style={{ marginRight: 8 }}>Batal</Button>
                <Button type="primary" htmlType="submit">{paymentEdit ? 'Update' : 'Tambah'}</Button>
              </div>
            </Form>
          </Drawer>
        </Card>
      )
    },
    {
      key: 'order_item',
      label: 'Order Item',
      children: (
        <Card bordered={false} style={{ borderRadius: 15, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <Title level={4} style={{ margin: 0 }}>Data Order Item</Title>
            <Button icon={<PlusOutlined />} onClick={() => { setOrderItemEdit(null); setOrderItemModalOpen(true); }} className="admin-btn-red">Tambah</Button>
          </div>
          <Table
            dataSource={orderItems}
            loading={orderItemLoading}
            rowKey="id"
            columns={[
              { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
              { title: 'Order', dataIndex: 'order_id', key: 'order_id', render: (oid) => orders.find(o => o.id === oid) ? `#${oid}` : '-' },
              { title: 'Kostum', dataIndex: 'costume_id', key: 'costume_id', render: (cid) => costumes.find(c => c.id === cid)?.name || '-' },
              { title: 'Jumlah', dataIndex: 'quantity', key: 'quantity' },
              { title: 'Harga', dataIndex: 'price', key: 'price', render: v => v ? `Rp ${v.toLocaleString('id-ID')}` : '-' },
              {
                title: 'Aksi',
                key: 'aksi',
                render: (_, rec) => (
                  <>
                    <Button icon={<EditOutlined />} size="small" style={{ marginRight: 8 }} onClick={() => { setOrderItemEdit(rec); setOrderItemModalOpen(true); orderItemForm.setFieldsValue(rec); }} />
                    <Popconfirm title="Hapus order item?" onConfirm={() => handleOrderItemDelete(rec.id)} okText="Ya" cancelText="Batal">
                      <Button icon={<DeleteOutlined />} size="small" danger />
                    </Popconfirm>
                  </>
                )
              }
            ]}
          />
          <Drawer
            title={orderItemEdit ? 'Edit Order Item' : 'Tambah Order Item'}
            open={orderItemModalOpen}
            onClose={() => { setOrderItemModalOpen(false); setOrderItemEdit(null); orderItemForm.resetFields(); }}
            width={500}
            footer={null}
          >
            <Form form={orderItemForm} layout="vertical" onFinish={handleOrderItemOk}>
              <Form.Item name="order_id" label="Order" rules={[{ required: true, message: 'Order wajib dipilih' }]}> 
                <Select placeholder="Pilih Order">
                  {orders.map(o => (
                    <Select.Option key={o.id} value={o.id}>{`#${o.id} - ${users.find(u => u.id === o.user_id)?.name || ''}`}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="costume_id" label="Kostum" rules={[{ required: true, message: 'Kostum wajib dipilih' }]}> 
                <Select placeholder="Pilih Kostum">
                  {costumes.map(c => (
                    <Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="quantity" label="Jumlah" rules={[{ required: true, message: 'Jumlah wajib diisi' }]}> 
                <Input type="number" min={1} />
              </Form.Item>
              <Form.Item name="price" label="Harga" rules={[{ required: true, message: 'Harga wajib diisi' }]}> 
                <Input type="number" min={0} />
              </Form.Item>
              <div style={{ textAlign: 'right' }}>
                <Button onClick={() => { setOrderItemModalOpen(false); setOrderItemEdit(null); orderItemForm.resetFields(); }} style={{ marginRight: 8 }}>Batal</Button>
                <Button type="primary" htmlType="submit">{orderItemEdit ? 'Update' : 'Tambah'}</Button>
              </div>
            </Form>
          </Drawer>
        </Card>
      )
    },
    {
      key: 'costume_size',
      label: 'Costume Size',
      children: (
        <Card bordered={false} style={{ borderRadius: 15, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <Title level={4} style={{ margin: 0 }}>Data Costume Size</Title>
            <Button icon={<PlusOutlined />} onClick={() => { setCostumeSizeEdit(null); setCostumeSizeModalOpen(true); }} className="admin-btn-red">Tambah</Button>
          </div>
          <Table
            dataSource={costumeSizes}
            loading={costumeSizeLoading}
            rowKey="id"
            columns={[
              { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
              { title: 'Kostum', dataIndex: 'costume_id', key: 'costume_id', render: (cid) => costumes.find(c => c.id === cid)?.name || '-' },
              { title: 'Ukuran', dataIndex: 'size_id', key: 'size_id', render: (sid) => sizes.find(s => s.id === sid)?.name || '-' },
              { title: 'Stok', dataIndex: 'stock', key: 'stock' },
              {
                title: 'Aksi',
                key: 'aksi',
                render: (_, rec) => (
                  <>
                    <Button icon={<EditOutlined />} size="small" style={{ marginRight: 8 }} onClick={() => { setCostumeSizeEdit(rec); setCostumeSizeModalOpen(true); costumeSizeForm.setFieldsValue(rec); }} />
                    <Popconfirm title="Hapus costume size?" onConfirm={() => handleCostumeSizeDelete(rec.id)} okText="Ya" cancelText="Batal">
                      <Button icon={<DeleteOutlined />} size="small" danger />
                    </Popconfirm>
                  </>
                )
              }
            ]}
          />
          <Drawer
            title={costumeSizeEdit ? 'Edit Costume Size' : 'Tambah Costume Size'}
            open={costumeSizeModalOpen}
            onClose={() => { setCostumeSizeModalOpen(false); setCostumeSizeEdit(null); costumeSizeForm.resetFields(); }}
            width={500}
            footer={null}
          >
            <Form form={costumeSizeForm} layout="vertical" onFinish={handleCostumeSizeOk}>
              <Form.Item name="costume_id" label="Kostum" rules={[{ required: true, message: 'Kostum wajib dipilih' }]}> 
                <Select placeholder="Pilih Kostum">
                  {costumes.map(c => (
                    <Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="size_id" label="Ukuran" rules={[{ required: true, message: 'Ukuran wajib dipilih' }]}> 
                <Select placeholder="Pilih Ukuran">
                  {sizes.map(s => (
                    <Select.Option key={s.id} value={s.id}>{s.name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="stock" label="Stok" rules={[{ required: true, message: 'Stok wajib diisi' }]}> 
                <Input type="number" min={0} />
              </Form.Item>
              <div style={{ textAlign: 'right' }}>
                <Button onClick={() => { setCostumeSizeModalOpen(false); setCostumeSizeEdit(null); costumeSizeForm.resetFields(); }} style={{ marginRight: 8 }}>Batal</Button>
                <Button type="primary" htmlType="submit">{costumeSizeEdit ? 'Update' : 'Tambah'}</Button>
              </div>
            </Form>
          </Drawer>
        </Card>
      )
    },
    // Tab lain (Costume, Size, User, Order, Payment, Order Item, Costume Size) bisa diduplikasi dari sini
  ];

  // Hitung total uang masuk dari payment yang statusnya 'paid' atau 'verified'
  const totalUangMasuk = payments
    .filter(p => p.status === 'paid' || p.status === 'verified')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
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
            <Statistic title="Uang Masuk" value={totalUangMasuk} prefix={<DollarOutlined style={{ color: '#a7374a' }} />} precision={0} suffix="Rp" valueStyle={{ color: '#a7374a' }} />
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
  );
};

export default AdminDashboard; 