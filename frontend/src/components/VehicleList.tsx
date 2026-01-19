import React, {useEffect} from 'react';
import {Table, Button, Space, Tag, Popconfirm, message} from 'antd';
// @ts-ignore
import type {ColumnsType, SortOrder} from 'antd/es/table';
import {
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    SortAscendingOutlined,
    SortDescendingOutlined
} from '@ant-design/icons';
import {useDispatch, useSelector} from 'react-redux';
import type {AppDispatch, RootState} from '../store';
import {fetchVehicles, deleteVehicle, setFilters} from '../store/vehiclesSlice';
import type {Vehicle} from '../api/types';

interface VehicleListProps {
    onEdit: (vehicle: Vehicle) => void;
    onView: (vehicle: Vehicle) => void;
}

const VehicleList: React.FC<VehicleListProps> = ({onEdit, onView}) => {
    const dispatch = useDispatch<AppDispatch>();
    const {vehicles, loading, pagination, filters} = useSelector((state: RootState) => state.vehicles);

    useEffect(() => {
        dispatch(fetchVehicles(filters));
    }, [dispatch, filters]);

    const handleDelete = async (id: number) => {
        try {
            await dispatch(deleteVehicle(id)).unwrap();
            message.success('Vehicle deleted successfully');
        } catch (error) {
            message.error('Failed to delete vehicle');
        }
    };

    const handleSort = (field: string) => {
        const newOrder = filters.sort === field && filters.order === 'asc' ? 'desc' : 'asc';
        dispatch(setFilters({
            ...filters,
            sort: field,
            order: newOrder,
            page: 1
        }));
    };

    const handleTableChange = (pagination: any) => {
        dispatch(setFilters({
            ...filters,
            page: pagination.current,
            size: pagination.pageSize,
        }));
    };

    const getSortIcon = (field: string) => {
        if (filters.sort !== field) {
            return <SortAscendingOutlined style={{color: '#ccc'}}/>;
        }
        return filters.order === 'asc'
            ? <SortAscendingOutlined style={{color: '#1890ff'}}/>
            : <SortDescendingOutlined style={{color: '#1890ff'}}/>;
    };

    const getSortOrder = (field: string): SortOrder | undefined => {
        return filters.sort === field ? filters.order as SortOrder : undefined;
    };

    const columns: ColumnsType<Vehicle> = [
        {
            title: (
                <Space>
                    ID
                    <Button
                        type="text"
                        size="small"
                        icon={getSortIcon('id')}
                        onClick={() => handleSort('id')}
                        style={{padding: '4px', height: 'auto'}}
                    />
                </Space>
            ),
            dataIndex: 'id',
            key: 'id',
            width: 80,
            sorter: true,
            sortOrder: getSortOrder('id'),
        },
        {
            title: (
                <Space>
                    Name
                    <Button
                        type="text"
                        size="small"
                        icon={getSortIcon('name')}
                        onClick={() => handleSort('name')}
                        style={{padding: '4px', height: 'auto'}}
                    />
                </Space>
            ),
            dataIndex: 'name',
            key: 'name',
            sorter: true,
            sortOrder: getSortOrder('name'),
        },
        {
            title: (
                <Space>
                    Engine Power
                    <Button
                        type="text"
                        size="small"
                        icon={getSortIcon('enginePower')}
                        onClick={() => handleSort('enginePower')}
                        style={{padding: '4px', height: 'auto'}}
                    />
                </Space>
            ),
            dataIndex: 'enginePower',
            key: 'enginePower',
            render: (power: number) => power || 'N/A',
            sorter: true,
            sortOrder: getSortOrder('enginePower'),
        },
        {
            title: (
                <Space>
                    Wheels
                    <Button
                        type="text"
                        size="small"
                        icon={getSortIcon('numberOfWheels')}
                        onClick={() => handleSort('numberOfWheels')}
                        style={{padding: '4px', height: 'auto'}}
                    />
                </Space>
            ),
            dataIndex: 'numberOfWheels',
            key: 'numberOfWheels',
            render: (wheels: number) => wheels || 'N/A',
            sorter: true,
            sortOrder: getSortOrder('numberOfWheels'),
        },
        {
            title: (
                <Space>
                    Capacity
                    <Button
                        type="text"
                        size="small"
                        icon={getSortIcon('capacity')}
                        onClick={() => handleSort('capacity')}
                        style={{padding: '4px', height: 'auto'}}
                    />
                </Space>
            ),
            dataIndex: 'capacity',
            key: 'capacity',
            sorter: true,
            sortOrder: getSortOrder('capacity'),
        },
        {
            title: 'Fuel Type',
            dataIndex: 'fuelType',
            key: 'fuelType',
            render: (fuelType: string) => (
                <Tag color={getFuelTypeColor(fuelType)}>{fuelType}</Tag>
            ),
        },
        {
            title: (
                <Space>
                    Created
                    <Button
                        type="text"
                        size="small"
                        icon={getSortIcon('creationDate')}
                        onClick={() => handleSort('creationDate')}
                        style={{padding: '4px', height: 'auto'}}
                    />
                </Space>
            ),
            dataIndex: 'creationDate',
            key: 'creationDate',
            render: (date: string) => new Date(date).toLocaleDateString(),
            sorter: true,
            sortOrder: getSortOrder('creationDate'),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record: Vehicle) => (
                <Space size="middle">
                    <Button
                        type="link"
                        icon={<EyeOutlined/>}
                        onClick={() => onView(record)}
                    >
                        View
                    </Button>
                    <Button
                        type="link"
                        icon={<EditOutlined/>}
                        onClick={() => onEdit(record)}
                    >
                        Edit
                    </Button>
                    <Popconfirm
                        title="Are you sure to delete this vehicle?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="link" danger icon={<DeleteOutlined/>}>
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
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
    const tableData = vehicles.map(item => item.vehicle);

    return (
        <Table
            columns={columns}
            dataSource={tableData}
            rowKey="id"
            loading={loading}
            pagination={{
                current: pagination.currentPage,
                pageSize: pagination.pageSize,
                total: pagination.totalElements,
            }}
            onChange={handleTableChange}
        />
    );
};

export default VehicleList;