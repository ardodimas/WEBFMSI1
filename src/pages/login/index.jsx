import {
  Layout,
  Button,
  Row,
  Col,
  Typography,
  Form,
  Input,
  notification,
} from "antd";
import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";
import { GoogleOutlined, TwitterOutlined, FacebookOutlined } from "@ant-design/icons";
import { sendData } from "../../utils/api";
import "../Register/index";
import "./login.css";

const { Title, Text } = Typography;
const { Content } = Layout;

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [api, contextHolder] = notification.useNotification();
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    const payload = { email, password };
    try {
      const resp = await sendData("/api/login", payload);
      if (resp?.access_token) {
        login(resp.access_token);
        // Redirect akan ditangani di AuthProvider berdasarkan role
      } else {
        throw new Error("Invalid credentials");
      }
    } catch {
      api.error({
        message: "Login Gagal",
        description: "Email atau password salah.",
      });
    }
  };

  return (
    <Layout className="login-layout">
      {contextHolder}
      <Content className="login-content">
      <Row className="login-row">
        {/* Panel Kiri */}
        <Col span={12} className="login-left-panel">
          <div className="promo-text">
            <Title level={2}>Masuk ke Dunia <br /> Kostum Favoritmu!</Title>
            <Text>
              Temukan ratusan kostum unik dan menarik untuk setiap acara. <br />
              Masuk sekarang untuk memulai pemesananmu!
            </Text>
          </div>
        </Col>

        {/* Panel Kanan */}
        <Col span={12} className="login-right-panel">
          <div className="login-form-container">
            <Title level={3}>Sign In</Title>
            <Form layout="vertical" onFinish={handleLogin} className="login-form">
              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: "Masukkan email Anda!" }]}
              >
                <Input value={email} onChange={(e) => setEmail(e.target.value)} />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: "Masukkan password Anda!" }]}
              >
                <Input.Password value={password} onChange={(e) => setPassword(e.target.value)} />
              </Form.Item>

              <Row justify="space-between" className="login-links">
                {/* <Text type="secondary" className="forgot-password">Lupa kata sandi?</Text> */}
                <Text type="secondary">
                  Belum memiliki akun? <Link to="/register" className="login-register-link">Daftar</Link>
                </Text>
              </Row>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-button"
                  disabled={!email || !password}
                >
                  Login
                </Button>
              </Form.Item>
            </Form>
{/* 
            <div className="login-divider">
              <span>Or sign up with</span>
            </div>

            <div className="social-icons">
              <GoogleOutlined />
              <TwitterOutlined />
              <FacebookOutlined />
            </div> */}
          </div>
        </Col>
      </Row>
    </Content>
    </Layout>
  );
};

export default LoginPage;
