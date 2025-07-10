import React, { useEffect, useState, useContext } from 'react';
import { Row, Col, Card, Button, Typography, Spin, Rate, Tabs, Avatar, Input, Form, notification, message, ConfigProvider, Modal, Drawer, Space, DatePicker, Select } from 'antd';
import { StarOutlined, ThunderboltOutlined, SmileOutlined, GiftOutlined, SyncOutlined, InfoCircleOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../providers/AuthProvider';
import { getData, sendData } from '../../utils/api';
import dayjs from 'dayjs';
import './Home.css';

const { Title, Text } = Typography;
const { Search } = Input;

const DUMMY_REVIEWS = [
  { name: 'Jason Bouwy', rating: 5, comment: 'Koleksi di Rentique sangat bagus dan pengiriman cepat!' },
  { name: 'Mike Duntson', rating: 5, comment: 'Pelayanan ramah, koleksi sesuai deskripsi.' },
  { name: 'Lea Miston', rating: 5, comment: 'Sangat puas, akan sewa lagi di Rentique.' }
];

const FILTER_TABS = [
  { key: 'featured', label: 'Featured' },
  { key: 'bestseller', label: 'Top Sellers' },
  { key: 'topreview', label: 'Top Review' }
];

const HERO_IMAGE = 'https://pngimg.com/d/dress_PNG148.png'; // Gambar statis

const Home = () => {
  const [costumes, setCostumes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('featured');
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedCostume, setSelectedCostume] = useState(null);
  const [open, setOpen] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [Pemesanan] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  const [selectedSize, setSelectedSize] = useState("");
  
  const { isLoggedIn, userProfile } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [costumeData, categoryData] = await Promise.all([
          getData('/api/costumes'),
          getData('/api/categories')
        ]);
        setCostumes(Array.isArray(costumeData) ? costumeData : []);
        setCategories(Array.isArray(categoryData) ? categoryData : []);
      } catch (err) {
        setCostumes([]);
        setCategories([]);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleDetail = (costume) => {
    setSelectedDetail(costume);
    setDetailVisible(true);
  };
  
  const closeDetail = () => {
    setDetailVisible(false);
    setSelectedDetail(null);
  };

  const showDrawer = (costume) => {
    setSelectedCostume(costume);
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
    setSelectedCostume(null);
    setSelectedSize("");
    Pemesanan.resetFields();
  };

  const handleCheckoutClick = (costume) => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      showDrawer(costume);
    }
  };

  const rental_date = Form.useWatch("rental_date", Pemesanan);
  const return_date = Form.useWatch("return_date", Pemesanan);
  const quantity = Form.useWatch("quantity", Pemesanan);

  // Tidak boleh memilih tanggal sebelum hari ini
  const disablePastDates = (current) => {
     return current && current < dayjs().startOf("day"); // Aktifkan ini untuk membatasi tanggal sebelum hari ini
   // return false; // Nonaktifkan pembatasan, semua tanggal bisa dipilih
  };

  // Tidak boleh memilih tanggal yang sama atau sebelum tanggal sewa
  const disableReturnDates = (current) => {
    return (
      current &&
      rental_date &&
      current <= dayjs(rental_date).startOf("day")
    );
  };

  useEffect(() => {
    Pemesanan.setFieldValue("return_date", null);
  }, [rental_date]);

  useEffect(() => {
    const pricePerDay = selectedCostume?.price_per_day || 0;
    if (rental_date && return_date && quantity && pricePerDay) {
      const start = dayjs(rental_date);
      const end = dayjs(return_date);
      const days = end.diff(start, "day");
      if (days >= 0) {
        setTotalPrice(days * quantity * pricePerDay);
      } else {
        setTotalPrice(0);
      }
    } else {
      setTotalPrice(0);
    }
  }, [rental_date, return_date, quantity, selectedCostume]);

  const handleOrderSubmit = (values) => {
    const { address, quantity, rental_date, return_date, size, payment_method } = values;

    // Data pemesanan yang akan dikirim ke server
    const orderData = {
      user_id: userProfile?.id,
      costume_id: selectedCostume.id,
      status: "pending", // Status pesanan
      payment_status: "unpaid", // Status pembayaran
      payment_method, // Menambahkan metode pembayaran
    };

    const deposit = selectedCostume && quantity ? selectedCostume.price_per_day * 0.5 * quantity : 0;

    const orderPayload = {
      ...orderData,
      rental_date: dayjs(rental_date).format("YYYY-MM-DD"),
      return_date: dayjs(return_date).format("YYYY-MM-DD"),
      address,
      quantity,
      size,
      price_per_day: selectedCostume.price_per_day,
      price_snapshot: totalPrice + deposit, // Kirim total harga + deposit sebagai price_snapshot
      deposit: deposit, // Kirim deposit yang sudah benar
    };

    // Mengirimkan data pesanan ke backend
    sendData("/api/orders", orderPayload)
      .then((resp) => {
        if (resp?.id) {
          openNotificationWithIcon("success", "Penyewaan Berhasil!", "Penyewaan berhasil dilakukan.");
          setSelectedCostume(null);
          // Refresh data kostum
          const fetchData = async () => {
            try {
              const costumeData = await getData('/api/costumes');
              setCostumes(Array.isArray(costumeData) ? costumeData : []);
            } catch (err) {
              console.error("Error refreshing data:", err);
            }
          };
          fetchData();
          Pemesanan.resetFields();
          onClose();
        } else {
          openNotificationWithIcon("error", "Penyewaan Gagal!", "Penyewaan gagal dilakukan.");
        }
      })
      .catch((err) => {
        console.error("Error:", err);
        message.error("Terjadi kesalahan, coba lagi.");
      });
  };

  const openNotificationWithIcon = (type, message, description) => {
    api[type]({
      message: message,
      description: description,
    });
  };

  const isFormFilled = rental_date && return_date && quantity && selectedCostume?.price_per_day;
  const depositValue = isFormFilled ? selectedCostume.price_per_day * 0.5 : 0;
  const grandTotal = isFormFilled ? totalPrice + depositValue : 0;

  return (
    <ConfigProvider theme={{ token: { colorPrimary: "#a7374a" } }}>
      <div className="home-page" style={{ background: '#f8f8fc', padding: 0 }}>
        {contextHolder}
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(90deg, #a7374a 0%, #fc5c7d 100%)',
        borderRadius: '0 0 32px 32px',
        padding: '48px 0 32px 0',
        marginBottom: 32
      }}>
        <Row align="middle" justify="center" style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Col xs={24} md={12} style={{ color: '#fff', padding: 24 }}>
            <Title style={{ color: '#fff', fontWeight: 700, fontSize: 40, marginBottom: 16 }}>Koleksi Terbaru Rentique 2025</Title>
            <Text style={{ color: '#fff', fontSize: 18, display: 'block', marginBottom: 32 }}>
              Temukan koleksi terbaik untuk segala acara hanya di Rentique. Pilihan lengkap, harga terjangkau, dan layanan cepat!
            </Text>
            <Button type="primary" size="large" style={{ background: '#fff', color: '#a7374a', border: 'none', fontWeight: 700 }} href="/katalog">
              Sewa di Rentique
            </Button>
          </Col>
          <Col xs={24} md={12} style={{ textAlign: 'center' }}>
            <img src={HERO_IMAGE} alt="Hero Rentique" style={{ maxWidth: 350, width: '100%', borderRadius: 24, boxShadow: '0 8px 32px rgba(0,0,0,0.10)' }} />
          </Col>
        </Row>
      </div>
      {/* Category Bar */}
      <div style={{ maxWidth: 1100, margin: '0 auto', marginBottom: 32 }}>
        <Title level={4} style={{ marginBottom: 16, color: '#a7374a', fontWeight: 700, fontSize: 24, textAlign: 'center' }}>Kategori di Rentique</Title>
        <div style={{ display: 'flex', gap: 24, overflowX: 'auto', paddingBottom: 8, justifyContent: 'center' }}>
          {categories.map((cat) => (
            <div key={cat.id} style={{ minWidth: 120, background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'center', padding: 16 }}>
              <Avatar shape="square" size={48} style={{ background: '#f5f5f5', marginBottom: 8 }}>
                <SmileOutlined style={{ color: '#a7374a', fontSize: 28 }} />
              </Avatar>
              <div style={{ fontWeight: 600, color: '#a7374a', fontSize: 16 }}>{cat.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tab Filter & Kostum Grid */}
      <div style={{ maxWidth: 1100, margin: '0 auto', marginBottom: 48 }}>
        <Title level={4} style={{ marginBottom: 24, color: '#a7374a', fontWeight: 700, fontSize: 24, textAlign: 'center' }}>Semua Koleksi Rentique</Title>
        {loading ? (
          <Spin size="large" />
        ) : costumes.length === 0 ? (
          <Text>Tidak ada koleksi tersedia di Rentique.</Text>
        ) : (
          <Row gutter={[16, 16]} align="top" justify="center">
            {costumes.filter(item => item.status === 'available').slice(0, 4).map((item) => (
              <Col xs={24} sm={12} md={6} lg={6} key={item.id}>
                <Card
                  style={{
                    borderRadius: "15px",
                    overflow: "hidden",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                    minHeight: 370,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                  cover={
                    <div style={{ width: "100%", paddingTop: "100%", position: "relative" }}>
                      <img
                        src={item.image_url}
                        alt="costume-img"
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  }
                  actions={[
                    <Button
                      type="text"
                      icon={<InfoCircleOutlined />}
                      style={{ color: '#a7374a' }}
                      onClick={() => handleDetail(item)}
                    >
                      Detail
                    </Button>,
                    <Button
                      type="primary"
                      icon={<ShoppingCartOutlined />}
                      onClick={() => handleCheckoutClick(item)}
                    >
                      Checkout
                    </Button>,
                  ]}
                >
                  <div style={{ minHeight: 120, maxHeight: 120, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>{item.name}</div>
                    <div
                      style={{
                        color: '#888',
                        marginBottom: 8,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        minHeight: 40,
                        maxHeight: 40,
                      }}
                    >
                      {item.description}
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>

      {/* Review Section */}
      <div className="features-section" style={{ background: '#fafafa', borderRadius: 16, padding: 24, marginBottom: 48 }}>
        <Title level={3} style={{ color: '#a7374a', textAlign: 'center', fontWeight: 700, fontSize: 24 }}>Testimoni Rentique</Title>
        <Row gutter={[24, 24]}>
          {DUMMY_REVIEWS.map((review, idx) => (
            <Col xs={24} md={8} key={idx}>
              <Card bordered={false} className="feature-card" style={{ minHeight: 180 }}>
                <Rate disabled defaultValue={review.rating} style={{ color: '#faad14', marginBottom: 8 }} />
                <Text style={{ display: 'block', marginBottom: 8 }}>{review.comment}</Text>
                <Text strong>{review.name}</Text>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Tambahkan Modal detail seperti di katalog */}
      <Modal
        title="Detail Kostum"
        visible={detailVisible}
        onCancel={closeDetail}
        footer={[
          <Button key="close" onClick={closeDetail}>
            Tutup
          </Button>,
        ]}
      >
        {selectedDetail && (
          <div>
            <img
              src={selectedDetail.image_url}
              alt={selectedDetail.name}
              style={{ width: "100%", borderRadius: "8px", marginBottom: "16px" }}
            />
            <Title level={4}>{selectedDetail.name}</Title>
            <Text>{selectedDetail.description}</Text>
            <br /><br />
            <Text strong>Harga per Hari: </Text>
            <Text>Rp {selectedDetail.price_per_day.toLocaleString("id-ID")}</Text>
            <br /><br />
            <Text strong>Stok Ukuran: </Text>
            <ul>
              {selectedDetail.sizes?.map((s) => (
                <li key={s.size?.id}>
                  {s.size?.name}: {s.stock} tersedia
                </li>
              ))}
            </ul>
          </div>
        )}
      </Modal>

      {/* Tambahkan Drawer form pemesanan seperti di katalog */}
      <Drawer
        title="Form Penyewaan"
        placement="right"
        width={500}
        onClose={onClose}
        open={open}
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="primary" onClick={() => Pemesanan.submit()}>
              Pesan
            </Button>
          </Space>
        }
      >
        {selectedCostume && (
          <Form
            form={Pemesanan}
            layout="vertical"
            onFinish={handleOrderSubmit}
            initialValues={{
              costume_name: selectedCostume.name,
              price: selectedCostume.price_per_day,
            }}
          >
            {/* Tanggal Sewa */}
            <Form.Item
              label="Tanggal Sewa"
              name="rental_date"
              rules={[{ required: true, message: "Please select rental date" }]}
            >
              <DatePicker 
                format="YYYY-MM-DD"
                style={{ width: "100%" }}
                disabledDate={disablePastDates}
              />
            </Form.Item>
            {/* Tanggal Kembali */}
            <Form.Item
              label="Tanggal Kembali"
              name="return_date"
              rules={[{ required: true, message: "Please select return date" }]}
            >
              <DatePicker 
                format="YYYY-MM-DD"
                style={{ width: "100%" }}
                disabledDate={disableReturnDates}
              />
            </Form.Item>
            {/* Alamat */}
            <Form.Item
              label="Alamat"
              name="address"
              rules={[{ required: true, message: "Please enter your address" }]}
            >
              <Input.TextArea rows={3} />
            </Form.Item>
            {/* Ukuran Kostum */}
            <Form.Item
              label="Ukuran Kostum"
              name="size"
              rules={[{ required: true, message: "Please select costume size" }]}
            >
              <Space direction="horizontal" wrap>
                {selectedCostume.sizes?.map((sizeItem) => {
                  const sizeName = sizeItem.size?.name;
                  const sizeId = sizeItem.size?.id;

                  return (
                    <Button
                      key={sizeId}
                      type={selectedSize === sizeId ? "primary" : "default"}
                      style={{
                        margin: "5px",
                        borderColor: "#a7374a",
                        color: selectedSize === sizeId ? "white" : "#a7374a",
                        backgroundColor: selectedSize === sizeId ? "#a7374a" : "white",
                        cursor: sizeItem.stock > 0 ? "pointer" : "not-allowed",
                      }}
                      disabled={sizeItem.stock === 0}
                      onClick={() => {
                        setSelectedSize(sizeId);
                        Pemesanan.setFieldsValue({ size: sizeId });
                      }}
                    >
                      {sizeName}
                    </Button>
                  );
                })}
              </Space>
              {Pemesanan.getFieldValue('size') && (
                <div style={{ marginTop: 8 }}>
                  <Text type="secondary">
                    Stok untuk ukuran ini: {selectedCostume.sizes.find((item) => item.size?.id === Pemesanan.getFieldValue('size'))?.stock ?? 0}
                  </Text>
                </div>
              )}
            </Form.Item>
            {/* Jumlah */}
            <Form.Item
              label="Jumlah"
              name="quantity"
              rules={[{ required: true, message: "Please enter quantity" }]}
            >
              <Input type="number" min={1} />
            </Form.Item>
            {/* Metode Pembayaran */}
            <Form.Item
              label="Metode Pembayaran"
              name="payment_method"
              rules={[{ required: true, message: "Please select a payment method" }]}
            >
              <Select placeholder="Pilih metode pembayaran">
                <Select.Option value="transfer">Transfer Bank</Select.Option>
                <Select.Option value="qris">QRIS</Select.Option>
              </Select>
            </Form.Item>
            {/* Total Harga */}
            <div style={{ marginTop: "16px" }}>
              <Text strong>Harga Sewa: </Text>
              <Text>Rp {totalPrice.toLocaleString("id-ID")}</Text>
            </div>
            {/* Deposit */}
            <div style={{ marginTop: "8px" }}>
              <Text strong>Deposit: </Text>
              <Text>Rp {(selectedCostume && quantity ? selectedCostume.price_per_day * 0.5 * quantity : 0).toLocaleString("id-ID")}</Text>
            </div>
            {/* Grand Total */}
            <div style={{ marginTop: "8px" }}>
              <Text strong>Total Harga: </Text>
              <Text>Rp {grandTotal.toLocaleString("id-ID")}</Text>
            </div>
          </Form>
        )}
      </Drawer>
    </div>
    </ConfigProvider>
  );
};

export default Home; 