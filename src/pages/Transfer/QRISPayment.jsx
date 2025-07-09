import React, { useState, useEffect } from 'react';
import { Card, Typography, Button, Upload, message, Divider, notification } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { UploadOutlined } from '@ant-design/icons';
import { sendDataWithFile, getDataPrivate } from '../../utils/api';
import qrisImage from '../../assets/title.jpg';

const { Title, Text } = Typography;

const QRISPaymentPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // order id
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [order, setOrder] = useState(null);
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    if (id) {
      getDataPrivate(`/api/orders/${id}`)
        .then((data) => setOrder(data))
        .catch((err) => {
          message.error('Gagal mengambil data pesanan');
        });
    }
  }, [id]);

  const openNotificationWithIcon = (type, title, description) => {
    api[type]({
      message: title,
      description: description,
    });
  };

  const handleUpload = async () => {
    if (fileList.length === 0) {
      return message.warning('Harap unggah bukti pembayaran terlebih dahulu');
    }
    setUploading(true);
    const formData = new FormData();
    formData.append('order_id', id);
    formData.append('payment_method', 'qris');
    formData.append('status', 'pending');
    formData.append('proof_image', fileList[0]?.originFileObj);
    try {
      await sendDataWithFile('/api/payments', formData);
      setTimeout(() => navigate('/pesanan'), 1500);
      openNotificationWithIcon("success", "Pembayaran QRIS Berhasil!", "Bukti pembayaran berhasil diunggah.");
    } catch (error) {
      openNotificationWithIcon("error", "Pembayaran QRIS Gagal!", "Gagal mengunggah bukti pembayaran.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh', padding: '24px 0' }}>
        <Card style={{ maxWidth: 600, width: '100%', margin: '0 auto', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', padding: '16px 0' }}>
          <Title level={3} style={{ marginBottom: 8 }}>Pembayaran QRIS</Title>
          <Divider style={{ margin: '8px 0' }} />
          <img
            src={qrisImage}
            alt="QRIS QR Code"
            style={{ width: '80%', maxWidth: 220, marginBottom: 8, borderRadius: 8, border: '1px solid #eee' }}
          />
          {order && (
            <>
              <Divider style={{ margin: '8px 0' }} />
              <Title level={4} style={{ marginBottom: 8 }}>Detail Pembayaran</Title>
              <Card style={{ background: "#f5f5f5", marginBottom: 8, padding: 8 }}>
                <Text strong>Order ID: </Text>
                <Text>{order.id}</Text><br />
                <Text strong>Total Pembayaran: </Text>
                <Text type="danger" strong>
                  Rp {order.total_price?.toLocaleString("id-ID")}
                </Text>
              </Card>
            </>
          )}
          <div style={{ marginBottom: 8 }}>
            <Text strong>Scan QR di atas menggunakan aplikasi pembayaran yang mendukung QRIS.</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 13 }}>
              Setelah pembayaran, silakan upload bukti pembayaran di bawah ini.
            </Text>
          </div>
          <Divider style={{ margin: '8px 0' }} />
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
            onClick={handleUpload}
            loading={uploading}
            style={{ marginTop: 12, marginBottom: 6, width: '100%' }}
            disabled={fileList.length === 0}
          >
            Kirim Bukti Pembayaran
          </Button>
          <Button type="default" onClick={() => navigate('/pesanan')} style={{ width: '100%' }}>
            Kembali ke Pesanan
          </Button>
        </Card>
      </div>
    </>
  );
};

export default QRISPaymentPage;