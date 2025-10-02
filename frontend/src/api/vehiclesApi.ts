import axios from 'axios';
import type {Vehicle, VehicleCreate, VehicleUpdate, PaginatedResponse, VehicleFilters} from './types.ts';

const API_BASE_URL = 'https://localhost:3001/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const vehiclesApi = {
    getVehicles: (filters: VehicleFilters = {}) => {
        const params = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                params.append(key, value.toString());
            }
        });

        return api.get<PaginatedResponse<Vehicle>>(`/vehicles?${params}`);
    },

    getVehicleById: (id: number) => {
        return api.get<Vehicle>(`/vehicles/${id}`);
    },

    createVehicle: (vehicle: VehicleCreate) => {
        return api.post<Vehicle>('/vehicles', vehicle);
    },

    updateVehicle: (id: number, updates: VehicleUpdate) => {
        return api.patch<Vehicle>(`/vehicles/${id}`, updates);
    },

    deleteVehicle: (id: number) => {
        return api.delete(`/vehicles/${id}`);
    },

    getAverageEnginePower: () => {
        return api.get<{ averageEnginePower: number }>('/vehicles/stats/average-engine-power');
    },

    getCountByWheels: (wheels: number) => {
        return api.get<{ count: number }>(`/vehicles/stats/count-by-wheels/${wheels}`);
    },
};

export const reportsApi = {
    getMaintenanceReport: (vehicleId: number, format: string = 'json', includeDetails: boolean = true, includeCosts: boolean = true) => {
        return api.get(`/reports/maintenance/${vehicleId}`, {
            params: {format, includeDetails, includeCosts}
        });
    },
};

export const dealershipsApi = {
    findNearestDealership: (searchRequest: any) => {
        return api.post('/dealerships/nearest/with-vehicle', searchRequest);
    },
};

export const shopApi = {
    searchByEnginePower: (from: number, to: number) => {
        return api.get(`/shop/search/by-engine-power/${from}/${to}`);
    },

    addWheels: (vehicleId: number, numberOfWheels: number) => {
        return api.patch(`/shop/add-wheels/${vehicleId}/${numberOfWheels}`);
    },
};

export {vehiclesApi};