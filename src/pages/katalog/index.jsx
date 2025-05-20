import { Col, Row, Typography, Card, List, FloatButton, Drawer, Form, Input, Button, notification, message, Space, ConfigProvider} from "antd";
import { DeleteOutlined, EditOutlined, PlusCircleOutlined, SearchOutlined, FilterOutlined, InfoCircleOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";

const { Title, Text } = Typography;
const { Search } = Input;

const Katalog = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [dataSources, setDataSources] = useState([]);
  const [api, contextHolder] = notification.useNotification();
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    // Data dummy untuk testing
    const dummyData = [
      {
        id: 1,
        name_natures: "Gunung Bromo",
        description: "Gunung berapi aktif di Jawa Timur",
        url_photo: "https://i.pinimg.com/736x/d5/35/7d/d5357dd76c4ed89933038b75f5115194.jpg"
      },
      {
        id: 2,
        name_natures: "Gunung Bromo",
        description: "Gunung berapi aktif di Jawa Timur",
        url_photo: "https://i.pinimg.com/736x/d5/35/7d/d5357dd76c4ed89933038b75f5115194.jpg"
      },
      {
        id: 3,
        name_natures: "Gunung Bromo",
        description: "Gunung berapi aktif di Jawa Timur",
        url_photo: "https://i.pinimg.com/736x/d5/35/7d/d5357dd76c4ed89933038b75f5115194.jpg"
      },
      {
        id: 4,
        name_natures: "Gunung Bromo",
        description: "Gunung berapi aktif di Jawa Timur",
        url_photo: "https://i.pinimg.com/736x/d5/35/7d/d5357dd76c4ed89933038b75f5115194.jpg"
      },
      {
        id: 5,
        name_natures: "Gunung Bromo",
        description: "Gunung berapi aktif di Jawa Timur",
        url_photo: "https://i.pinimg.com/736x/d5/35/7d/d5357dd76c4ed89933038b75f5115194.jpg"
      },

    ];
    
    setDataSources(dummyData);
  }, []);

  const handleSearch = (value) => {
    setSearchText(value);
    // Implementasi pencarian bisa ditambahkan di sini
  };

  const handleFilter = () => {
    // Implementasi filter bisa ditambahkan di sini
    message.info('Fitur filter akan segera hadir');
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#a7374a',
        },
      }}
    >
      <div className="layout-content">
        {contextHolder}
        <Row gutter={[24, 0]}>
          <Col xs={23} className="mb-24">
            <Card bordered={false} className="circlebox h-full w-full">
              <div style={{ marginBottom: '20px' }}>
                <Space.Compact style={{ width: '100%' }}>
                  <Search
                    placeholder="Cari katalog..."
                    allowClear
                    enterButton={<SearchOutlined />}
                    size="large"
                    onSearch={handleSearch}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ width: 'calc(100% - 50px)' }}
                  />
                  <Button 
                    type="primary" 
                    icon={<FilterOutlined />} 
                    size="large"
                    onClick={handleFilter}
                    style={{ width: '50px' }}
                  />
                </Space.Compact>
              </div>

              {isLoading ? (
                <div>Sedang menunggu data</div>
              ) : (
                <List
                  grid={{
                    gutter: 16,
                    xs: 1,
                    sm: 1,
                    md: 2,
                    lg: 4,
                    xl: 4,
                    xxl: 4,
                  }}
                  dataSource={dataSources}
                  renderItem={(item) => (
                    <List.Item key={item.id}>
                      <Card
                        style={{
                          borderRadius: '15px',
                          overflow: 'hidden',
                          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                        }}
                        styles={{ body: { padding: '16px' } }}
                        cover={
                          <div style={{ width: '100%', paddingTop: '100%', position: 'relative' }}>
                            <img
                              src={item.url_photo}
                              alt="categories-image"
                              style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                              }}
                            />
                          </div>
                        }
                        actions={[
                          <Button 
                            type="text" 
                            icon={<InfoCircleOutlined />}
                            onClick={() => message.info('Detail akan segera hadir')}
                            style={{ color: '#a7374a' }}
                          >
                            Detail
                          </Button>,
                          <Button 
                            type="primary" 
                            icon={<ShoppingCartOutlined />}
                            onClick={() => message.success('Berhasil ditambahkan ke keranjang')}
                          >
                            Checkout
                          </Button>
                        ]}
                      >
                        <Card.Meta
                          title={item.name_natures}
                          description={item.description}
                        />
                      </Card>
                    </List.Item>
                  )}
                />
              )}
            </Card>
          </Col>
        </Row>
      </div>
    </ConfigProvider>
  );
};

export default Katalog;