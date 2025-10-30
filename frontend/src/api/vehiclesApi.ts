import axios from 'axios';
import type {Vehicle, VehicleCreate, VehicleUpdate, PaginatedResponse, VehicleFilters} from './types.ts';

const API_BASE_URL_SERVICE_1 = '/first_wildfly-0.0.1-SNAPSHOT';
const API_BASE_URL_SERVICE_2 = '/second_payara-0.0.1-SNAPSHOT';

const api = axios.create({
    baseURL: 'https://ubuntu22:8453',
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

        return api.get<PaginatedResponse<Vehicle>>(`${API_BASE_URL_SERVICE_1}/vehicles?${params}`);
    },

    getVehicleById: (id: number) => {
        return api.get<Vehicle>(`${API_BASE_URL_SERVICE_1}/vehicles/${id}`);
    },

    createVehicle: (vehicle: VehicleCreate) => {
        return api.post<Vehicle>(`${API_BASE_URL_SERVICE_1}/vehicles`, vehicle);
    },

    updateVehicle: (id: number, updates: VehicleUpdate) => {
        return api.patch<Vehicle>(`${API_BASE_URL_SERVICE_1}/vehicles/${id}`, updates);
    },

    deleteVehicle: (id: number) => {
        return api.delete(`${API_BASE_URL_SERVICE_1}/vehicles/${id}`);
    },

    getAverageEnginePower: () => {
        return api.get<{ averageEnginePower: number }>(`${API_BASE_URL_SERVICE_1}/vehicles/stats/average-engine-power`);
    },

    getCountByWheels: (wheels: number) => {
        return api.get<{ count: number }>(`${API_BASE_URL_SERVICE_1}/vehicles/stats/count-by-wheels/${wheels}`);
    },
};

export const reportsApi = {
    getMaintenanceReport: (vehicleId: number, format: string = 'json', includeDetails: boolean = true, includeCosts: boolean = true) => {
        return api.get(`${API_BASE_URL_SERVICE_2}/reports/maintenance/${vehicleId}`, {
            params: {format, includeDetails, includeCosts}
        });
    },
};

export const dealershipsApi = {
    findNearestDealership: (searchRequest: any) => {
        return api.post(`${API_BASE_URL_SERVICE_2}/dealerships/nearest/with-vehicle`, searchRequest);
    },
};

export const shopApi = {
    searchByEnginePower: (from: number, to: number) => {
        return api.get(`${API_BASE_URL_SERVICE_2}/shop/search/by-engine-power/${from}/${to}`);
    },

    addWheels: (vehicleId: number, numberOfWheels: number) => {
        return api.patch(`${API_BASE_URL_SERVICE_2}/shop/add-wheels/${vehicleId}/${numberOfWheels}`);
    },
};

export {vehiclesApi};