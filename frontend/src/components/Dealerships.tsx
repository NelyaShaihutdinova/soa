import React, { useState } from 'react';
import {
  Card,
  Form,
  InputNumber,
  Button,
  Table,
  Typography,
  Row,
  Col,
  message,
  Tag,
} from 'antd';
import { EnvironmentOutlined, SearchOutlined } from '@ant-design/icons';
import { dealershipsApi } from '../api/vehiclesApi';

const { Title } = Typography;

interface DealershipItem {
  id: number;
  name: string;
  coordinates: { x: number; y: number };
  enginePower: number;
  fuelType: string;
  numberOfWheels: number;
  capacity: number;
  creationDate: string;
}

const Dealerships: React.FC = () => {
  const [form] = Form.useForm();
  const [dealerships, setDealerships] = useState<DealershipItem[]>([]);
  const [userLocation, setUserLocation] = useState<{ x: number; y: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (values: { x: number; y: number; maxDistance: number }) => {
    try {
      setLoading(true);
      const response = await dealershipsApi.findNearestDealership(values);

      const data = response.data;

      if (Array.isArray(data)) {
        setDealerships(data);
        setUserLocation({ x: values.x, y: values.y });
        message.success('Results loaded');
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (error: any) {
      const responseData = error.response?.data;

      if (Array.isArray(responseData)) {
        setDealerships(responseData);
        setUserLocation({ x: form.getFieldValue('x'), y: form.getFieldValue('y') });
        message.warning('Partial results loaded (server error)');
      } else {
        message.error(error.response?.data?.message || 'Failed to load dealerships');
        setDealerships([]);
        setUserLocation(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const getFuelTypeColor = (fuelType: string) => {
    const colors: { [key: string]: string } = {
      ELECTRICITY: 'green',
      DIESEL: 'orange',
      KEROSENE: 'blue',
      ALCOHOL: 'purple',
      NUCLEAR: 'red',
    };
    return colors[fuelType] || 'default';
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Coordinates',
      key: 'coordinates',
      render: (_: any, record: DealershipItem) => `(${record.coordinates.x}, ${record.coordinates.y})`,
    },
    {
      title: 'Fuel Type',
      key: 'fuelType',
      render: (_: any, record: DealershipItem) => (
        <Tag color={getFuelTypeColor(record.fuelType)}>{record.fuelType}</Tag>
      ),
    },
    {
      title: 'Engine Power',
      dataIndex: 'enginePower',
      key: 'enginePower',
    },
    {
      title: 'Wheels',
      dataIndex: 'numberOfWheels',
      key: 'numberOfWheels',
    },
    {
      title: 'Capacity',
      dataIndex: 'capacity',
      key: 'capacity',
    },
  ];

  return (
    <div>
      <Title level={2}>Find Nearest Dealerships</Title>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="Search Criteria">
            <Form form={form} layout="vertical" onFinish={handleSearch}>
              <Title level={5}>Your Location</Title>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="x"
                    label="Coordinate X"
                    rules={[{ required: true, message: 'Enter X' }]}
                    initialValue={100}
                  >
                    <InputNumber style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="y"
                    label="Coordinate Y"
                    rules={[{ required: true, message: 'Enter Y' }]}
                    initialValue={200}
                  >
                    <InputNumber style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="maxDistance"
                label="Max Distance (km)"
                initialValue={500}
                rules={[{ required: true, message: 'Enter max distance' }]}
              >
                <InputNumber min={1} max={1000} style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SearchOutlined />}
                  loading={loading}
                  style={{ width: '100%' }}
                  size="large"
                >
                  Find Nearest Dealerships
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col span={12}>
          {dealerships.length > 0 ? (
            <Card title={`Found ${dealerships.length} Dealership(s)`}>
              <div style={{ marginBottom: 24 }}>
                <Title level={5}>Map View</Title>
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: 250,
                    backgroundColor: '#f9f9f9',
                    border: '1px solid #eee',
                    borderRadius: 4,
                    overflow: 'hidden',
                  }}
                >
                  <svg width="100%" height="100%" style={{ position: 'absolute' }}>
                    <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#ddd" />
                    <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#ddd" />
                  </svg>

                  {userLocation && (
                    <div
                      style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 16,
                        height: 16,
                        backgroundColor: '#1890ff',
                        borderRadius: '50%',
                        border: '2px solid white',
                        zIndex: 2,
                      }}
                      title="Your location"
                    />
                  )}

                  {dealerships.map((d) => {
                    const offsetX = (d.coordinates.x - (userLocation?.x || 0)) * 10;
                    const offsetY = -(d.coordinates.y - (userLocation?.y || 0)) * 10;

                    return (
                      <div
                        key={d.id}
                        style={{
                          position: 'absolute',
                          left: `calc(50% + ${offsetX}px)`,
                          top: `calc(50% + ${offsetY}px)`,
                          width: 20,
                          height: 20,
                          backgroundColor: '#52c41a',
                          borderRadius: '50%',
                          border: '2px solid white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: 10,
                          fontWeight: 'bold',
                          zIndex: 1,
                        }}
                        title={`${d.name} (${d.coordinates.x}, ${d.coordinates.y})`}
                      >
                      </div>
                    );
                  })}
                </div>
              </div>

              <Table
                columns={columns}
                dataSource={dealerships}
                rowKey="id"
                pagination={{ pageSize: 5 }}
                size="small"
              />
            </Card>
          ) : (
            <Card title="Ready to Search">
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <EnvironmentOutlined
                  style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }}
                />
                <Title level={4} style={{ color: '#666' }}>
                  Enter your location to find dealerships
                </Title>
              </div>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default Dealerships;