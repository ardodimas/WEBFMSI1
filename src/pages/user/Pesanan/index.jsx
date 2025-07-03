import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../providers/AuthProvider";
import { getDataPrivate } from "../../../utils/api";
import { Card, Row, Col, Tag, Typography, Space } from "antd";
import './Pesanan.css';

const { Text } = Typography;

const statusColor = {
  unpaid: "red",
  paid: "green",
  pending: "gold",
  completed: "blue",
};

const PesananPage = () => {
  const { userProfile } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userProfile?.id) {
      getDataPrivate(`/api/orders/user/${userProfile.id}`)
        .then((data) => {
          setOrders(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [userProfile]);

  if (loading) return <div>Loading pesanan...</div>;

  return (
    <div>
      <h2>Daftar Pesanan Saya</h2>
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
                  <Text strong>Status Pembayaran:</Text> <Tag color={statusColor[order.payment_status] || "default"}>{order.payment_status}</Tag>
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
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default PesananPage;
