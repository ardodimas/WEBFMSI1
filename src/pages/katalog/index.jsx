import {
  Col,
  Row,
  Typography,
  Card,
  List,
  FloatButton,
  Drawer,
  Form,
  Input,
  Button,
  notification,
  message,
  Space,
  ConfigProvider,
  DatePicker,
  Select,
  Modal,
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  InfoCircleOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";
import { sendData, getData } from "../../utils/api";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { Search } = Input;

const Katalog = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [dataSources, setDataSources] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedCostume, setSelectedCostume] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [placement] = useState("right");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { isLoggedIn, userProfile } = useContext(AuthContext);
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    setIsLoading(true);
    fetch("http://127.0.0.1:5000/api/costumes")
      .then((res) => res.json())
      .then((data) => setDataSources(data))
      .catch((err) => {
        console.error("Gagal mengambil data:", err);
        message.error("Gagal mengambil data dari server");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Ambil data kategori dari backend
  useEffect(() => {
    getData("/api/categories")
      .then((resp) => {
        if (Array.isArray(resp)) setCategories(resp);
        else if (Array.isArray(resp?.datas)) setCategories(resp.datas);
      });
  }, []);

  const showDrawer = (costume) => {
    setSelectedCostume(costume);
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
    setSelectedCostume(null);
    Pemesanan.resetFields();
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleFilter = () => {
    message.info("Fitur filter akan segera hadir");
  };

  const [totalPrice, setTotalPrice] = useState(0);
  const [deposit, setDeposit] = useState(0); // Tetap gunakan state deposit
  const [Pemesanan] = Form.useForm();

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
        const total = (days) * quantity * pricePerDay;
        setTotalPrice(total);
        setDeposit(pricePerDay * 0.5); // Deposit adalah 50% dari harga satuan per hari
      } else {
        setTotalPrice(0);
        setDeposit(0);
      }
    } else {
      setTotalPrice(0);
      setDeposit(0);
    }
  }, [rental_date, return_date, quantity, selectedCostume]);

  const grandTotal = totalPrice + deposit;

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
      price_snapshot: grandTotal, // Kirim total harga + deposit sebagai price_snapshot
      deposit: deposit, // Kirim deposit yang sudah benar
      grand_total: grandTotal, // Kirim total harga + deposit
    };

    // Mengirimkan data pesanan ke backend
    sendData("/api/orders", orderPayload)
      .then((resp) => {
        if (resp?.id) {
          openNotificationWithIcon("success", "Penyewaan Berhasil!", "Penyewaan berhasil dilakukan.");
          setSelectedCostume(null);
          fetch("http://127.0.0.1:5000/api/costumes")
            .then((res) => res.json())
            .then((data) => setDataSources(data));
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

  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);

  const showDetail = (costume) => {
    setSelectedDetail(costume);
    setDetailVisible(true);
  };
  
  const closeDetail = () => {
    setDetailVisible(false);
    setSelectedDetail(null);
  };

  const handleCheckoutClick = (item) => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      showDrawer(item);
    }
  };

  const openNotificationWithIcon = (type, message, description) => {
    api[type]({
      message: message,
      description: description,
    });
  };

  // Filter data sesuai kategori, search, dan hanya yang tersedia
  const filteredData = dataSources
    .filter(item =>
      item.status === 'available' &&
      (selectedCategory === 'all' || item.category_id === selectedCategory) &&
      item.name.toLowerCase().includes(searchText.toLowerCase())
    );

  return (
    <ConfigProvider theme={{ token: { colorPrimary: "#a7374a" } }}>
      <div className="layout-content">
        {contextHolder}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '32px 0 24px 0' }}>
          <Typography.Title level={2} style={{ color: '#a7374a', fontWeight: 700, marginBottom: 8, textAlign: 'center' }}>
            Katalog Sewa Kostum
          </Typography.Title>

        </div>
        {/* Search bar di atas */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <Space.Compact style={{ minWidth: 400, maxWidth: 1200, width: '100%' }}>
            <Search
              placeholder="Cari katalog..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              onSearch={handleSearch}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ borderRadius: 12, width: '100%' }}
            />
            <Button
              type="primary"
              icon={<FilterOutlined />}
              size="large"
              onClick={handleFilter}
            />
          </Space.Compact>
        </div>
        {/* Filter kategori di bawah search bar */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
          <Button
            type={selectedCategory === 'all' ? 'primary' : 'default'}
            onClick={() => setSelectedCategory('all')}
            style={{ borderRadius: 6, minWidth: 80 }}
          >
            Semua
          </Button>
          {categories.map(cat => (
            <Button
              key={cat.id}
              type={selectedCategory === cat.id ? 'primary' : 'default'}
              onClick={() => setSelectedCategory(cat.id)}
              style={{ borderRadius: 6, minWidth: 80 }}
            >
              {cat.name}
            </Button>
          ))}
        </div>
        <Row gutter={[24, 0]}>
          <Col xs={23} className="mb-24">
            <Card bordered={false} className="circlebox h-full w-full">

              {isLoading ? (
                <div>Sedang memuat data...</div>
              ) : (
                <List
                  grid={{
                    gutter: 16,
                    xs: 1,
                    sm: 1,
                    md: 2,
                    lg: 4,
                    xl: 4,
                    xxl: 4,
                  }}
                  dataSource={filteredData}
                  renderItem={(item) => (
                    <List.Item key={item.id}>
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
                            onClick={() => showDetail(item)}
                            style={{ color: "#a7374a" }}
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
                          <div>
                            <span style={{ fontWeight: 600, color: '#a7374a' }}>
                              Rp {item.price_per_day?.toLocaleString("id-ID")}/hari
                            </span>
                            <br />
                            <span style={{ color: '#888' }}>Stok: {item.stock}</span>
                          </div>
                        </div>
                      </Card>
                    </List.Item>
                  )}
                />
              )}
            </Card>
          </Col>
        </Row>

        {/* Form Pemesanan dalam Drawer */}
        <Drawer
          title="Form Penyewaan"
          placement={placement}
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

                {selectedSize && (
                  <div style={{ marginTop: 8 }}>
                    <Text type="secondary">
                      Stok untuk ukuran ini:{" "}
                      {
                        selectedCostume.sizes.find((item) => item.size?.id === selectedSize)?.stock ?? 0
                      }
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
    </ConfigProvider>
  );
};

export default Katalog;