import { Row, Col, Card, Button, Typography, Carousel } from 'antd';
import { 
  EnvironmentOutlined, 
  SafetyOutlined, 
  TeamOutlined, 
  StarOutlined,
  RightOutlined
} from '@ant-design/icons';
import './Home.css';

const { Title, Text } = Typography;

const Home = () => {
  const features = [
    {
      icon: <EnvironmentOutlined style={{ fontSize: '32px', color: '#a7374a' }} />,
      title: 'Destinasi Terbaik',
      description: 'Temukan destinasi wisata terbaik di Indonesia'
    },
    {
      icon: <SafetyOutlined style={{ fontSize: '32px', color: '#a7374a' }} />,
      title: 'Aman & Terpercaya',
      description: 'Perjalanan aman dengan layanan terpercaya'
    },
    {
      icon: <TeamOutlined style={{ fontSize: '32px', color: '#a7374a' }} />,
      title: 'Pemandu Profesional',
      description: 'Didampingi pemandu wisata profesional'
    }
  ];

  const recommendations = [
    {
      id: 1,
      title: 'Gunung Bromo',
      location: 'Jawa Timur',
      rating: 4.8,
      image: 'https://i.pinimg.com/736x/d5/35/7d/d5357dd76c4ed89933038b75f5115194.jpg',
      price: 'Rp 500.000'
    },
    {
      id: 2,
      title: 'Pantai Kuta',
      location: 'Bali',
      rating: 4.7,
      image: 'https://i.pinimg.com/736x/d5/35/7d/d5357dd76c4ed89933038b75f5115194.jpg',
      price: 'Rp 750.000'
    },
    {
      id: 3,
      title: 'Danau Toba',
      location: 'Sumatera Utara',
      rating: 4.9,
      image: 'https://i.pinimg.com/736x/d5/35/7d/d5357dd76c4ed89933038b75f5115194.jpg',
      price: 'Rp 1.000.000'
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <div className="hero-section">
        <Carousel autoplay>
          <div className="hero-slide">
            <div className="hero-content">
              <Title level={1}>Jelajahi Keindahan Indonesia</Title>
              <Text className="hero-description">
                Temukan pengalaman wisata tak terlupakan dengan layanan terbaik kami
              </Text>
              <Button type="primary" size="large" className="hero-button">
                Jelajahi Sekarang
              </Button>
            </div>
          </div>
          <div className="hero-slide">
            <div className="hero-content">
              <Title level={1}>Petualangan Menanti</Title>
              <Text className="hero-description">
                Dari pegunungan hingga pantai, kami siap menemani perjalanan Anda
              </Text>
              <Button type="primary" size="large" className="hero-button">
                Mulai Petualangan
              </Button>
            </div>
          </div>
        </Carousel>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <Row gutter={[24, 24]}>
          {features.map((feature, index) => (
            <Col xs={24} md={8} key={index}>
              <Card bordered={false} className="feature-card">
                {feature.icon}
                <Title level={4}>{feature.title}</Title>
                <Text>{feature.description}</Text>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Recommendations Section */}
      <div className="recommendations-section">
        <div className="section-header">
          <Title level={2}>Rekomendasi Destinasi</Title>
          <Button type="link" className="view-all">
            Lihat Semua <RightOutlined />
          </Button>
        </div>
        <Row gutter={[24, 24]}>
          {recommendations.map((item) => (
            <Col xs={24} sm={12} md={8} key={item.id}>
              <Card
                hoverable
                cover={
                  <div className="recommendation-image">
                    <img alt={item.title} src={item.image} />
                  </div>
                }
                className="recommendation-card"
              >
                <div className="recommendation-content">
                  <Title level={4}>{item.title}</Title>
                  <Text className="location">{item.location}</Text>
                  <div className="recommendation-footer">
                    <div className="rating">
                      <StarOutlined /> {item.rating}
                    </div>
                    <Text className="price">{item.price}</Text>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default Home; 