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
  Select, // Tambahkan Select untuk dropdown metode pembayaran
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
import { sendData } from "../../utils/api";
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

  const { isLoggedIn, userProfile } = useContext(AuthContext);
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login", { replace: true });
      return;
    }

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
  }, [isLoggedIn, navigate]);

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
  const [Pemesanan] = Form.useForm();

  const rental_date = Form.useWatch("rental_date", Pemesanan);
  const return_date = Form.useWatch("return_date", Pemesanan);
  const quantity = Form.useWatch("quantity", Pemesanan);

  useEffect(() => {
    const pricePerDay = selectedCostume?.price_per_day || 0;

    if (rental_date && return_date && quantity && pricePerDay) {
      const start = dayjs(rental_date);
      const end = dayjs(return_date);
      const days = end.diff(start, "day");

      if (days >= 0) {
        const total = (days) * quantity * pricePerDay;
        setTotalPrice(total);
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

    const orderPayload = {
      ...orderData,
      rental_date: dayjs(rental_date).format("YYYY-MM-DD"),
      return_date: dayjs(return_date).format("YYYY-MM-DD"),
      address,
      quantity,
      size,
      price_per_day: selectedCostume.price_per_day,
      price_snapshot: totalPrice,
    };

    // Mengirimkan data pesanan ke backend
    sendData("/api/orders", orderPayload)
      .then((resp) => {
        if (resp?.id) {
          openNotificationWithIcon("success", "Pembelian Berhasil!", "Pembelian berhasil dilakukan.");
          setSelectedCostume(null);
          fetch("http://127.0.0.1:5000/api/costumes")
            .then((res) => res.json())
            .then((data) => setDataSources(data));
          Pemesanan.resetFields();
          onClose();
        } else {
          openNotificationWithIcon("error", "Pembelian Gagal!", "Pembelian gagal dilakukan.");
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

  return (
    <ConfigProvider theme={{ token: { colorPrimary: "#a7374a" } }}>
      <div className="layout-content">
        {contextHolder}
        <Row gutter={[24, 0]}>
          <Col xs={23} className="mb-24">
            <Card bordered={false} className="circlebox h-full w-full">
              <div style={{ marginBottom: "20px" }}>
                <Space.Compact style={{ width: "100%" }}>
                  <Search
                    placeholder="Cari katalog..."
                    allowClear
                    enterButton={<SearchOutlined />}
                    size="large"
                    onSearch={handleSearch}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ width: "calc(100% - 50px)" }}
                  />
                  <Button
                    type="primary"
                    icon={<FilterOutlined />}
                    size="large"
                    onClick={handleFilter}
                    style={{ width: "50px" }}
                  />
                </Space.Compact>
              </div>

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
                  dataSource={dataSources.filter((item) =>
                    item.name.toLowerCase().includes(searchText.toLowerCase())
                  )}
                  renderItem={(item) => (
                    <List.Item key={item.id}>
                      <Card
                        style={{
                          borderRadius: "15px",
                          overflow: "hidden",
                          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
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
                            onClick={() => message.info("Detail akan segera hadir")}
                            style={{ color: "#a7374a" }}
                          >
                            Detail
                          </Button>,
                          <Button
                            type="primary"
                            icon={<ShoppingCartOutlined />}
                            onClick={() => showDrawer(item)} // Menampilkan drawer
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
                    </List.Item>
                  )}
                />
              )}
            </Card>
          </Col>
        </Row>

        {/* Form Pemesanan dalam Drawer */}
        <Drawer
          title="Form Pembelian"
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
                <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
              </Form.Item>
              {/* Tanggal Kembali */}
              <Form.Item
                label="Tanggal Kembali"
                name="return_date"
                rules={[{ required: true, message: "Please select return date" }]}
              >
                <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
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
                <Text strong>Total Harga: </Text>
                <Text>Rp {totalPrice.toLocaleString("id-ID")}</Text>
              </div>
            </Form>
          )}
        </Drawer>
      </div>
    </ConfigProvider>
  );
};

export default Katalog;
