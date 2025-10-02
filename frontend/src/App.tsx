import React, {useState} from 'react';
import {Layout, Menu, Button, Modal, Typography, Space, message} from 'antd';
import {
    CarOutlined,
    BarChartOutlined,
    ShopOutlined,
    FileTextOutlined,
    EnvironmentOutlined,
    PlusOutlined
} from '@ant-design/icons';
import {useDispatch} from 'react-redux';
import type {AppDispatch} from './store';
import {createVehicle, updateVehicle} from './store/vehiclesSlice';
import VehicleList from './components/VehicleList';
import VehicleFilters from './components/VehicleFilters';
import VehicleForm from './components/VehicleForm';
import Statistics from './components/Statistics';
import Shop from './components/Shop';
import Reports from './components/Reports';
import Dealerships from './components/Dealerships';
import type {Vehicle, VehicleCreate, VehicleUpdate} from './api/types';

const {Header, Content, Sider} = Layout;
const {Title} = Typography;

const App: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
    const [viewingVehicle, setViewingVehicle] = useState<Vehicle | null>(null);
    const [activeTab, setActiveTab] = useState('vehicles');

    const handleCreate = () => {
        setEditingVehicle(null);
        setIsModalVisible(true);
    };

    const handleEdit = (vehicle: Vehicle) => {
        setEditingVehicle(vehicle);
        setIsModalVisible(true);
    };

    const handleView = (vehicle: Vehicle) => {
        setViewingVehicle(vehicle);
    };

    const handleFormSubmit = async (values: VehicleCreate | VehicleUpdate) => {
        try {
            if (editingVehicle) {
                await dispatch(updateVehicle({id: editingVehicle.id, updates: values})).unwrap();
                message.success('Vehicle updated successfully');
            } else {
                await dispatch(createVehicle(values as VehicleCreate)).unwrap();
                message.success('Vehicle created successfully');
            }
            setIsModalVisible(false);
            setEditingVehicle(null);
        } catch (error) {
            message.error('Failed to save vehicle');
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingVehicle(null);
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'vehicles':
                return (
                    <div>
                        <div style={{marginBottom: 16, display: 'flex', justifyContent: 'space-between'}}>
                            <Title level={2}>Vehicles</Title>
                            <Button
                                type="primary"
                                icon={<PlusOutlined/>}
                                onClick={handleCreate}
                            >
                                Add Vehicle
                            </Button>
                        </div>
                        <VehicleFilters/>
                        <div style={{marginTop: 16}}>
                            <VehicleList
                                onEdit={handleEdit}
                                onView={handleView}
                            />
                        </div>
                    </div>
                );
            case 'statistics':
                return <Statistics/>;
            case 'shop':
                return <Shop/>;
            case 'reports':
                return <Reports/>;
            case 'dealerships':
                return <Dealerships/>;
            default:
                return null;
        }
    };

    return (
        <Layout style={{minHeight: '100vh'}}>
            <Header>
                <Space>
                    <Title level={3} style={{color: 'white', margin: 0}}>
                        SOA / LaboratoryWork2
                    </Title>
                </Space>
            </Header>

            <Layout>
                <Sider width={200} theme="light">
                    <Menu
                        mode="inline"
                        selectedKeys={[activeTab]}
                        onClick={({key}) => setActiveTab(key)}
                        items={[
                            {
                                key: 'vehicles',
                                icon: <CarOutlined/>,
                                label: 'Vehicles',
                            },
                            {
                                key: 'shop',
                                icon: <ShopOutlined/>,
                                label: 'Shop',
                            },
                            {
                                key: 'reports',
                                icon: <FileTextOutlined/>,
                                label: 'Reports',
                            },
                            {
                                key: 'dealerships',
                                icon: <EnvironmentOutlined/>,
                                label: 'Dealerships',
                            },
                            {
                                key: 'statistics',
                                icon: <BarChartOutlined/>,
                                label: 'Statistics',
                            },
                        ]}
                    />
                </Sider>

                <Layout style={{padding: '24px'}}>
                    <Content>
                        {renderTabContent()}
                    </Content>
                </Layout>
            </Layout>

            <Modal
                title={editingVehicle ? 'Edit Vehicle' : 'Create New Vehicle'}
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                width={800}
            >
                <VehicleForm
                    initialValues={editingVehicle || undefined}
                    onSubmit={handleFormSubmit}
                    onCancel={handleCancel}
                    isEditing={!!editingVehicle}
                />
            </Modal>

            <Modal
                title="Vehicle Details"
                open={!!viewingVehicle}
                onCancel={() => setViewingVehicle(null)}
                footer={[
                    <Button key="close" onClick={() => setViewingVehicle(null)}>
                        Close
                    </Button>,
                    <Button
                        key="edit"
                        type="primary"
                        onClick={() => {
                            if (viewingVehicle) {
                                setEditingVehicle(viewingVehicle);
                                setViewingVehicle(null);
                                setIsModalVisible(true);
                            }
                        }}
                    >
                        Edit
                    </Button>,
                ]}
            >
                {viewingVehicle && (
                    <div>
                        <p><strong>ID:</strong> {viewingVehicle.id}</p>
                        <p><strong>Name:</strong> {viewingVehicle.name}</p>
                        <p><strong>Engine Power:</strong> {viewingVehicle.enginePower || 'N/A'}</p>
                        <p><strong>Wheels:</strong> {viewingVehicle.numberOfWheels || 'N/A'}</p>
                        <p><strong>Capacity:</strong> {viewingVehicle.capacity}</p>
                        <p><strong>Fuel Type:</strong> {viewingVehicle.fuelType}</p>
                        <p><strong>Created:</strong> {new Date(viewingVehicle.creationDate).toLocaleString()}</p>
                        <p><strong>Coordinates:</strong> X: {viewingVehicle.coordinates.x},
                            Y: {viewingVehicle.coordinates.y}</p>
                    </div>
                )}
            </Modal>
        </Layout>
    );
};

export default App;