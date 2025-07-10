import { Layout, Button, Row, Col, Typography, Form, Input, notification } from "antd";
import { useState } from "react";
import { sendData } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import "./register.css";  // Pastikan ini merujuk ke register.css yang telah diperbarui

const { Title, Text } = Typography;
const { Content } = Layout;

const RegisterPage = () => {
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();

  const handleRegister = async (values) => {
    const fullName = `${values.firstName} ${values.lastName}`;
    const payload = {
      name: fullName,
      email: values.email,
      password_hash: values.password,
      phone: values.phone,
    };

    try {
      await sendData("/api/users", payload);
      api.success({
        message: "Pendaftaran Berhasil",
        description: "Silakan login menggunakan akunmu.",
      });
      navigate("/login");
    } catch (err) {
      api.error({
        message: "Pendaftaran Gagal",
        description: err?.response?.data?.error || "Terjadi kesalahan.",
      });
    }
  };

  return (
    <Layout className="register-layout">
      {contextHolder}
      <Content className="register-content">
      <Row className="register-row">
        {/* Panel kiri (Form) */}
        <Col span={12} className="register-left-panel">
          <div className="register-form-container">
            <Title level={2}>Sign Up</Title>

            <Form form={form} layout="vertical" onFinish={handleRegister} className="register-form">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="First Name"
                    name="firstName"
                    rules={[{ required: true, message: "Masukkan nama depan!" }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Last Name"
                    name="lastName"
                    rules={[{ required: true, message: "Masukkan nama belakang!" }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label="Email" name="email" rules={[{ required: true, message: "Masukkan email!" }]}>
                <Input />
              </Form.Item>

              <Form.Item label="Phone Number" name="phone" rules={[{ required: true, message: "Masukkan nomor HP!" }]}>
                <Input />
              </Form.Item>

              <Form.Item label="Password" name="password" rules={[{ required: true, message: "Masukkan password!" }]}>
                <Input.Password />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" className="register-button">
                  Create Account
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Col>

        {/* Panel kanan (Gambar & promosi) */}
        <Col span={12} className="register-right-panel">
          <div className="register-promo-text">
            <Title level={2}>Masuk ke Dunia <br /> Kostum Favoritmu!</Title>
            <Text>
              Temukan ratusan kostum unik dan menarik untuk setiap acara. <br />
              Masuk sekarang untuk memulai pemesananmu!
            </Text>
          </div>
        </Col>
      </Row>
    </Content>
    </Layout>
  );
};

export default RegisterPage;
