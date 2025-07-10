import {
  Col,
  Row,
  Typography,
  Card,
  FloatButton,
  Drawer,
  Form,
  Input,
  Button,
  notification,
  Popconfirm,
  Select,
  InputNumber,
  Space,
  Divider,
  Image,
  Tag,
  List
} from "antd";
import { useEffect, useState, useContext } from "react";
import {
  deleteData,
  getData,
  sendData,
  editDataPrivatePut,
} from "../../utils/api";
import {
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import { AuthContext } from "../../providers/AuthProvider";
import './katalog-admin.css';

const { Title, Text } = Typography;
const { Option } = Select;

const KatalogAdmin = () => {
  const { isLoggedIn, userProfile } = useContext(AuthContext);
  const [dataSources, setDataSources] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [idSelected, setIdSelected] = useState(null);
  const [totalSizeStock, setTotalSizeStock] = useState(0);

  const [InputCostume] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();

  const openNotificationWithIcon = (type, title, msg) => {
    api[type]({
      message: title,
      description: msg,
    });
  };

  useEffect(() => {
    if (!isLoggedIn || userProfile?.role !== "admin") {
      window.location.href = "/login";
      return;
    }
    fetchCostumes();
    fetchCategories();
    fetchSizes();
  }, [isLoggedIn, userProfile]);

  const fetchCostumes = () => {
    setIsLoading(true);
    getData("/api/costumes")
      .then((resp) => {
        if (Array.isArray(resp)) {
          setDataSources(resp);
        } else if (Array.isArray(resp?.datas)) {
          setDataSources(resp.datas);
        } else {
          setDataSources([]);
        }
      })
      .catch(() => {
        openNotificationWithIcon("error", "Error", "Gagal memuat data kostum");
      })
      .finally(() => setIsLoading(false));
  };

  const fetchCategories = () => {
    getData("/api/categories")
      .then((resp) => {
        if (Array.isArray(resp)) {
          setCategories(resp);
        } else if (Array.isArray(resp?.datas)) {
          setCategories(resp.datas);
        }
      })
      .catch(() => {
        console.log("Gagal memuat kategori");
      });
  };

  const fetchSizes = () => {
    getData("/api/sizes")
      .then((resp) => {
        if (Array.isArray(resp)) {
          setSizes(resp);
        } else if (Array.isArray(resp?.datas)) {
          setSizes(resp.datas);
        }
      })
      .catch(() => {
        console.log("Gagal memuat ukuran");
      });
  };

  const handleDrawer = () => {
    setIsOpenDrawer(true);
  };

  const handleCloseDrawer = () => {
    if (isEdit) {
      setIsEdit(false);
      setIdSelected(null);
    }
    setIsOpenDrawer(false);
    InputCostume.resetFields();
    setTotalSizeStock(0);
  };

  const handleDelete = (item) => {
    deleteData(`/api/costumes/${item.id}`)
      .then((resp) => {
        if (resp?.status === 200) {
          fetchCostumes();
          openNotificationWithIcon(
            "success",
            "Hapus Kostum",
            "Kostum berhasil dihapus"
          );
        } else {
          openNotificationWithIcon(
            "error",
            "Hapus Kostum",
            "Gagal menghapus kostum"
          );
        }
      })
      .catch(() => {
        openNotificationWithIcon(
          "error",
          "Hapus Kostum",
          "Terjadi kesalahan saat menghapus kostum"
        );
      });
  };

  const handleDrawerEdit = (record) => {
    setIsOpenDrawer(true);
    setIsEdit(true);
    setIdSelected(record?.id);
    InputCostume.setFieldsValue({
      name: record?.name,
      description: record?.description,
      category_id: record?.category_id,
      price_per_day: record?.price_per_day,
      image_url: record?.image_url,
      status: record?.status,
      sizes: record?.sizes || [],
    });

    const total = (record?.sizes || []).reduce(
      (acc, curr) => acc + (parseInt(curr?.stock) || 0),
      0
    );
    setTotalSizeStock(total);
  };

  const handleSubmit = async () => {
    try {
      const values = await InputCostume.validateFields();

      const costumeData = {
        name: values.name,
        description: values.description,
        category_id: parseInt(values.category_id),
        price_per_day: parseInt(values.price_per_day),
        status: values.status,
        image_url: values.image_url,
        sizes: values.sizes || [],
        stock: totalSizeStock,
      };

      const url = isEdit
        ? `/api/costumes/${idSelected}`
        : "/api/costumes";
      const method = isEdit ? editDataPrivatePut : sendData;
      const msg = isEdit
        ? "Sukses memperbarui kostum"
        : "Sukses menambah kostum";

      const resp = await method(url, costumeData);

      if (resp?.datas || resp?.id) {
        openNotificationWithIcon("success", "Data Kostum", msg);
        fetchCostumes();
        InputCostume.resetFields();
        handleCloseDrawer();
      } else {
        openNotificationWithIcon(
          "error",
          "Data Kostum",
          "Data gagal dikirim"
        );
      }
    } catch (error) {
      console.error("Submit error:", error);
      openNotificationWithIcon("error", "Server Error", "Gagal mengirim data");
    }
  };

  return (
    <div className="layout-content">
      {contextHolder}
      <Row gutter={[24, 0]}>
        <Col xs={23} className="mb-24">
          <Card bordered={false}>
            <div className="header-section">
              <Title level={2} className="gradient-text">Manajemen Kostum</Title>
            </div>
            <FloatButton
              shape="circle"
              type="primary"
              icon={<PlusCircleOutlined />}
              onClick={handleDrawer}
            />
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
              className="katalog-container"
              loading={isLoading}
              dataSource={dataSources}
              renderItem={(item) => (
                <List.Item key={item.id}>
                  <div className="card-wrapper">
                    <Card
                      style={{
                        borderRadius: "15px",
                        overflow: "hidden",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                      }}
                      hoverable
                      cover={
                        <div style={{ width: "100%", paddingTop: "100%", position: "relative" }}>
                          <img
                            alt={item.name}
                            src={item.image_url}
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
                            }}
                          />
                        </div>
                      }
                      actions={[
                        <EditOutlined key="edit" onClick={() => handleDrawerEdit(item)} />,
                        <Popconfirm
                          key="delete"
                          title={`Apakah Anda yakin ingin menghapus ${item?.name} ini?`}
                          onConfirm={() => handleDelete(item)}
                        >
                          <DeleteOutlined />
                        </Popconfirm>,
                      ]}
                    >
                      <div className="kostum-content">
                        <div className="kostum-title">{item.name}</div>
                        <div className="kostum-description">{item.description}</div>
                        <div className="kostum-footer">
                          <Tag color={item.status === "available" ? "green" : "red"}>
                            {item.status === "available" ? "Tersedia" : "Tidak Tersedia"}
                          </Tag>
                          <br />
                          <Text strong>
                            Rp {item.price_per_day?.toLocaleString("id-ID")}/hari
                          </Text>
                          <br />
                          <Text type="secondary">Stok: {item.stock}</Text>
                        </div>
                      </div>
                    </Card>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      <Drawer
        title={isEdit ? "Edit Kostum" : "Tambah Kostum"}
        onClose={handleCloseDrawer}
        open={isOpenDrawer}
        width={600}
        extra={
          <Space>
            <Button onClick={handleCloseDrawer}>Batal</Button>
            <Button
              type="primary"
              onClick={handleSubmit}
              disabled={totalSizeStock === 0}
            >
              {isEdit ? "Update" : "Tambah"}
            </Button>
          </Space>
        }
      >
        <Form
          form={InputCostume}
          layout="vertical"
          autoComplete="off"
          onValuesChange={(changedValues, allValues) => {
            const sizes = allValues?.sizes || [];
            const total = sizes.reduce(
              (acc, curr) => acc + (parseInt(curr?.stock) || 0),
              0
            );
            setTotalSizeStock(total);
          }}
        >
          <Form.Item
            label="Nama Kostum"
            name="name"
            rules={[{ required: true, message: "Nama kostum harus diisi!" }]}
          >
            <Input placeholder="Contoh: Kostum Frieren" />
          </Form.Item>

          <Form.Item
            label="Deskripsi"
            name="description"
            rules={[{ required: true, message: "Deskripsi harus diisi!" }]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Deskripsi lengkap kostum termasuk aksesoris yang disertakan"
            />
          </Form.Item>

          <Form.Item
            label="Kategori"
            name="category_id"
            rules={[{ required: true, message: "Kategori harus dipilih!" }]}
          >
            <Select placeholder="Pilih kategori">
              {categories.map((cat) => (
                <Option key={cat.id} value={cat.id}>
                  {cat.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Harga per Hari"
            name="price_per_day"
            rules={[{ required: true, message: "Harga harus diisi!" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              placeholder="350000"
              formatter={(value) =>
                `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\Rp\s?|(,*)/g, "")}
            />
          </Form.Item>

          <Form.Item
            label="URL Gambar"
            name="image_url"
            rules={[{ required: true, message: "URL gambar harus diisi!" }]}
          >
            <Input placeholder="https://example.com/img.jpg" />
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: "Status harus dipilih!" }]}
          >
            <Select placeholder="Pilih status">
              <Option value="available">Tersedia</Option>
              <Option value="unavailable">Tidak Tersedia</Option>
            </Select>
          </Form.Item>

          <Divider>Detail Ukuran</Divider>

          <Form.List name="sizes">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    style={{ display: "flex", marginBottom: 8 }}
                    align="baseline"
                  >
                    <Form.Item
                      {...restField}
                      name={[name, "size_id"]}
                      rules={[{ required: true, message: "Ukuran harus dipilih!" }]}
                    >
                      <Select placeholder="Pilih ukuran" style={{ width: 120 }}>
                        {sizes.map((size) => (
                          <Option key={size.id} value={size.id}>
                            {size.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "stock"]}
                      rules={[{ required: true, message: "Stok harus diisi!" }]}
                    >
                      <InputNumber
                        placeholder="Stok"
                        min={0}
                        style={{ width: 100 }}
                      />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Tambah Ukuran
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Text type="secondary">
            Total Stok Otomatis: <b>{totalSizeStock}</b>
          </Text>
        </Form>
      </Drawer>
    </div>
  );
};

export default KatalogAdmin;