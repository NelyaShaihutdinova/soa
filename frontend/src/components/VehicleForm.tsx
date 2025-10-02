import React from 'react';
import {Form, Input, InputNumber, Select, Button, Space, Row, Col} from 'antd';
import type {Vehicle, VehicleCreate, VehicleUpdate} from '../api/types';

const {Option} = Select;

interface VehicleFormProps {
    initialValues?: Vehicle;
    onSubmit: (values: VehicleCreate | VehicleUpdate) => void;
    onCancel: () => void;
    isEditing?: boolean;
}

const VehicleForm: React.FC<VehicleFormProps> = ({initialValues, onSubmit, onCancel, isEditing = false}) => {
    const [form] = Form.useForm();

    const handleSubmit = (values: any) => {
        onSubmit(values);
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={initialValues}
        >
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[{required: true, message: 'Please enter vehicle name'}]}
                    >
                        <Input placeholder="Vehicle name"/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="fuelType"
                        label="Fuel Type"
                        rules={[{required: true, message: 'Please select fuel type'}]}
                    >
                        <Select placeholder="Select fuel type">
                            <Option value="ELECTRICITY">ELECTRICITY</Option>
                            <Option value="DIESEL">DIESEL</Option>
                            <Option value="KEROSENE">KEROSENE</Option>
                            <Option value="ALCOHOL">ALCOHOL</Option>
                            <Option value="NUCLEAR">NUCLEAR</Option>
                        </Select>
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={8}>
                    <Form.Item
                        name={['coordinates', 'x']}
                        label="Coordinate X"
                        rules={[{required: true, message: 'Please enter X coordinate'}]}
                    >
                        <InputNumber
                            placeholder="X coordinate"
                            style={{width: '100%'}}
                        />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        name={['coordinates', 'y']}
                        label="Coordinate Y"
                        rules={[{required: true, message: 'Please enter Y coordinate'}]}
                    >
                        <InputNumber
                            placeholder="Y coordinate"
                            style={{width: '100%'}}
                        />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        name="capacity"
                        label="Capacity"
                        rules={[{required: true, message: 'Please enter capacity'}]}
                    >
                        <InputNumber
                            placeholder="Capacity"
                            min={0}
                            step={0.1}
                            style={{width: '100%'}}
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item name="enginePower" label="Engine Power">
                        <InputNumber
                            placeholder="Engine power"
                            min={1}
                            style={{width: '100%'}}
                        />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item name="numberOfWheels" label="Number of Wheels">
                        <InputNumber
                            placeholder="Number of wheels"
                            min={1}
                            style={{width: '100%'}}
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item>
                <Space>
                    <Button type="primary" htmlType="submit">
                        {isEditing ? 'Update' : 'Create'}
                    </Button>
                    <Button onClick={onCancel}>
                        Cancel
                    </Button>
                </Space>
            </Form.Item>
        </Form>
    );
};

export default VehicleForm;