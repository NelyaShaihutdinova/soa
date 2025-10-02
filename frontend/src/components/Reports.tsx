import React, {useState} from 'react';
import {
    Card,
    Form,
    InputNumber,
    Button,
    Table,
    Descriptions,
    Typography,
    Row,
    Col,
    message,
    Tag,
    Statistic
} from 'antd';
import {FileTextOutlined} from '@ant-design/icons';
import {reportsApi} from '../api/vehiclesApi';
import type {MaintenanceReport} from '../api/types';

const {Title} = Typography;

const Reports: React.FC = () => {
    const [form] = Form.useForm();
    const [report, setReport] = useState<MaintenanceReport | null>(null);
    const [loading, setLoading] = useState(false);

    const handleGetReport = async (values: { vehicleId: number }) => {
        try {
            setLoading(true);
            const response = await reportsApi.getMaintenanceReport(values.vehicleId);
            setReport(response.data);
            message.success('Report generated successfully');
        } catch (error) {
            message.error('Failed to generate report');
        } finally {
            setLoading(false);
        }
    };

    const maintenanceColumns = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (date: string) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Mileage',
            dataIndex: 'mileage',
            key: 'mileage',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Cost',
            dataIndex: 'cost',
            key: 'cost',
            render: (cost: number) => `$${cost.toFixed(2)}`,
        },
        {
            title: 'Technician',
            dataIndex: 'technician',
            key: 'technician',
        },
        {
            title: 'Duration',
            dataIndex: 'durationHours',
            key: 'durationHours',
            render: (hours: number) => `${hours}h`,
        },
    ];

    return (
        <div>
            <Title level={2}>Maintenance Reports</Title>

            <Row gutter={16}>
                <Col span={8}>
                    <Card title="Generate Report">
                        <Form form={form} layout="vertical" onFinish={handleGetReport}>
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
                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    icon={<FileTextOutlined/>}
                                    loading={loading}
                                    style={{width: '100%'}}
                                >
                                    Generate Report
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>

                <Col span={16}>
                    {report && (
                        <Card title={`Maintenance Report for ${report.vehicleInfo.name}`}>
                            <Row gutter={16} style={{marginBottom: 24}}>
                                <Col span={6}>
                                    <Statistic
                                        title="Total Maintenance Count"
                                        value={report.totalMaintenanceCount}
                                    />
                                </Col>
                                <Col span={6}>
                                    <Statistic
                                        title="Total Cost"
                                        value={report.totalCost || 0}
                                        prefix="$"
                                        precision={2}
                                    />
                                </Col>
                                <Col span={6}>
                                    <Statistic
                                        title="Average Cost"
                                        value={report.statistics.averageCostPerMaintenance}
                                        prefix="$"
                                        precision={2}
                                    />
                                </Col>
                                <Col span={6}>
                                    <Statistic
                                        title="Total Downtime"
                                        value={report.statistics.totalDowntimeHours}
                                        suffix="hours"
                                        precision={1}
                                    />
                                </Col>
                            </Row>

                            <Descriptions title="Vehicle Information" bordered column={2} style={{marginBottom: 24}}>
                                <Descriptions.Item label="Vehicle ID">{report.vehicleId}</Descriptions.Item>
                                <Descriptions.Item label="Name">{report.vehicleInfo.name}</Descriptions.Item>
                                <Descriptions.Item
                                    label="Engine Power">{report.vehicleInfo.enginePower || 'N/A'}</Descriptions.Item>
                                <Descriptions.Item label="Fuel Type">
                                    <Tag color="blue">{report.vehicleInfo.fuelType}</Tag>
                                </Descriptions.Item>
                                <Descriptions.Item label="Capacity">{report.vehicleInfo.capacity}</Descriptions.Item>
                                <Descriptions.Item
                                    label="Wheels">{report.vehicleInfo.numberOfWheels || 'N/A'}</Descriptions.Item>
                            </Descriptions>

                            <Descriptions title="Report Period" bordered column={2} style={{marginBottom: 24}}>
                                <Descriptions.Item label="Start Date">
                                    {new Date(report.reportPeriod.startDate).toLocaleDateString()}
                                </Descriptions.Item>
                                <Descriptions.Item label="End Date">
                                    {new Date(report.reportPeriod.endDate).toLocaleDateString()}
                                </Descriptions.Item>
                            </Descriptions>

                            {report.maintenanceRecords && report.maintenanceRecords.length > 0 && (
                                <div>
                                    <Title level={4}>Maintenance Records</Title>
                                    <Table
                                        columns={maintenanceColumns}
                                        dataSource={report.maintenanceRecords}
                                        rowKey="id"
                                        pagination={false}
                                        size="small"
                                    />
                                </div>
                            )}

                            {report.maintenanceRecords && (
                                <div style={{marginTop: 16}}>
                                    <Title level={4}>Replaced Parts Summary</Title>
                                    <div>
                                        {Array.from(new Set(
                                            report.maintenanceRecords.flatMap(record => record.partsReplaced)
                                        )).map(part => (
                                            <Tag key={part} color="green" style={{marginBottom: 8}}>
                                                {part}
                                            </Tag>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div style={{marginTop: 16, textAlign: 'right', color: '#666'}}>
                                Generated: {new Date(report.generatedAt).toLocaleString()}
                            </div>
                        </Card>
                    )}
                </Col>
            </Row>
        </div>
    );
};

export default Reports;