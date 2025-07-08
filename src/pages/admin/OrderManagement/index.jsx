import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../providers/AuthProvider";
import { getDataPrivate, editDataPrivatePut, returnOrderPrivate } from "../../../utils/api";
import { 
  Card, 
  Row, 
  Col, 
  Tag, 
  Typography, 
  Space, 
  Button, 
  Table, 
  Select, 
  Input, 
  DatePicker, 
  Modal, 
  message,
  Badge,
  Descriptions,
  Divider,
  Statistic
} from "antd";
import { 
  SearchOutlined, 
  FilterOutlined, 
  EyeOutlined, 
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  UserOutlined,
  CalendarOutlined
} from "@ant-design/icons";
import './OrderManagement.css';

const { Text, Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const statusColor = {
  unpaid: "red",
  paid: "green",
  pending: "gold",
  completed: "blue",
  cancelled: "default",
  processing: "orange",
  waiting_verification: "orange"
};

const orderStatusColor = {
  pending: "gold",
  confirmed: "blue",
  processing: "orange",
  completed: "green",
  cancelled: "red"
};

const OrderManagementPage = () => {
  const { userProfile } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    paymentStatus: "",
    search: "",
    dateRange: null
  });
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    paid: 0,
    completed: 0,
    cancelled: 0,
    returned: 0
  });

  // Tambah state untuk modal pengembalian dan damage
  const [returnModalVisible, setReturnModalVisible] = useState(false);
  const [returningOrderId, setReturningOrderId] = useState(null);
  const [damageLevel, setDamageLevel] = useState('none');
  const [returnLoading, setReturnLoading] = useState(false);

  useEffect(() => {
    if (userProfile?.role === "admin") {
      fetchOrders();
    }
  }, [userProfile]);

  useEffect(() => {
    applyFilters();
  }, [orders, filters]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getDataPrivate("/api/orders");
      console.log("All orders:", data);
      setOrders(data);
      
      // Calculate statistics
      const statsData = {
        total: data.length,
        pending: data.filter(order => order.status === "pending").length,
        paid: data.filter(order => order.payment_status === "paid").length,
        completed: data.filter(order => order.status === "completed").length,
        cancelled: data.filter(order => order.status === "cancelled").length,
        returned: data.filter(order => order.status === "returned").length
      };
      setStats(statsData);
    } catch (error) {
      console.error("Error fetching orders:", error);
      message.error("Gagal memuat data pesanan");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...orders];

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(order => order.status === filters.status);
    }

    // Payment status filter
    if (filters.paymentStatus) {
      filtered = filtered.filter(order => order.payment_status === filters.paymentStatus);
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(order => 
        order.id.toString().includes(searchLower) ||
        order.user_name?.toLowerCase().includes(searchLower) ||
        order.address?.toLowerCase().includes(searchLower) ||
        order.order_items?.some(item => 
          item.costume_name?.toLowerCase().includes(searchLower)
        )
      );
    }

    // Date range filter
    if (filters.dateRange && filters.dateRange.length === 2) {
      const [startDate, endDate] = filters.dateRange;
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.created_at);
        return orderDate >= startDate.startOf('day').toDate() && 
               orderDate <= endDate.endOf('day').toDate();
      });
    }

    setFilteredOrders(filtered);
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await editDataPrivatePut(`/api/orders/${orderId}/status`, {
        status: newStatus
      });
      message.success(`Status pesanan berhasil diubah menjadi ${newStatus}`);
      fetchOrders(); // Refresh data
    } catch (error) {
      console.error("Error updating order status:", error);
      message.error("Gagal mengubah status pesanan");
    }
  };

  const handlePaymentStatusUpdate = async (orderId, newPaymentStatus) => {
    try {
      await editDataPrivatePut(`/api/orders/${orderId}/payment-status`, {
        payment_status: newPaymentStatus
      });
      message.success(`Status pembayaran berhasil diubah menjadi ${newPaymentStatus}`);
      fetchOrders(); // Refresh data
    } catch (error) {
      console.error("Error updating payment status:", error);
      message.error("Gagal mengubah status pembayaran");
    }
  };

  const handleReturnOrder = (orderId) => {
    setReturningOrderId(orderId);
    setDamageLevel('none');
    setReturnModalVisible(true);
  };

  const confirmReturnOrder = async () => {
    setReturnLoading(true);
    try {
      const res = await returnOrderPrivate(returningOrderId, { damage_level: damageLevel });
      if (res && res.message) {
        message.success(res.message);
        fetchOrders();
      } else {
        message.error(res?.error || 'Gagal mengembalikan pesanan');
      }
    } catch (err) {
      message.error('Gagal mengembalikan pesanan');
    } finally {
      setReturnModalVisible(false);
      setReturnLoading(false);
      setReturningOrderId(null);
    }
  };

  // Auto refresh every 30 seconds for admin to see real-time updates
  useEffect(() => {
    if (userProfile?.role === "admin") {
      const interval = setInterval(() => {
        fetchOrders();
      }, 30000); // Refresh every 30 seconds

      return () => clearInterval(interval);
    }
  }, [userProfile?.role]);

  const showOrderDetail = (order) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  const columns = [
    {
      title: 'ID Pesanan',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      render: (id) => <Text strong>#{id}</Text>
    },
    {
      title: 'Pelanggan',
      dataIndex: 'user_name',
      key: 'user_name',
      render: (name, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{name || 'Tidak Ada'}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.user_email || 'Tidak Ada'}
          </Text>
        </Space>
      )
    },
    {
      title: 'Item',
      dataIndex: 'order_items',
      key: 'order_items',
      render: (items) => (
        <div>
          {items?.map((item, index) => (
            <div key={index} style={{ marginBottom: 4 }}>
              <Text>{item.costume_name} ({item.quantity}x)</Text>
            </div>
          ))}
        </div>
      )
    },
    {
      title: 'Total',
      dataIndex: 'total_price',
      key: 'total_price',
      render: (price) => (
        <Text strong style={{ color: '#1890ff' }}>
          Rp {price?.toLocaleString()}
        </Text>
      )
    },
    {
      title: 'Status Pesanan',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={orderStatusColor[status] || "default"}>
          {status === 'pending' ? 'Menunggu Konfirmasi' :
           status === 'confirmed' ? 'Terkonfirmasi' :
           status === 'processing' ? 'Diproses' :
           status === 'completed' ? 'Selesai' :
           status === 'cancelled' ? 'Dibatalkan' :
           status === 'returned' ? 'Dikembalikan' :
           status?.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Status Pembayaran',
      dataIndex: 'payment_status',
      key: 'payment_status',
      render: (paymentStatus) => (
        <Tag color={statusColor[paymentStatus] || "default"}>
          {paymentStatus === 'pending' ? 'MENUNGGU VERIFIKASI' : 
           paymentStatus === 'paid' ? 'SUDAH DIBAYAR' : 
           paymentStatus === 'unpaid' ? 'BELUM DIBAYAR' : 
           paymentStatus?.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Tanggal Sewa',
      dataIndex: 'rental_date',
      key: 'rental_date',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text>Dari: {record.rental_date}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Sampai: {record.return_date}
          </Text>
        </Space>
      )
    },
    {
      title: 'Keterlambatan',
      key: 'late',
      render: (_, record) => (
        record.status === 'returned' ? (
          record.is_late ? (
            <Tag color="red">
              Telat {record.late_days} hari
              <br />Sisa Denda: Rp {Math.max(0, (record.late_fee || 0) - 300000).toLocaleString()}
            </Tag>
          ) : (
            <Tag color="green">Tepat Waktu</Tag>
          )
        ) : (
          <Tag color="default">-</Tag>
        )
      )
    },
    {
      title: 'Deposit Dikembalikan',
      dataIndex: 'deposit_returned',
      key: 'deposit_returned',
      render: (deposit_returned) => (
        <Text style={{ color: '#722ed1' }}>
          Rp {deposit_returned?.toLocaleString()}
        </Text>
      )
    },
    {
      title: 'Kerusakan',
      key: 'damage_level',
      render: (_, record) => (
        <Text style={{ color: '#faad14' }}>
          {record.damage_level === 'none' ? 'Tidak Ada' : record.damage_level}
        </Text>
      )
    },
    {
      title: 'Aksi',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            style={{ backgroundColor: '#a7374a', borderColor: '#a7374a', color: '#fff' }}
            icon={<EyeOutlined />} 
            size="small"
            onClick={() => showOrderDetail(record)}
          >
            Detail
          </Button>
          {record.status !== 'returned' && (
            <>
              <Select
                size="small"
                style={{ minWidth: 150, width: 'auto' }}
                placeholder="Status"
                value={record.status}
                onChange={(value) => handleStatusUpdate(record.id, value)}
              >
                <Option value="pending">Menunggu Konfirmasi</Option>
                <Option value="confirmed" disabled={record.payment_status !== 'paid'}>Terkonfirmasi</Option>
                <Option value="processing" disabled={record.payment_status !== 'paid'}>Diproses</Option>
                <Option value="completed" disabled={record.payment_status !== 'paid'}>Selesai</Option>
                <Option value="cancelled">Dibatalkan</Option>
              </Select>
              <Select
                size="small"
                style={{ minWidth: 150, width: 'auto' }}
                placeholder="Pembayaran"
                value={record.payment_status}
                onChange={(value) => handlePaymentStatusUpdate(record.id, value)}
              >
                <Option value="unpaid">Belum Dibayar</Option>
                <Option value="paid">Sudah Dibayar</Option>
                <Option value="pending">Menunggu Verifikasi</Option>
              </Select>
              {record.status !== 'returned' && record.status === 'completed' && (
                <Button
                  type="default"
                  size="small"
                  onClick={() => handleReturnOrder(record.id)}
                >
                  Kembalikan
                </Button>
              )}
            </>
          )}
        </Space>
      )
    }
  ];

  if (userProfile?.role !== "admin") {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Title level={3}>Akses Ditolak</Title>
        <Text>Anda tidak memiliki akses ke halaman ini.</Text>
      </div>
    );
  }

  return (
    <div className="order-management-page" style={{
      width: '100%',
      padding: '24px 0',
      minHeight: '80vh',
      boxSizing: 'border-box',
      position: 'relative',
      background: 'transparent'
    }}>
      <div style={{ margin: '0 auto', width: '100%', maxWidth: '100%', padding: '0 16px' }}>
        <div style={{ marginBottom: 24 }}>
          <Title level={2} style={{ color: '#a7374a' }}>Manajemen Pesanan</Title>
        </div>

        {/* Statistics Cards */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={4}>
            <Card>
              <Statistic
                title="Total Pesanan"
                value={stats.total}
                prefix={<DollarOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Card>
              <Statistic
                title="Pending"
                value={stats.pending}
                valueStyle={{ color: '#faad14' }}
                prefix={<ClockCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Card>
              <Statistic
                title="Sudah Bayar"
                value={stats.paid}
                valueStyle={{ color: '#52c41a' }}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Card>
              <Statistic
                title="Selesai"
                value={stats.completed}
                valueStyle={{ color: '#1890ff' }}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Card>
              <Statistic
                title="Dibatalkan"
                value={stats.cancelled}
                valueStyle={{ color: '#ff4d4f' }}
                prefix={<CloseCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Card>
              <Statistic
                title="Kostum Dikembalikan"
                value={stats.returned}
                valueStyle={{ color: '#722ed1' }}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
        </Row>

        {/* Filters */}
        <Card style={{ marginBottom: 24 }}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={6}>
              <Input
                placeholder="Cari pesanan..."
                prefix={<SearchOutlined />}
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Select
                placeholder="Status Pesanan"
                style={{ width: '100%' }}
                value={filters.status}
                onChange={(value) => setFilters({ ...filters, status: value })}
                allowClear
              >
                <Option value="pending">Menunggu Konfirmasi</Option>
                <Option value="confirmed">Terkonfirmasi</Option>
                <Option value="processing">Diproses</Option>
                <Option value="completed">Selesai</Option>
                <Option value="cancelled">Dibatalkan</Option>
                <Option value="returned">Dikembalikan</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Select
                placeholder="Status Pembayaran"
                style={{ width: '100%' }}
                value={filters.paymentStatus}
                onChange={(value) => setFilters({ ...filters, paymentStatus: value })}
                allowClear
              >
                <Option value="unpaid">Belum Dibayar</Option>
                <Option value="paid">Sudah Dibayar</Option>
                <Option value="pending">Menunggu Verifikasi</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <RangePicker
                style={{ width: '100%' }}
                placeholder={['Tanggal Mulai', 'Tanggal Akhir']}
                value={filters.dateRange}
                onChange={(dates) => setFilters({ ...filters, dateRange: dates })}
              />
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Button 
                style={{ backgroundColor: '#a7374a', borderColor: '#a7374a', color: '#fff' }}
                icon={<FilterOutlined />}
                onClick={() => setFilters({ status: "", paymentStatus: "", search: "", dateRange: null })}
              >
                Reset Filter
              </Button>
            </Col>
          </Row>
        </Card>

        {/* Orders Table */}
        <Card>
          <Table
            columns={columns}
            dataSource={filteredOrders}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} dari ${total} pesanan`
            }}
            scroll={{ x: 1200 }}
          />
        </Card>

        {/* Order Detail Modal */}
        <Modal
          title={`Detail Pesanan #${selectedOrder?.id}`}
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          width={900}
          style={{ maxWidth: '98vw', top: 40 }}
        >
          {selectedOrder && (
            <div>
              <Descriptions title="Informasi Pesanan" bordered column={3}>
                <Descriptions.Item label="ID Pesanan">
                  <Text strong>#{selectedOrder.id}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Tanggal Pesanan">
                  {new Date(selectedOrder.created_at).toLocaleDateString('id-ID')}
                </Descriptions.Item>
                <Descriptions.Item label="Status Pesanan">
                  <Tag color={orderStatusColor[selectedOrder.status]}>
                    {selectedOrder.status === 'pending' ? 'Menunggu Konfirmasi' :
                     selectedOrder.status === 'confirmed' ? 'Terkonfirmasi' :
                     selectedOrder.status === 'processing' ? 'Diproses' :
                     selectedOrder.status === 'completed' ? 'Selesai' :
                     selectedOrder.status === 'cancelled' ? 'Dibatalkan' :
                     selectedOrder.status === 'returned' ? 'Dikembalikan' :
                     selectedOrder.status?.toUpperCase()}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Status Pembayaran">
                  <Tag color={statusColor[selectedOrder.payment_status]}>
                    {selectedOrder.payment_status === 'pending' ? 'MENUNGGU VERIFIKASI' :
                     selectedOrder.payment_status === 'paid' ? 'SUDAH DIBAYAR' :
                     selectedOrder.payment_status === 'unpaid' ? 'BELUM DIBAYAR' :
                     selectedOrder.payment_status?.toUpperCase()}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Total Harga" span={3}>
                  <Text strong style={{ fontSize: 18, color: '#1890ff' }}>
                    Rp {selectedOrder.total_price?.toLocaleString()}
                  </Text>
                </Descriptions.Item>
              </Descriptions>

              <Divider />

              <Descriptions title="Informasi Pelanggan" bordered column={3}>
                <Descriptions.Item label="Nama">
                  {selectedOrder.user_name || 'Tidak Ada'}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {selectedOrder.user_email || 'Tidak Ada'}
                </Descriptions.Item>
                <Descriptions.Item label="Alamat" span={3}>
                  {selectedOrder.address || 'Tidak Ada'}
                </Descriptions.Item>
              </Descriptions>

              <Divider />

              <Descriptions title="Detail Sewa" bordered column={3}>
                <Descriptions.Item label="Tanggal Sewa">
                  {selectedOrder.rental_date}
                </Descriptions.Item>
                <Descriptions.Item label="Tanggal Kembali">
                  {selectedOrder.return_date}
                </Descriptions.Item>
                <Descriptions.Item label="Metode Pembayaran">
                  {selectedOrder.payment_method?.toUpperCase() || 'Tidak Ada'}
                </Descriptions.Item>
              </Descriptions>

              <Divider />

              {/* Bukti Pembayaran */}
              {selectedOrder?.payment && selectedOrder.payment.proof_image && (
                <div style={{ marginBottom: 24 }}>
                  <Title level={5}>Bukti Pembayaran</Title>
                  <Button
                    style={{ backgroundColor: '#a7374a', borderColor: '#a7374a', color: '#fff' }}
                    onClick={() => {
                      // Coba static folder dulu, jika gagal pakai route khusus, jika gagal pakai base64
                      const staticUrl = `${import.meta.env.VITE_REACT_APP_API_URL}/${selectedOrder.payment.proof_image}`;
                      const routeUrl = `${import.meta.env.VITE_REACT_APP_API_URL}/api/payment-proof/${selectedOrder.payment.proof_image.split('/').pop()}`;
                      const base64Url = `${import.meta.env.VITE_REACT_APP_API_URL}/api/payment-proof-base64/${selectedOrder.payment.proof_image.split('/').pop()}`;
                      
                      // Coba static URL dulu
                      fetch(staticUrl, { method: 'HEAD' })
                        .then(response => {
                          if (response.ok) {
                            setImageUrl(staticUrl);
                            setShowImageModal(true);
                          } else {
                            // Jika static gagal, coba route khusus
                            return fetch(routeUrl, { method: 'HEAD' });
                          }
                        })
                        .then(response => {
                          if (response && response.ok) {
                            setImageUrl(routeUrl);
                            setShowImageModal(true);
                          } else {
                            // Jika route khusus gagal, pakai base64
                            return fetch(base64Url);
                          }
                        })
                        .then(response => {
                          if (response && response.ok) {
                            return response.json();
                          } else {
                            throw new Error('All methods failed');
                          }
                        })
                        .then(data => {
                          if (data && data.data) {
                            // Base64 image
                            setImageUrl(`data:${data.mime_type};base64,${data.data}`);
                            setShowImageModal(true);
                          }
                        })
                        .catch(() => {
                          // Jika semua gagal, pakai base64 sebagai fallback
                          fetch(base64Url)
                            .then(response => response.json())
                            .then(data => {
                              if (data && data.data) {
                                setImageUrl(`data:${data.mime_type};base64,${data.data}`);
                                setShowImageModal(true);
                              }
                            })
                            .catch(() => {
                              message.error('Gagal memuat gambar bukti pembayaran');
                            });
                        });
                    }}
                    type="primary"
                  >
                    Lihat Gambar
                  </Button>
                </div>
              )}

              <div>
                <Title level={4}>Item Pesanan</Title>
                {selectedOrder.order_items?.map((item, index) => (
                  <Card key={index} style={{ marginBottom: 16 }}>
                    <Row gutter={16}>
                      <Col span={8}>
                        <Text strong>Nama Kostum:</Text>
                        <br />
                        {item.costume_name}
                      </Col>
                      <Col span={4}>
                        <Text strong>Ukuran:</Text>
                        <br />
                        {item.size_name}
                      </Col>
                      <Col span={4}>
                        <Text strong>Jumlah:</Text>
                        <br />
                        {item.quantity}
                      </Col>
                      <Col span={4}>
                        <Text strong>Harga Satuan:</Text>
                        <br />
                        Rp {item.price_snapshot?.toLocaleString()}
                      </Col>
                      <Col span={4}>
                        <Text strong>Total:</Text>
                        <br />
                        <Text style={{ color: '#1890ff' }}>
                          Rp {item.total_price?.toLocaleString()}
                        </Text>
                      </Col>
                    </Row>
                  </Card>
                ))}
              </div>

              <Divider />

              <div style={{ textAlign: 'center' }}>
                <Space>
                  <Select
                    placeholder="Update Status Pesanan"
                    value={selectedOrder.status}
                    onChange={(value) => {
                      handleStatusUpdate(selectedOrder.id, value);
                      setIsModalVisible(false);
                    }}
                    style={{ minWidth: 150, width: 'auto' }}
                  >
                    <Option value="pending">Menunggu Konfirmasi</Option>
                    <Option value="confirmed" disabled={selectedOrder.payment_status !== 'paid'}>Terkonfirmasi</Option>
                    <Option value="processing" disabled={selectedOrder.payment_status !== 'paid'}>Diproses</Option>
                    <Option value="completed" disabled={selectedOrder.payment_status !== 'paid'}>Selesai</Option>
                    <Option value="cancelled">Dibatalkan</Option>
                  </Select>
                  <Select
                    placeholder="Update Status Pembayaran"
                    value={selectedOrder.payment_status}
                    onChange={(value) => {
                      handlePaymentStatusUpdate(selectedOrder.id, value);
                      setIsModalVisible(false);
                    }}
                    style={{ minWidth: 150, width: 'auto' }}
                  >
                    <Option value="unpaid">Belum Dibayar</Option>
                    <Option value="paid">Sudah Dibayar</Option>
                    <Option value="pending">Menunggu Verifikasi</Option>
                  </Select>
                </Space>
              </div>

              <Divider />

              <Descriptions title="Keterlambatan" bordered column={3}>
                <Descriptions.Item label="Status">
                  {selectedOrder.is_late ? (
                    <Tag color="red">Telat</Tag>
                  ) : (
                    <Tag color="green">Tepat Waktu</Tag>
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Jumlah Hari">
                  {selectedOrder.late_days}
                </Descriptions.Item>
                <Descriptions.Item label="Sisa Denda">
                  Rp {Math.max(0, (selectedOrder.late_fee || 0) - 300000).toLocaleString()}
                </Descriptions.Item>
              </Descriptions>

              <Divider />

              <Descriptions title="Deposit" bordered column={3}>
                <Descriptions.Item label="Deposit Awal">
                  Rp {selectedOrder.deposit?.toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label="Deposit Dikembalikan">
                  Rp {selectedOrder.deposit_returned?.toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label="Kerusakan">
                  {selectedOrder.damage_level === 'none' ? 'Tidak Ada' : selectedOrder.damage_level}
                </Descriptions.Item>
              </Descriptions>

              <Divider />
            </div>
          )}
        </Modal>

        {/* Tambahkan modal untuk gambar bukti pembayaran */}
        <Modal
          open={showImageModal}
          onCancel={() => setShowImageModal(false)}
          footer={null}
          title="Bukti Pembayaran"
          centered
        >
          <img
            src={imageUrl}
            alt="Bukti Pembayaran"
            style={{ width: "100%", maxWidth: 500, borderRadius: 8, border: "1px solid #eee" }}
          />
        </Modal>

        {/* Tambahkan modal konfirmasi pengembalian */}
        <Modal
          open={returnModalVisible}
          onCancel={() => setReturnModalVisible(false)}
          onOk={confirmReturnOrder}
          confirmLoading={returnLoading}
          title="Konfirmasi Pengembalian Kostum"
          okText="Kembalikan"
          cancelText="Batal"
          centered
        >
          <div>
            <p>Pilih tingkat kerusakan kostum:</p>
            <Select value={damageLevel} onChange={setDamageLevel} style={{ width: 200 }}>
              <Option value="none">Tidak Ada</Option>
              <Option value="minim">Minim (Potong 10%)</Option>
              <Option value="sedang">Sedang (Potong 50%)</Option>
              <Option value="berat">Berat (Potong 100%)</Option>
            </Select>
            <div style={{ marginTop: 16 }}>
              <b>Catatan:</b> Deposit akan dipotong jika ada keterlambatan atau kerusakan.
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default OrderManagementPage; 