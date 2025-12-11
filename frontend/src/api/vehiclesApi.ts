import axios from 'axios';
import type {Vehicle, VehicleCreate, VehicleUpdate, PaginatedResponse, VehicleFilters} from './types.ts';

const API_BASE_URL_SERVICE_1 = '/app';
const API_BASE_URL_SERVICE_2 = '';

const api1 = axios.create({
    baseURL: 'https://ubuntu22:8443',
    headers: {
        'Content-Type': 'application/json',
    },
});

const api2 = axios.create({
    baseURL: 'https://ubuntu22:8443',
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

        return api1.get<PaginatedResponse<Vehicle>>(`${API_BASE_URL_SERVICE_1}/vehicles?${params}`);
    },

    getVehicleById: (id: number) => {
        return api1.get<Vehicle>(`${API_BASE_URL_SERVICE_1}/vehicles/${id}`);
    },

    createVehicle: (vehicle: VehicleCreate) => {
        return api1.post<Vehicle>(`${API_BASE_URL_SERVICE_1}/vehicles`, vehicle);
    },

    updateVehicle: (id: number, updates: VehicleUpdate) => {
        return api1.post<Vehicle>(`${API_BASE_URL_SERVICE_1}/vehicles/${id}`, updates);
    },

    deleteVehicle: (id: number) => {
        return api1.delete(`${API_BASE_URL_SERVICE_1}/vehicles/${id}`);
    },

    getAverageEnginePower: () => {
        return api1.get<{ averageEnginePower: number }>(`${API_BASE_URL_SERVICE_1}/vehicles/stats/average-engine-power`);
    },

    getCountByWheels: (wheels: number) => {
        return api1.get<{ count: number }>(`${API_BASE_URL_SERVICE_1}/vehicles/stats/count-by-wheels/${wheels}`);
    },
};

export const reportsApi = {
    getMaintenanceReport: (vehicleId: number, format: string = 'json', includeDetails: boolean = true, includeCosts: boolean = true) => {
        return api2.get(`${API_BASE_URL_SERVICE_2}/reports/maintenance/${vehicleId}`, {
            params: {format, includeDetails, includeCosts}
        });
    },
};

export const dealershipsApi = {
    findNearestDealership: (searchRequest: any) => {
        return api2.get(`${API_BASE_URL_SERVICE_2}/vehicles/search/by-coordinates?x=${searchRequest.x}&y=${searchRequest.y}&max_distance=${searchRequest.maxDistance}`);
    },
};

export const shopApi = {
    searchByEnginePower: (from: number, to: number) => {
        return api2.get(`${API_BASE_URL_SERVICE_2}/shop/search/by-engine-power/${from}/${to}`);
    },

    addWheels: (vehicleId: number, numberOfWheels: number) => {
        return api2.patch(`${API_BASE_URL_SERVICE_2}/shop/add-wheels/${vehicleId}/${numberOfWheels}`);
    },
};

export {vehiclesApi};