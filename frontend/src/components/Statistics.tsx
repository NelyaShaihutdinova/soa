import React, {useState, useEffect} from 'react';
import {Card, Statistic, InputNumber, Button, Row, Col, Space, Typography} from 'antd';
import {vehiclesApi} from '../api/vehiclesApi';

const {Title} = Typography;

const Statistics: React.FC = () => {
    const [averagePower, setAveragePower] = useState<number | null>(null);
    const [wheelsCount, setWheelsCount] = useState<number>(4);
    const [countByWheels, setCountByWheels] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchAveragePower = async () => {
        try {
            setLoading(true);
            const response = await vehiclesApi.getAverageEnginePower();
            setAveragePower(response.data.averageEnginePower);
        } catch (error) {
            console.error('Failed to fetch average power:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCountByWheels = async () => {
        try {
            setLoading(true);
            const response = await vehiclesApi.getCountByWheels(wheelsCount);
            setCountByWheels(response.data.count);
        } catch (error) {
            console.error('Failed to fetch count by wheels:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAveragePower();
    }, []);

    return (
        <div>
            <Title level={2}>Statistics</Title>

            <Row gutter={16}>
                <Col span={12}>
                    <Card>
                        <Statistic
                            title="Average Engine Power"
                            value={averagePower || 0}
                            precision={2}
                            loading={loading}
                        />
                        <Button
                            type="link"
                            onClick={fetchAveragePower}
                            style={{marginTop: 16}}
                        >
                            Refresh
                        </Button>
                    </Card>
                </Col>

                <Col span={12}>
                    <Card>
                        <Space direction="vertical" style={{width: '100%'}}>
                            <div>
                                <Title level={5}>Count by Wheels</Title>
                                <Space>
                                    <InputNumber
                                        min={1}
                                        value={wheelsCount}
                                        onChange={(value) => setWheelsCount(value || 4)}
                                    />
                                    <Button type="primary" onClick={fetchCountByWheels}>
                                        Get Count
                                    </Button>
                                </Space>
                            </div>
                            {countByWheels !== null && (
                                <Statistic
                                    title={`Vehicles with ${wheelsCount} wheels`}
                                    value={countByWheels}
                                />
                            )}
                        </Space>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Statistics;