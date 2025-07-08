import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import { getDataPrivate, sendDataWithFile } from "../../utils/api";
import { Card, Typography, Upload, Button, message, List, Divider } from "antd";
import { UploadOutlined, BankOutlined, CreditCardOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const TransferPaymentPage = () => {
  const { id } = useParams(); // order id (optional)
  const [order, setOrder] = useState(null);
  const [fileList, setFileList] = useState([]);
  const navigate = useNavigate();
  const { userProfile: _userProfile } = useContext(AuthContext);

  // Data rekening transfer
  const bankAccounts = [
    {
      bank: "Bank BNI",
      accountNumber: "1234567890",
      accountName: "PT Sewa Kostum Indonesia",
      icon: <BankOutlined />
    },
    {
      bank: "Bank Mandiri",
      accountNumber: "0987654321", 
      accountName: "PT Sewa Kostum Indonesia",
      icon: <CreditCardOutlined />
    }
  ];

  useEffect(() => {
    // Jika ada ID, ambil data order
    if (id) {
      getDataPrivate(`/api/orders/${id}`)
        .then((data) => setOrder(data))
        .catch((err) => {
          message.error("Gagal mengambil data pesanan");
          console.error(err);
        });
    }
  }, [id]);

  const handleUpload = async () => {
    if (fileList.length === 0) {
      return message.warning("Harap unggah bukti pembayaran terlebih dahulu");
    }

    if (!order) {
      return message.warning("Data pesanan tidak ditemukan");
    }

    const formData = new FormData();
    formData.append("order_id", order.id);
    formData.append("payment_method", "transfer");
    formData.append("status", "pending");
    formData.append("proof_image", fileList[0]?.originFileObj);

    try {
      const response = await sendDataWithFile("/api/payments", formData);
      
      if (response && response.order) {
        // Update order data dengan data terbaru
        setOrder(response.order);
        message.success(response.message || "Bukti pembayaran berhasil diunggah dan status diupdate menjadi pending");
        
        // Tunggu sebentar sebelum redirect agar user bisa melihat pesan
        setTimeout(() => {
          navigate("/pesanan");
        }, 2000);
      } else {
        message.success("Bukti pembayaran berhasil diunggah");
        navigate("/pesanan");
      }
    } catch (error) {
      message.error("Gagal mengunggah bukti pembayaran");
      console.error(error);
    }
  };

  // Jika ada ID tapi order belum dimuat
  if (id && !order) {
    return <div>Memuat data pesanan...</div>;
  }

  // Jika ada ID tapi tidak ada order
  if (id && order === null) {
    return (
      <Card title="Pesanan Tidak Ditemukan" style={{ maxWidth: 600, margin: "0 auto" }}>
        <Text>Pesanan dengan ID {id} tidak ditemukan.</Text>
        <br />
        <Button type="primary" onClick={() => navigate("/pesanan")}>
          Kembali ke Pesanan
        </Button>
      </Card>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <Card title="Informasi Transfer" style={{ maxWidth: 600, width: '100%', margin: "0 auto" }}>
        <Title level={4}>Rekening Transfer</Title>
        <Text>Silakan transfer ke salah satu rekening berikut:</Text>
        
        <List
          style={{ marginTop: 16 }}
          dataSource={bankAccounts}
          renderItem={(account) => (
            <List.Item>
              <Card style={{ width: "100%", border: "1px solid #d9d9d9" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {account.icon}
                  <div>
                    <Text strong>{account.bank}</Text><br />
                    <Text>No. Rekening: {account.accountNumber}</Text><br />
                    <Text>A/N: {account.accountName}</Text>
                  </div>
                </div>
              </Card>
            </List.Item>
          )}
        />

        {order && (
          <>
            <Divider />
            <Title level={4}>Detail Pembayaran</Title>
            <Card style={{ background: "#f5f5f5" }}>
              <Text strong>Order ID: </Text>
              <Text>{order.id}</Text><br />
              <Text strong>Total Pembayaran: </Text>
              <Text type="danger" strong>
                Rp {order.total_price?.toLocaleString("id-ID")}
              </Text>
            </Card>

            <Divider />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <Title level={4} style={{ marginBottom: 8 }}>Upload Bukti Pembayaran</Title>
              <Upload
                beforeUpload={() => false}
                fileList={fileList}
                onChange={({ fileList }) => setFileList(fileList)}
                accept="image/*"
                maxCount={1}
              >
                <Button icon={<UploadOutlined />}>Pilih File</Button>
              </Upload>
              <Button
                type="primary"
                style={{ marginTop: 12, marginBottom: 6, width: '100%' }}
                onClick={handleUpload}
                disabled={fileList.length === 0}
              >
                Kirim Bukti Pembayaran
              </Button>
              <Button type="default" onClick={() => navigate('/pesanan')} style={{ width: '100%' }}>
                Kembali ke Pesanan
              </Button>
            </div>
          </>
        )}

        {!order && (
          <>
            <Divider />
            <Title level={4}>Cara Pembayaran</Title>
            <div style={{ background: "#f9f9f9", padding: 16, borderRadius: 8 }}>
              <ol>
                <li>Pilih salah satu rekening di atas</li>
                <li>Transfer sesuai dengan total pembayaran yang tertera di pesanan Anda</li>
                <li>Simpan bukti transfer</li>
                <li>Kembali ke halaman <Text strong>Pesanan</Text> untuk mengunggah bukti pembayaran</li>
              </ol>
            </div>
            
            <Button 
              type="primary" 
              style={{ marginTop: 16 }} 
              onClick={() => navigate("/pesanan")}
            >
              Lihat Pesanan Saya
            </Button>
          </>
        )}
      </Card>
    </div>
  );
};

export default TransferPaymentPage;
