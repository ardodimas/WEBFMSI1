import React, { useState } from 'react';
import { Card, Typography, Button, Upload, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { UploadOutlined } from '@ant-design/icons';
import { sendDataWithFile } from '../../utils/api';
import qrisImage from '../../assets/title.jpg';

const { Title, Text } = Typography;

const QRISPaymentPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // order id
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);

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
      message.success('Bukti pembayaran berhasil diunggah');
      setTimeout(() => navigate('/pesanan'), 1500);
    } catch (error) {
      message.error('Gagal mengunggah bukti pembayaran');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <Card style={{ maxWidth: 400, width: '100%', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
        <Title level={3} style={{ marginBottom: 16 }}>Pembayaran QRIS</Title>
        <img
          src={qrisImage}
          alt="QRIS QR Code"
          style={{ width: '90%', maxWidth: 320, marginBottom: 16, borderRadius: 8, border: '1px solid #eee' }}
        />
        <div style={{ marginBottom: 16 }}>
          <Text strong>Scan QR di atas menggunakan aplikasi pembayaran yang mendukung QRIS.</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 13 }}>
            Setelah pembayaran, silakan upload bukti pembayaran di bawah ini.
          </Text>
        </div>
        <div style={{ marginBottom: 16 }}>
          <Upload
            beforeUpload={() => false}
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
            accept="image/*"
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Pilih Bukti Pembayaran</Button>
          </Upload>
        </div>
        <Button
          type="primary"
          onClick={handleUpload}
          loading={uploading}
          style={{ marginBottom: 16, width: '100%' }}
        >
          Kirim Bukti Pembayaran
        </Button>
        <Button type="default" onClick={() => navigate('/pesanan')} style={{ width: '100%' }}>
          Kembali ke Pesanan
        </Button>
      </Card>
    </div>
  );
};

export default QRISPaymentPage; 