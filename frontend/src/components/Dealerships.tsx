import React, {useState} from 'react';
import {
    Card,
    Form,
    InputNumber,
    Button,
    Select,
    Table,
    Descriptions,
    Typography,
    Row,
    Col,
    message,
    Tag
} from 'antd';
import {EnvironmentOutlined, SearchOutlined} from '@ant-design/icons';
import {dealershipsApi} from '../api/vehiclesApi';
import type {DealershipSearchResult} from '../api/types';

const {Title} = Typography;
const {Option} = Select;

const Dealerships: React.FC = () => {
    const [form] = Form.useForm();
    const [searchResult, setSearchResult] = useState<DealershipSearchResult | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (values: {
        currentLocation: { x: number; y: number };
        vehicleCriteria: any;
        maxDistance: number;
    }) => {
        try {
            setLoading(true);
            const response = await dealershipsApi.findNearestDealership(values);
            setSearchResult(response.data);
            message.success('Dealership found successfully');
        } catch (error: any) {
            message.error(error.response?.data?.message || 'Failed to find dealership');
        } finally {
            setLoading(false);
        }
    };

    const vehicleColumns = [
        {
            title: 'Vehicle',
            dataIndex: 'vehicle',
            key: 'vehicle',
            render: (vehicle: any) => vehicle.name,
        },
        {
            title: 'Type',
            dataIndex: 'vehicle',
            key: 'type',
            render: (vehicle: any) => (
                <Tag color={getFuelTypeColor(vehicle.fuelType)}>
                    {vehicle.fuelType}
                </Tag>
            ),
        },
        {
            title: 'Engine Power',
            dataIndex: 'vehicle',
            key: 'enginePower',
            render: (vehicle: any) => vehicle.enginePower || 'N/A',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (price: number) => `$${price.toLocaleString()}`,
        },
        {
            title: 'Available',
            dataIndex: 'availableCount',
            key: 'availableCount',
        },
        {
            title: 'Delivery',
            dataIndex: 'deliveryTime',
            key: 'deliveryTime',
        },
    ];

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

    return (
        <div>
            <Title level={2}>Find Nearest Dealership</Title>

            <Row gutter={16}>
                <Col span={12}>
                    <Card title="Search Criteria">
                        <Form form={form} layout="vertical" onFinish={handleSearch}>
                            <Title level={5}>Your Location</Title>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name={['currentLocation', 'x']}
                                        label="Coordinate X"
                                        rules={[{required: true, message: 'Please enter X coordinate'}]}
                                        initialValue={100}
                                    >
                                        <InputNumber
                                            placeholder="X coordinate"
                                            style={{width: '100%'}}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name={['currentLocation', 'y']}
                                        label="Coordinate Y"
                                        rules={[{required: true, message: 'Please enter Y coordinate'}]}
                                        initialValue={200}
                                    >
                                        <InputNumber
                                            placeholder="Y coordinate"
                                            style={{width: '100%'}}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Title level={5}>Vehicle Preferences (Optional)</Title>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item name={['vehicleCriteria', 'fuelType']} label="Fuel Type">
                                        <Select placeholder="Any fuel type" allowClear>
                                            <Option value="ELECTRICITY">ELECTRICITY</Option>
                                            <Option value="DIESEL">DIESEL</Option>
                                            <Option value="KEROSENE">KEROSENE</Option>
                                            <Option value="ALCOHOL">ALCOHOL</Option>
                                            <Option value="NUCLEAR">NUCLEAR</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name={['vehicleCriteria', 'vehicleType']} label="Vehicle Type">
                                        <Select placeholder="Any type" allowClear>
                                            <Option value="CAR">CAR</Option>
                                            <Option value="TRUCK">TRUCK</Option>
                                            <Option value="MOTORCYCLE">MOTORCYCLE</Option>
                                            <Option value="BUS">BUS</Option>
                                            <Option value="SPECIAL">SPECIAL</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item
                                name="maxDistance"
                                label="Max Distance (km)"
                                initialValue={500}
                                rules={[{required: true, message: 'Please enter max distance'}]}
                            >
                                <InputNumber min={1} max={1000} style={{width: '100%'}}/>
                            </Form.Item>

                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    icon={<SearchOutlined/>}
                                    loading={loading}
                                    style={{width: '100%'}}
                                    size="large"
                                >
                                    Find Nearest Dealership
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>

                <Col span={12}>
                    {searchResult ? (
                        <Card title="Search Results">
                            <Descriptions title={searchResult.dealership.name} bordered column={1}>
                                <Descriptions.Item label="Address">
                                    {searchResult.dealership.address}
                                </Descriptions.Item>
                                <Descriptions.Item label="Distance">
                                    <Tag color="blue">{searchResult.distance} km</Tag>
                                </Descriptions.Item>
                                <Descriptions.Item label="Travel Time">
                                    <Tag color="green">{searchResult.estimatedTravelTime}</Tag>
                                </Descriptions.Item>
                                <Descriptions.Item label="Phone">
                                    {searchResult.contactInfo.phone}
                                </Descriptions.Item>
                                <Descriptions.Item label="Email">
                                    {searchResult.contactInfo.email}
                                </Descriptions.Item>
                                <Descriptions.Item label="Rating">
                                    <Tag color="gold">{searchResult.rating}/5</Tag>
                                </Descriptions.Item>
                                <Descriptions.Item label="Working Hours">
                                    {searchResult.dealership.workingHours}
                                </Descriptions.Item>
                            </Descriptions>

                            <div style={{marginTop: 24}}>
                                <Title level={4}>Available Vehicles</Title>
                                <Table
                                    columns={vehicleColumns}
                                    dataSource={searchResult.availableVehicles}
                                    rowKey={(record) => record.vehicle.id}
                                    pagination={false}
                                    size="small"
                                />
                            </div>
                        </Card>
                    ) : (
                        <Card title="Ready to Search">
                            <div style={{textAlign: 'center', padding: '40px 0'}}>
                                <EnvironmentOutlined
                                    style={{fontSize: '48px', color: '#1890ff', marginBottom: '16px'}}/>
                                <Title level={4} style={{color: '#666'}}>
                                    Enter your location and preferences to find the nearest dealership
                                </Title>
                                <p style={{color: '#999'}}>
                                    We'll show you available vehicles and contact information
                                </p>
                            </div>
                        </Card>
                    )}
                </Col>
            </Row>
        </div>
    );
};

export default Dealerships;