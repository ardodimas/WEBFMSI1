import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Button, Typography, Spin, Rate, Tabs, Avatar, Drawer, Form, Input, message, Space, DatePicker, notification, ConfigProvider } from 'antd';
import { StarOutlined, ThunderboltOutlined, SmileOutlined, GiftOutlined, SyncOutlined, InfoCircleOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import './Home.css';
import { getData } from '../../utils/api';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const DUMMY_REVIEWS = [
  { name: 'Jason Bouwy', rating: 5, comment: 'Kostum sangat bagus dan pengiriman cepat!' },
  { name: 'Mike Duntson', rating: 5, comment: 'Pelayanan ramah, kostum sesuai deskripsi.' },
  { name: 'Lea Miston', rating: 5, comment: 'Sangat puas, akan sewa lagi di sini.' }
];

const FEATURE_LIST = [
  { icon: <ThunderboltOutlined />, title: 'Pengiriman Cepat' },
  { icon: <SyncOutlined />, title: 'Pengembalian 7 Hari' },
  { icon: <GiftOutlined />, title: 'Diskon Member' },
  { icon: <SmileOutlined />, title: 'Layanan Ramah' }
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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCostume, setSelectedCostume] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [Pemesanan] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();

  const rental_date = Form.useWatch("rental_date", Pemesanan);
  const return_date = Form.useWatch("return_date", Pemesanan);
  const quantity = Form.useWatch("quantity", Pemesanan);

  const disablePastDates = (current) => current && current < dayjs().startOf("day");
  const disableReturnDates = (current) => current && rental_date && current <= dayjs(rental_date).startOf("day");

  useEffect(() => { Pemesanan.setFieldValue("return_date", null); }, [rental_date]);
  useEffect(() => {
    const pricePerDay = selectedCostume?.price_per_day || 0;
    if (rental_date && return_date && quantity && pricePerDay) {
      const start = dayjs(rental_date);
      const end = dayjs(return_date);
      const days = end.diff(start, "day");
      if (days >= 0) {
        const total = (days) * quantity * pricePerDay + 300000;
        setTotalPrice(total);
      } else {
        setTotalPrice(0);
      }
    } else {
      setTotalPrice(0);
    }
  }, [rental_date, return_date, quantity, selectedCostume]);

  const showDrawer = (costume) => {
    setSelectedCostume(costume);
    setDrawerOpen(true);
  };
  const onCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedCostume(null);
    setSelectedSize("");
    Pemesanan.resetFields();
  };

  const handleOrderSubmit = (values) => {
    // ... implementasi submit sesuai katalog ...
    message.success('Fitur checkout berhasil (dummy, sesuaikan dengan backend)');
    onCloseDrawer();
  };

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

  return (
    <div className="home-page" style={{ background: '#f8f8fc', padding: 0 }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(90deg, #a7374a 0%, #fc5c7d 100%)',
        borderRadius: '0 0 32px 32px',
        padding: '48px 0 32px 0',
        marginBottom: 32
      }}>
        <Row align="middle" justify="center" style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Col xs={24} md={12} style={{ color: '#fff', padding: 24 }}>
            <Title style={{ color: '#fff', fontWeight: 700, fontSize: 40, marginBottom: 16 }}>KOLEKSI KOSTUM TERBARU 2024</Title>
            <Text style={{ color: '#fff', fontSize: 18, display: 'block', marginBottom: 32 }}>
              Temukan kostum terbaik untuk segala acara. Pilihan lengkap, harga terjangkau, dan layanan cepat!
            </Text>
            <Button type="primary" size="large" style={{ background: '#fff', color: '#a7374a', border: 'none', fontWeight: 700 }} href="/katalog">
              Sewa Sekarang
            </Button>
          </Col>
          <Col xs={24} md={12} style={{ textAlign: 'center' }}>
            <img src={HERO_IMAGE} alt="Hero Kostum" style={{ maxWidth: 350, width: '100%', borderRadius: 24, boxShadow: '0 8px 32px rgba(0,0,0,0.10)' }} />
          </Col>
        </Row>
      </div>

      {/* Feature Bar */}
      <div style={{ maxWidth: 900, margin: '0 auto', marginBottom: 32 }}>
        <Row gutter={[24, 24]} justify="center">
          {FEATURE_LIST.map((f, i) => (
            <Col xs={12} md={6} key={i}>
              <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', padding: 20, textAlign: 'center' }}>
                <div style={{ fontSize: 32, color: '#a7374a', marginBottom: 8 }}>{f.icon}</div>
                <Text style={{ fontWeight: 600 }}>{f.title}</Text>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      {/* Category Bar */}
      <div style={{ maxWidth: 1100, margin: '0 auto', marginBottom: 32 }}>
        <Title level={4} style={{ marginBottom: 16, color: '#a7374a', fontWeight: 700, fontSize: 24, textAlign: 'center' }}>Kategori Kostum</Title>
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
        <Title level={4} style={{ marginBottom: 24, color: '#a7374a', fontWeight: 700, fontSize: 24, textAlign: 'center' }}>Semua Kostum</Title>
        {loading ? (
          <Spin size="large" />
        ) : costumes.length === 0 ? (
          <Text>Tidak ada kostum tersedia.</Text>
        ) : (
          <Row gutter={[32, 32]} align="top" justify="center">
            {costumes.slice(0, 3).map((item) => (
              <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
                <Card
                  style={{
                    borderRadius: 15,
                    overflow: 'hidden',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  }}
                  cover={
                    <div style={{ width: '100%', paddingTop: '100%', position: 'relative' }}>
                      <img
                        src={item.image_url || '/public/images/login-dragon.png'}
                        alt="costume-img"
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </div>
                  }
                  actions={[
                    <Button
                      type="text"
                      icon={<InfoCircleOutlined />}
                      href={`/costumes/${item.id}`}
                      style={{ color: '#a7374a' }}
                    >
                      Detail
                    </Button>,
                    <Button
                      type="primary"
                      icon={<ShoppingCartOutlined />}
                      onClick={() => showDrawer(item)}
                      style={{ background: '#a7374a', borderColor: '#a7374a' }}
                    >
                      Checkout
                    </Button>,
                  ]}
                >
                  <Card.Meta
                    title={item.name}
                    description={item.description}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>

      {/* Review Section */}
      <div className="features-section" style={{ background: '#fafafa', borderRadius: 16, padding: 24, marginBottom: 48 }}>
        <Title level={3} style={{ color: '#a7374a', textAlign: 'center', fontWeight: 700, fontSize: 24 }}>Customer Reviews</Title>
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

      {/* Drawer Checkout */}
      <Drawer
        title="Form Pembelian"
        placement="right"
        width={500}
        onClose={onCloseDrawer}
        open={drawerOpen}
        extra={
          <Space>
            <Button onClick={onCloseDrawer}>Cancel</Button>
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
            <Form.Item
              label="Tanggal Sewa"
              name="rental_date"
              rules={[{ required: true, message: "Pilih tanggal sewa" }]}
            >
              <DatePicker 
                format="YYYY-MM-DD"
                style={{ width: "100%" }}
                disabledDate={disablePastDates}
              />
            </Form.Item>
            <Form.Item
              label="Tanggal Kembali"
              name="return_date"
              rules={[{ required: true, message: "Pilih tanggal kembali" }]}
            >
              <DatePicker 
                format="YYYY-MM-DD"
                style={{ width: "100%" }}
                disabledDate={disableReturnDates}
              />
            </Form.Item>
            <Form.Item
              label="Alamat"
              name="address"
              rules={[{ required: true, message: "Masukkan alamat" }]}
            >
              <Input.TextArea rows={3} />
            </Form.Item>
            <Form.Item
              label="Jumlah"
              name="quantity"
              rules={[{ required: true, message: "Masukkan jumlah" }]}
            >
              <Input type="number" min={1} />
            </Form.Item>
            {/* Ukuran Kostum jika ada */}
            {selectedCostume.sizes && selectedCostume.sizes.length > 0 && (
              <Form.Item
                label="Ukuran Kostum"
                name="size"
                rules={[{ required: true, message: "Pilih ukuran kostum" }]}
              >
                <Space direction="horizontal" wrap>
                  {selectedCostume.sizes.map((sizeItem) => {
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
              </Form.Item>
            )}
            <div style={{ marginTop: 16 }}>
              <Text strong>Total Harga: Rp {totalPrice.toLocaleString('id-ID')}</Text>
            </div>
          </Form>
        )}
      </Drawer>
    </div>
  );
};

export default Home; 