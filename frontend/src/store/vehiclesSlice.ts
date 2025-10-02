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
                state.vehicles = action.payload.content;
                state.pagination = {
                    currentPage: action.payload.currentPage,
                    totalPages: action.payload.totalPages,
                    totalElements: action.payload.totalElements,
                    pageSize: state.pagination.pageSize,
                };
            })
            .addCase(fetchVehicles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch vehicles';
            })
            .addCase(fetchVehicleById.fulfilled, (state, action) => {
                state.currentVehicle = action.payload;
            })
            .addCase(createVehicle.fulfilled, (state, action) => {
                state.vehicles.push(action.payload);
            })
            .addCase(updateVehicle.fulfilled, (state, action) => {
                const index = state.vehicles.findIndex(v => v.id === action.payload.id);
                if (index !== -1) {
                    state.vehicles[index] = action.payload;
                }
                if (state.currentVehicle?.id === action.payload.id) {
                    state.currentVehicle = action.payload;
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