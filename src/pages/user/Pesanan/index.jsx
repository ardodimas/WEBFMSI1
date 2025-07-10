import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../providers/AuthProvider";
import { getDataPrivate } from "../../../utils/api";
import { Card, Row, Col, Tag, Typography, Space, Button } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import './Pesanan.css';

const { Text } = Typography;

const statusColor = {
  unpaid: "red",
  paid: "green",
  pending: "gold",
  completed: "blue",
  waiting_verification: "orange",
};

const PesananPage = () => {
  const { userProfile } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (userProfile?.id) {
      fetchOrders();
    }
  }, [userProfile]);

  const fetchOrders = () => {
    if (userProfile?.id) {
      setLoading(true);
      getDataPrivate(`/api/orders/user/${userProfile.id}`)
        .then((data) => {
          console.log("API response:", data);
          setOrders(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  };

  // Refresh orders when component comes into focus (e.g., when returning from payment page)
  useEffect(() => {
    const handleFocus = () => {
      fetchOrders();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [userProfile?.id]);

  if (loading) return <div>Loading pesanan...</div>;

  const handleBayar = (order) => {
    if (order.payment_method === "transfer") {
        navigate(`/pembayaran/transfer/${order.id}`);
    } else if (order.payment_method === "qris") {
        navigate(`/pembayaran/qris/${order.id}`);
    } else {
        alert.error("Metode pembayaran tidak dikenal.");
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2>Daftar Pesanan Saya</h2>
      </div>
      {orders.length === 0 ? (
        <div>Belum ada pesanan.</div>
      ) : (
        <Row gutter={[24, 24]}>
          {orders.map((order) => (
            <Col xs={24} sm={24} md={12} lg={8} key={order.id}>
              <Card
                className="pesanan-card"
                title={
                  <Space direction="vertical" size={0}>
                    <Text strong>{order.order_items[0]?.costume_name || "-"}</Text>
                    <Text type="secondary" style={{ fontSize: 13 }}>
                      {order.rental_date} s/d {order.return_date}
                    </Text>
                  </Space>
                }
                bordered={false}
                style={{ borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.07)" }}
              >
                <div style={{ marginBottom: 8 }}>
                  <Text strong>Alamat:</Text> {order.address}
                </div>
                <div style={{ marginBottom: 8 }}>
                  <Text strong>Total Harga:</Text> Rp {order.total_price?.toLocaleString()}
                </div>
                <div style={{ marginBottom: 8 }}>
                  <Text strong>Metode Pembayaran:</Text> {order.payment_method || "-"}
                </div>
                <div style={{ marginBottom: 8 }}>
                  <Text strong>Status Pembayaran:</Text> 
                  <Tag color={statusColor[order.payment_status] || "default"}>
                    {order.payment_status === 'pending' ? 'Menunggu Verifikasi' : 
                     order.payment_status === 'paid' ? 'Sudah Dibayar' : 
                     order.payment_status === 'unpaid' ? 'Belum Dibayar' : 
                     order.payment_status}
                  </Tag>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <Text strong>Status Pesanan:</Text> <Tag color={statusColor[order.status] || "default"}>{order.status}</Tag>
                </div>
                <div style={{ marginTop: 12 }}>
                  <Text strong>Detail Item:</Text>
                  {order.order_items.map((item) => (
                    <div key={item.id} style={{ margin: "8px 0", padding: 8, background: "#f9f9f9", borderRadius: 6 }}>
                      <div><Text>Nama Kostum:</Text> {item.costume_name}</div>
                      <div><Text>Ukuran:</Text> {item.size_name}</div>
                      <div><Text>Jumlah:</Text> {item.quantity}</div>
                      <div><Text>Harga Satuan:</Text> Rp {item.price_snapshot?.toLocaleString()}</div>
                      <div><Text>Total Harga:</Text> Rp {item.total_price?.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
                {order.payment_status === "unpaid" && (
                <div style={{ marginTop: 16 }}>
                    <Button
                    type="primary"
                    onClick={() => handleBayar(order)}
                    style={{ backgroundColor: "#a7374a", borderColor: "#a7374a" }}
                    >
                    Bayar Sekarang
                    </Button>
                </div>
                )}
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default PesananPage;
