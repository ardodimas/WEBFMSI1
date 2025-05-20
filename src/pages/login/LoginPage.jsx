// src/pages/LoginPage.jsx
import { useState } from "react";
import { Form, Input, Button, Card, message } from "antd";
import { loginUser } from "../../services/authService";

const LoginPage = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    const { email, password } = values;

    const result = await loginUser(email, password);

    setLoading(false);
    if (result.success) {
      message.success(`Selamat datang, ${result.user.name}`);
      // Simpan user di localStorage (sementara)
      localStorage.setItem("user", JSON.stringify(result.user));
      // Redirect ke dashboard
      window.location.href = "/katalog";
    } else {
      message.error(result.message);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#f0f2f5" }}>
      <Card title="Login Admin" style={{ width: 400 }}>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Email" name="email" rules={[{ required: true, message: "Masukkan email Anda!" }]}>
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item label="Password" name="password" rules={[{ required: true, message: "Masukkan password Anda!" }]}>
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
