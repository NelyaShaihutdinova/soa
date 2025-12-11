import React from 'react';
import {Form, Input, Select, InputNumber, Button, Row, Col, Space} from 'antd';
import {SearchOutlined, ReloadOutlined} from '@ant-design/icons';
import {useDispatch, useSelector} from 'react-redux';
import type {AppDispatch, RootState} from '../store';
import {setFilters} from '../store/vehiclesSlice';

const {Option} = Select;

const VehicleFilters: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {filters} = useSelector((state: RootState) => state.vehicles);
    const [form] = Form.useForm();

    const handleSearch = (values: any) => {
        dispatch(setFilters({...values, page: 1}));
    };

    const handleReset = () => {
        form.resetFields();
        dispatch(setFilters({
            page: 1,
            size: 20,
            sort: 'id',
            order: 'asc',
            name: undefined,
            fuelType: undefined,
            minEnginePower: undefined,
            maxEnginePower: undefined,
            minWheels: undefined,
            maxWheels: undefined,
            minCapacity: undefined,
            maxCapacity: undefined,
        }));
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleSearch}
            initialValues={{
                ...filters,
                sort: filters.sort || 'id',
                order: filters.order || 'asc'
            }}
        >
            <Row gutter={16}>
                <Col span={4}>
                    <Form.Item name="name" label="Name">
                        <Input placeholder="Search by name"/>
                    </Form.Item>
                </Col>
                <Col span={4}>
                    <Form.Item name="fuelType" label="Fuel Type">
                        <Select placeholder="Select fuel type" allowClear>
                            <Option value="ELECTRICITY">ELECTRICITY</Option>
                            <Option value="DIESEL">DIESEL</Option>
                            <Option value="KEROSENE">KEROSENE</Option>
                            <Option value="ALCOHOL">ALCOHOL</Option>
                            <Option value="NUCLEAR">NUCLEAR</Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={3}>
                    <Form.Item name="minEnginePower" label="Min Power">
                        <InputNumber
                            placeholder="Min power"
                            min={1}
                            style={{width: '100%'}}
                        />
                    </Form.Item>
                </Col>
                <Col span={3}>
                    <Form.Item name="maxEnginePower" label="Max Power">
                        <InputNumber
                            placeholder="Max power"
                            min={1}
                            style={{width: '100%'}}
                        />
                    </Form.Item>
                </Col>
                <Col span={2}>
                    <Form.Item name="minWheels" label="Min Wheels">
                        <InputNumber
                            placeholder="Min"
                            min={1}
                            style={{width: '100%'}}
                        />
                    </Form.Item>
                </Col>
                <Col span={2}>
                    <Form.Item name="maxWheels" label="Max Wheels">
                        <InputNumber
                            placeholder="Max"
                            min={1}
                            style={{width: '100%'}}
                        />
                    </Form.Item>
                </Col>
                <Col span={3}>
                    <Form.Item name="sort" label="Sort By">
                        <Select style={{width: '100%'}}>
                            <Option value="id">ID</Option>
                            <Option value="name">Name</Option>
                            <Option value="enginePower">Engine Power</Option>
                            <Option value="numberOfWheels">Wheels</Option>
                            <Option value="capacity">Capacity</Option>
                            <Option value="creationDate">Created</Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={3}>
                    <Form.Item name="order" label="Order">
                        <Select style={{width: '100%'}}>
                            <Option value="asc">Asc</Option>
                            <Option value="desc">Desc</Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={2} style={{display: 'flex', alignItems: 'flex-end'}}>
                    <Form.Item>
                        <Space>
                            <Button onClick={handleReset} icon={<ReloadOutlined/>}>
                                Reset
                            </Button>
                            <Button type="primary" htmlType="submit" icon={<SearchOutlined/>}>
                                Search
                            </Button>
                        </Space>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
};

export default VehicleFilters;