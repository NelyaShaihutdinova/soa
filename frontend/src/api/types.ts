export interface Coordinates {
    x: number;
    y: number;
}

export type FuelType = 'KEROSENE' | 'ELECTRICITY' | 'DIESEL' | 'ALCOHOL' | 'NUCLEAR';

export interface Vehicle {
    id: number;
    name: string;
    coordinates: Coordinates;
    creationDate: string;
    enginePower?: number;
    numberOfWheels?: number;
    capacity: number;
    fuelType: FuelType;
}

export interface VehicleCreate {
    name: string;
    coordinates: Coordinates;
    enginePower?: number;
    numberOfWheels?: number;
    capacity: number;
    fuelType: FuelType;
}

export interface VehicleUpdate {
    name?: string;
    coordinates?: Coordinates;
    enginePower?: number;
    numberOfWheels?: number;
    capacity?: number;
    fuelType?: FuelType;
}

export interface PaginatedResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
}

export interface VehicleFilters {
    page?: number;
    size?: number;
    sort?: string;
    order?: 'asc' | 'desc';
    name?: string;
    minEnginePower?: number;
    maxEnginePower?: number;
    minWheels?: number;
    maxWheels?: number;
    minCapacity?: number;
    maxCapacity?: number;
    fuelType?: FuelType;
}

export interface MaintenanceRecord {
    id: number;
    date: string;
    mileage: number;
    description: string;
    cost: number;
    partsReplaced: string[];
    technician: string;
    durationHours: number;
}

export interface MaintenanceStatistics {
    averageCostPerMaintenance: number;
    totalDowntimeHours: number;
}

export interface MaintenanceReport {
    vehicleId: number;
    vehicleInfo: Vehicle;
    reportPeriod: {
        startDate: string;
        endDate: string;
    };
    totalMaintenanceCount: number;
    totalCost?: number;
    maintenanceRecords?: MaintenanceRecord[];
    statistics: MaintenanceStatistics;
    generatedAt: string;
}

export interface Dealership {
    id: number;
    name: string;
    location: Coordinates;
    address: string;
    workingHours: string;
    phone: string;
    rating?: number;
}

export interface AvailableVehicle {
    vehicle: Vehicle;
    price: number;
    availableCount: number;
    discount: number;
    deliveryTime: string;
}

export interface ContactInfo {
    phone: string;
    email: string;
    website: string;
}

export interface DealershipSearchResult {
    dealership: Dealership;
    distance: number;
    availableVehicles: AvailableVehicle[];
    estimatedTravelTime: string;
    contactInfo: ContactInfo;
    rating: number;
}
