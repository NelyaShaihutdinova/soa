import React, {useState} from 'react';
import {Card, Form, InputNumber, Button, Table, Tag, Typography, Row, Col, notification} from 'antd';
import {SearchOutlined, PlusOutlined} from '@ant-design/icons';
import {shopApi} from '../api/vehiclesApi';
import type {Vehicle} from '../api/types';

const {Title} = Typography;

const Shop: React.FC = () => {
    const [searchForm] = Form.useForm();
    const [wheelsForm] = Form.useForm();
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(false);

    const handlePowerSearch = async (values: { from: number; to: number }) => {
        try {
            setLoading(true);
            const response = await shopApi.searchByEnginePower(values.from, values.to);
            setVehicles(response.data);
            notification.success({message: `Found ${response.data.length} vehicles`});
        } catch (error) {
            notification.error({message: 'Failed to search vehicles'});
        } finally {
            setLoading(false);
        }
    };

    const handleAddWheels = async (values: { vehicleId: number; numberOfWheels: number }) => {
        try {
            const response = await shopApi.addWheels(values.vehicleId, values.numberOfWheels);
            notification.success({message: 'Wheels added successfully'});

            setVehicles(prev => prev.map(v =>
                v.id === values.vehicleId ? response.data : v
            ));

            wheelsForm.resetFields();
        } catch (error) {
            notification.error({message: 'Failed to add wheels'});
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
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
            render: (wheels: number) => wheels || 'N/A',
        },
        {
            title: 'Capacity',
            dataIndex: 'capacity',
            key: 'capacity',
        },
        {
            title: 'Fuel Type',
            dataIndex: 'fuelType',
            key: 'fuelType',
            render: (fuelType: string) => (
                <Tag color={getFuelTypeColor(fuelType)}>{fuelType}</Tag>
            ),
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
            <Title level={2}>Shop Operations</Title>

            <Row gutter={16}>
                <Col span={12}>
                    <Card title="Search by Engine Power" style={{marginBottom: 16}}>
                        <Form form={searchForm} layout="vertical" onFinish={handlePowerSearch}>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="from"
                                        label="Min Power"
                                        rules={[{required: true, message: 'Please enter minimum power'}]}
                                    >
                                        <InputNumber
                                            placeholder="From"
                                            min={1}
                                            style={{width: '100%'}}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="to"
                                        label="Max Power"
                                        rules={[{required: true, message: 'Please enter maximum power'}]}
                                    >
                                        <InputNumber
                                            placeholder="To"
                                            min={1}
                                            style={{width: '100%'}}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" icon={<SearchOutlined/>} loading={loading}>
                                    Search
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>

                <Col span={12}>
                    <Card title="Add Wheels to Vehicle">
                        <Form form={wheelsForm} layout="vertical" onFinish={handleAddWheels}>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="vehicleId"
                                        label="Vehicle ID"
                                        rules={[{required: true, message: 'Please enter vehicle ID'}]}
                                    >
                                        <InputNumber
                                            placeholder="Vehicle ID"
                                            min={1}
                                            style={{width: '100%'}}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="numberOfWheels"
                                        label="Wheels to Add"
                                        rules={[{required: true, message: 'Please enter number of wheels'}]}
                                    >
                                        <InputNumber
                                            placeholder="Wheels"
                                            min={1}
                                            style={{width: '100%'}}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" icon={<PlusOutlined/>}>
                                    Add Wheels
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>

            {vehicles.length > 0 && (
                <Card title="Search Results" style={{marginTop: 16}}>
                    <Table
                        columns={columns}
                        dataSource={vehicles}
                        rowKey="id"
                        loading={loading}
                        pagination={false}
                    />
                </Card>
            )}
        </div>
    );
};

export default Shop;