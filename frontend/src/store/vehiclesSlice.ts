import {createSlice, createAsyncThunk, type PayloadAction} from '@reduxjs/toolkit';
import {vehiclesApi} from '../api/vehiclesApi';
import type {Vehicle, VehicleCreate, VehicleUpdate, VehicleFilters} from '../api/types';

interface VehiclesState {
    vehicles: Vehicle[]; 
    currentVehicle: Vehicle | null;
    loading: boolean;
    error: string | null;
    pagination: {
        currentPage: number;
        totalPages: number;
        totalElements: number;
        pageSize: number;
    };
    filters: VehicleFilters;
}

const initialState: VehiclesState = {
    vehicles: [],
    currentVehicle: null,
    loading: false,
    error: null,
    pagination: {
        currentPage: 1,
        totalPages: 0,
        totalElements: 0,
        pageSize: 20,
    },
    filters: {},
};

export const fetchVehicles = createAsyncThunk(
    'vehicles/fetchVehicles',
    async (filters: VehicleFilters = {}) => {
        const response = await vehiclesApi.getVehicles(filters);
        return response.data;
    }
);

export const fetchVehicleById = createAsyncThunk(
    'vehicles/fetchVehicleById',
    async (id: number) => {
        const response = await vehiclesApi.getVehicleById(id);
        return response.data;
    }
);

export const createVehicle = createAsyncThunk(
    'vehicles/createVehicle',
    async (vehicle: VehicleCreate) => {
        const response = await vehiclesApi.createVehicle(vehicle);
        return response.data;
    }
);

export const updateVehicle = createAsyncThunk(
    'vehicles/updateVehicle',
    async ({id, updates}: { id: number; updates: VehicleUpdate }) => {
        const response = await vehiclesApi.updateVehicle(id, updates);
        return response.data;
    }
);

export const deleteVehicle = createAsyncThunk(
    'vehicles/deleteVehicle',
    async (id: number) => {
        await vehiclesApi.deleteVehicle(id);
        return id;
    }
);

const vehiclesSlice = createSlice({
    name: 'vehicles',
    initialState,
    reducers: {
        setFilters: (state, action: PayloadAction<VehicleFilters>) => {
            state.filters = {...state.filters, ...action.payload};
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchVehicles.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchVehicles.fulfilled, (state, action) => {
                state.loading = false;
                
                let vehiclesArray: Vehicle[] = [];
                
                if (Array.isArray(action.payload)) {
                    const firstItem = action.payload[0];
                    if (firstItem && 'vehicle' in firstItem) {
                        const allVehicles: Vehicle[] = [];
                        const processedKeys = new Set();
                        const extractVehicles = (obj: any) => {
                            for (const key in obj) {
                                if (processedKeys.has(key)) continue;
                                
                                if (key === 'vehicle' && obj[key] && typeof obj[key] === 'object') {
                                    allVehicles.push(obj[key]);
                                    processedKeys.add(key);
                                } else if (obj[key] && typeof obj[key] === 'object') {
                                    extractVehicles(obj[key]);
                                }
                            }
                        };
                        
                        extractVehicles(firstItem);
                        vehiclesArray = allVehicles;
                    } else {
                        vehiclesArray = action.payload;
                    }
                } else if (action.payload.content && Array.isArray(action.payload.content)) {
                    vehiclesArray = action.payload.content.map((item: any) => 
                        item.vehicle || item
                    );
                }
                
                state.vehicles = vehiclesArray.map(vehicle => ({
                    ...vehicle,
                    id: Number(vehicle.id),
                    enginePower: vehicle.enginePower ? Number(vehicle.enginePower) : undefined,
                    numberOfWheels: vehicle.numberOfWheels ? Number(vehicle.numberOfWheels) : undefined,
                    capacity: Number(vehicle.capacity),
                    coordinates: {
                        x: Number(vehicle.coordinates?.x),
                        y: Number(vehicle.coordinates?.y),
                    }
                }));
                
                state.pagination = {
                    currentPage: Number(action.payload.currentPage) || 1,
                    totalPages: Number(action.payload.totalPages) || 1,
                    totalElements: Number(action.payload.totalElements) || vehiclesArray.length,
                    pageSize: state.pagination.pageSize,
                };
            })
            .addCase(fetchVehicles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch vehicles';
            })
            .addCase(fetchVehicleById.fulfilled, (state, action) => {
                state.currentVehicle = {
                    ...action.payload,
                    id: Number(action.payload.id),
                    enginePower: action.payload.enginePower ? Number(action.payload.enginePower) : undefined,
                    numberOfWheels: action.payload.numberOfWheels ? Number(action.payload.numberOfWheels) : undefined,
                    capacity: Number(action.payload.capacity),
                    coordinates: {
                        x: Number(action.payload.coordinates?.x),
                        y: Number(action.payload.coordinates?.y),
                    }
                };
            })
            .addCase(createVehicle.fulfilled, (state, action) => {
                const newVehicle = {
                    ...action.payload,
                    id: Number(action.payload.id),
                    enginePower: action.payload.enginePower ? Number(action.payload.enginePower) : undefined,
                    numberOfWheels: action.payload.numberOfWheels ? Number(action.payload.numberOfWheels) : undefined,
                    capacity: Number(action.payload.capacity),
                    coordinates: {
                        x: Number(action.payload.coordinates?.x),
                        y: Number(action.payload.coordinates?.y),
                    }
                };
                state.vehicles.unshift(newVehicle);
            })
            .addCase(updateVehicle.fulfilled, (state, action) => {
                const updatedVehicle = {
                    ...action.payload,
                    id: Number(action.payload.id),
                    enginePower: action.payload.enginePower ? Number(action.payload.enginePower) : undefined,
                    numberOfWheels: action.payload.numberOfWheels ? Number(action.payload.numberOfWheels) : undefined,
                    capacity: Number(action.payload.capacity),
                    coordinates: {
                        x: Number(action.payload.coordinates?.x),
                        y: Number(action.payload.coordinates?.y),
                    }
                };
                
                const index = state.vehicles.findIndex(v => v.id === updatedVehicle.id);
                if (index !== -1) {
                    state.vehicles[index] = updatedVehicle;
                }
                if (state.currentVehicle?.id === updatedVehicle.id) {
                    state.currentVehicle = updatedVehicle;
                }
            })
            .addCase(deleteVehicle.fulfilled, (state, action) => {
                state.vehicles = state.vehicles.filter(v => v.id !== action.payload);
                if (state.currentVehicle?.id === action.payload) {
                    state.currentVehicle = null;
                }
            });
    },
});

export const {setFilters} = vehiclesSlice.actions;
export default vehiclesSlice.reducer;