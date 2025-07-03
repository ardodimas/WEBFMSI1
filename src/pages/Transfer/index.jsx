import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import { getDataPrivate, sendDataWithFile } from "../../utils/api";
import { Card, Typography, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const TransferPaymentPage = () => {
  const { id } = useParams(); // order id
  const [order, setOrder] = useState(null);
  const [fileList, setFileList] = useState([]);
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  useEffect(() => {
    getDataPrivate(`/api/orders/${id}`, token)
      .then((data) => setOrder(data))
      .catch((err) => {
        message.error("Gagal mengambil data pesanan");
        console.error(err);
      });
  }, [id, token]);

  const handleUpload = async () => {
    if (fileList.length === 0) {
      return message.warning("Harap unggah bukti pembayaran terlebih dahulu");
    }

    const formData = new FormData();
    formData.append("order_id", order.id);
    formData.append("payment_method", "transfer");
    formData.append("status", "pending");
    formData.append("proof_image", fileList[0]?.originFileObj);

    try {
      await sendDataWithFile("/api/payments", formData);
      message.success("Bukti pembayaran berhasil diunggah");
      navigate("/pesanan"); // kembali ke halaman pesanan
    } catch (error) {
      message.error("Gagal mengunggah bukti pembayaran");
      console.error(error);
    }
  };

  if (!order) return <div>Memuat data...</div>;

  return (
    <Card title="Pembayaran Transfer" style={{ maxWidth: 600, margin: "0 auto" }}>
      <Title level={4}>Silakan transfer ke rekening berikut:</Title>
      <Text strong>Bank BNI</Text><br />
      <Text>Nomor Rekening: 1234567890</Text><br />
      <Text>Atas Nama: PT Sewa Kostum Indonesia</Text><br /><br />

      <Title level={5}>Total yang harus dibayar:</Title>
      <Text type="danger" strong>
        Rp {order.total_price?.toLocaleString("id-ID")}
      </Text>

      <div style={{ marginTop: 24 }}>
        <Title level={5}>Upload Bukti Pembayaran:</Title>
        <Upload
          beforeUpload={() => false}
          fileList={fileList}
          onChange={({ fileList }) => setFileList(fileList)}
          accept="image/*"
        >
          <Button icon={<UploadOutlined />}>Pilih File</Button>
        </Upload>
      </div>

      <Button type="primary" style={{ marginTop: 16 }} onClick={handleUpload}>
        Kirim Bukti Pembayaran
      </Button>
    </Card>
  );
};

export default TransferPaymentPage;
