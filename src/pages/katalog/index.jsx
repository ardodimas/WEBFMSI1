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
  const [selectedCostume, setSelectedCostume] = useState(null); // Menyimpan kostum yang dipilih untuk pemesanan
  const [selectedSize, setSelectedSize] = useState(""); // Menyimpan ukuran yang dipilih
  const [placement] = useState("right");

  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();

  // Fetch Data
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

  // Handle Drawer
  const showDrawer = (costume) => {
    setSelectedCostume(costume); // Set kostum yang dipilih
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
    setSelectedCostume(null); // Reset kostum yang dipilih saat drawer ditutup
    Pemesanan.resetFields();
  };

  // Handle Search
  const handleSearch = (value) => {
    setSearchText(value);
  };

  // Handle Filter
  const handleFilter = () => {
    message.info("Fitur filter akan segera hadir");
  };

  const [Pemesanan] = Form.useForm();
  
  // Handle Order Submit
  const handleOrderSubmit = () => {
    const orderData = {
      user_id: 1, // ID user, sebaiknya dinamis sesuai login
      costume_id: selectedCostume.id,
      status: "pending", // Status pesanan
      payment_status: "unpaid", // Status pembayaran
    };

    // Ambil nilai dari Form
    const rental_date = dayjs(Pemesanan.getFieldValue("rental_date")).format("YYYY-MM-DD");
    const return_date = dayjs(Pemesanan.getFieldValue("return_date")).format("YYYY-MM-DD");
    const address = Pemesanan.getFieldValue("address");
    const quantity = Pemesanan.getFieldValue("quantity");
    const size = selectedSize;

    // Persiapkan data yang akan dikirim
    const orderPayload = {
      ...orderData,
      rental_date,
      return_date,
      address,
      quantity,
      size,
    };

    // Mengirimkan data ke backend
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

  // Notification helper function
  const openNotificationWithIcon = (type, message, description) => {
    api[type]( {
      message: message,
      description: description,
    });
  };

  // Render Katalog
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
                    item.name.toLowerCase().includes(searchText.toLowerCase()) // Menggunakan 'name' dari model Costume
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
                            onClick={() => showDrawer(item)} // Menampilkan drawer dengan item yang dipilih
                          >
                            Checkout
                          </Button>,
                        ]}
                      >
                        <Card.Meta
                          title={item.name} // Menggunakan 'name' dari model Costume
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
                costume_name: selectedCostume.name, // Memasukkan nama kostum yang dipilih
                price: selectedCostume.price_per_day, // Memasukkan harga kostum per hari
              }}
            >
              <Form.Item
                label="Tanggal Sewa"
                name="rental_date"
                rules={[{ required: true, message: "Please select rental date" }]}>
                <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item
                label="Tanggal Kembali"
                name="return_date"
                rules={[{ required: true, message: "Please select return date" }]}>
                <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item
                label="Alamat"
                name="address"
                rules={[{ required: true, message: "Please enter your address" }]}>
                <Input.TextArea rows={3} />
              </Form.Item>

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
                          setSelectedSize(sizeId); // update state
                          Pemesanan.setFieldsValue({ size: sizeId }); // update value di form
                        }}
                      >
                        {`${sizeName}`}
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
              <Form.Item
                label="Jumlah"
                name="quantity"
                rules={[{ required: true, message: "Please enter quantity" }]}>
                <Input type="number" min={1} />
              </Form.Item>
            </Form>
          )}
        </Drawer>
      </div>
    </ConfigProvider>
  );
};

export default Katalog;
