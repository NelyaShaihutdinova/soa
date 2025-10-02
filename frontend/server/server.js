import express from 'express';
import cors from 'cors';
import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Mock data
let vehicles = [
    {
        id: 1,
        name: "Tesla Model S",
        coordinates: { x: 100, y: 200 },
        creationDate: new Date().toISOString(),
        enginePower: 1020,
        numberOfWheels: 4,
        capacity: 5.0,
        fuelType: "ELECTRICITY"
    },
    {
        id: 2,
        name: "Ford F-150",
        coordinates: { x: 150, y: 250 },
        creationDate: new Date().toISOString(),
        enginePower: 400,
        numberOfWheels: 4,
        capacity: 5.5,
        fuelType: "DIESEL"
    },
    {
        id: 3,
        name: "Boeing 747",
        coordinates: { x: 500, y: 1000 },
        creationDate: new Date().toISOString(),
        enginePower: 60000,
        numberOfWheels: 18,
        capacity: 416,
        fuelType: "KEROSENE"
    },
    {
        id: 4,
        name: "Nuclear Submarine",
        coordinates: { x: 1000, y: -500 },
        creationDate: new Date().toISOString(),
        enginePower: 50000,
        numberOfWheels: 0,
        capacity: 150,
        fuelType: "NUCLEAR"
    },
    {
        id: 5,
        name: "Ethanol Race Car",
        coordinates: { x: 300, y: 400 },
        creationDate: new Date().toISOString(),
        enginePower: 800,
        numberOfWheels: 4,
        capacity: 2.0,
        fuelType: "ALCOHOL"
    }
];

// Mock data for additional entities
const maintenanceRecords = {
    1: [
        {
            id: 1,
            date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            mileage: 15000,
            description: 'Regular maintenance',
            cost: 2500.00,
            partsReplaced: ['Oil filter', 'Air filter', 'Spark plugs'],
            technician: 'John Smith',
            durationHours: 2.5
        },
        {
            id: 2,
            date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
            mileage: 10000,
            description: 'Brake system check',
            cost: 1800.50,
            partsReplaced: ['Brake pads'],
            technician: 'Mike Johnson',
            durationHours: 1.5
        }
    ]
};

const dealerships = [
    {
        id: 1,
        name: 'Auto Center Moscow',
        location: { x: 110, y: 210 },
        address: 'Moscow, Lenina st. 123',
        workingHours: '9:00-21:00',
        phone: '+7-495-123-4567',
        rating: 4.5
    },
    {
        id: 2,
        name: 'Car Market SPb',
        location: { x: 200, y: 300 },
        address: 'St. Petersburg, Nevsky st. 45',
        workingHours: '8:00-20:00',
        phone: '+7-812-987-6543',
        rating: 4.2
    }
];

// Utility functions
const generateError = (status, message, path) => ({
    timestamp: new Date().toISOString(),
    status,
    error: getErrorType(status),
    message,
    path
});

const getErrorType = (status) => {
    const types = {
        400: 'Bad Request',
        404: 'Not Found',
        413: 'Payload Too Large',
        415: 'Unsupported Media Type',
        409: 'Conflict',
        422: 'Unprocessable Entity'
    };
    return types[status] || 'Error';
};

// ========== BASIC VEHICLE ENDPOINTS ==========

// GET /vehicles
app.get('/api/vehicles', (req, res) => {
    try {
        let filteredVehicles = [...vehicles];
        const {
            page = 1,
            size = 20,
            sort,
            order = 'asc',
            name,
            minEnginePower,
            maxEnginePower,
            minWheels,
            maxWheels,
            minCapacity,
            maxCapacity,
            fuelType
        } = req.query;

        // Filtering
        if (name) {
            filteredVehicles = filteredVehicles.filter(v => v.name.toLowerCase().includes(name.toLowerCase()));
        }
        if (fuelType) {
            filteredVehicles = filteredVehicles.filter(v => v.fuelType === fuelType);
        }
        if (minEnginePower) {
            filteredVehicles = filteredVehicles.filter(v => v.enginePower >= parseInt(minEnginePower));
        }
        if (maxEnginePower) {
            filteredVehicles = filteredVehicles.filter(v => v.enginePower <= parseInt(maxEnginePower));
        }
        if (minWheels) {
            filteredVehicles = filteredVehicles.filter(v => v.numberOfWheels >= parseInt(minWheels));
        }
        if (maxWheels) {
            filteredVehicles = filteredVehicles.filter(v => v.numberOfWheels <= parseInt(maxWheels));
        }
        if (minCapacity) {
            filteredVehicles = filteredVehicles.filter(v => v.capacity >= parseFloat(minCapacity));
        }
        if (maxCapacity) {
            filteredVehicles = filteredVehicles.filter(v => v.capacity <= parseFloat(maxCapacity));
        }

        // Sorting
        if (sort) {
            filteredVehicles.sort((a, b) => {
                const aVal = a[sort];
                const bVal = b[sort];

                if (aVal === undefined || bVal === undefined) return 0;

                if (order === 'desc') {
                    return bVal < aVal ? -1 : bVal > aVal ? 1 : 0;
                }
                return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
            });
        }

        // Pagination
        const pageNum = parseInt(page);
        const sizeNum = parseInt(size);
        const startIndex = (pageNum - 1) * sizeNum;
        const endIndex = startIndex + sizeNum;
        const paginatedVehicles = filteredVehicles.slice(startIndex, endIndex);

        res.json({
            content: paginatedVehicles,
            totalElements: filteredVehicles.length,
            totalPages: Math.ceil(filteredVehicles.length / sizeNum),
            currentPage: pageNum
        });
    } catch (error) {
        res.status(400).json(generateError(400, error.message, req.path));
    }
});

// GET /vehicles/:id
app.get('/api/vehicles/:id', (req, res) => {
    const vehicle = vehicles.find(v => v.id === parseInt(req.params.id));
    if (!vehicle) {
        return res.status(404).json(generateError(404, 'Vehicle not found', req.path));
    }
    res.json(vehicle);
});

// POST /vehicles
app.post('/api/vehicles', (req, res) => {
    try {
        const { name, coordinates, enginePower, numberOfWheels, capacity, fuelType } = req.body;

        if (!name || !coordinates || !capacity || !fuelType) {
            return res.status(400).json(generateError(400, 'Missing required fields', req.path));
        }

        const newVehicle = {
            id: vehicles.length > 0 ? Math.max(...vehicles.map(v => v.id)) + 1 : 1,
            name,
            coordinates,
            creationDate: new Date().toISOString(),
            enginePower: enginePower || null,
            numberOfWheels: numberOfWheels || null,
            capacity,
            fuelType
        };

        vehicles.push(newVehicle);
        res.status(201).json(newVehicle);
    } catch (error) {
        res.status(400).json(generateError(400, error.message, req.path));
    }
});

// PATCH /vehicles/:id
app.patch('/api/vehicles/:id', (req, res) => {
    const vehicleIndex = vehicles.findIndex(v => v.id === parseInt(req.params.id));
    if (vehicleIndex === -1) {
        return res.status(404).json(generateError(404, 'Vehicle not found', req.path));
    }

    try {
        const updates = req.body;
        vehicles[vehicleIndex] = { ...vehicles[vehicleIndex], ...updates };
        res.json(vehicles[vehicleIndex]);
    } catch (error) {
        res.status(400).json(generateError(400, error.message, req.path));
    }
});

// DELETE /vehicles/:id
app.delete('/api/vehicles/:id', (req, res) => {
    const vehicleIndex = vehicles.findIndex(v => v.id === parseInt(req.params.id));
    if (vehicleIndex === -1) {
        return res.status(404).json(generateError(404, 'Vehicle not found', req.path));
    }

    vehicles.splice(vehicleIndex, 1);
    res.status(204).send();
});

// GET /vehicles/stats/average-engine-power
app.get('/api/vehicles/stats/average-engine-power', (req, res) => {
    const vehiclesWithPower = vehicles.filter(v => v.enginePower);
    if (vehiclesWithPower.length === 0) {
        return res.status(404).json(generateError(404, 'No data for calculation', req.path));
    }

    const average = vehiclesWithPower.reduce((sum, v) => sum + v.enginePower, 0) / vehiclesWithPower.length;
    res.json({ averageEnginePower: average });
});

// GET /vehicles/stats/count-by-wheels/:wheels
app.get('/api/vehicles/stats/count-by-wheels/:wheels', (req, res) => {
    const wheels = parseInt(req.params.wheels);
    if (wheels < 1) {
        return res.status(400).json(generateError(400, 'Invalid number of wheels', req.path));
    }

    const count = vehicles.filter(v => v.numberOfWheels === wheels).length;
    res.json({ count });
});

// GET /vehicles/search/name-starts-with/:prefix
app.get('/api/vehicles/search/name-starts-with/:prefix', (req, res) => {
    const prefix = req.params.prefix;
    if (!prefix || prefix.length < 1) {
        return res.status(400).json(generateError(400, 'Invalid prefix', req.path));
    }

    const results = vehicles.filter(v => v.name.toLowerCase().startsWith(prefix.toLowerCase()));
    if (results.length === 0) {
        return res.status(404).json(generateError(404, 'No vehicles found', req.path));
    }

    res.json(results);
});

// ========== SHOP ENDPOINTS ==========

// GET /shop/search/by-engine-power/:from/:to
app.get('/api/shop/search/by-engine-power/:from/:to', (req, res) => {
    const from = parseInt(req.params.from);
    const to = parseInt(req.params.to);

    if (from > to) {
        return res.status(400).json(generateError(400, 'Invalid power range (from > to)', req.path));
    }

    const results = vehicles.filter(v => v.enginePower >= from && v.enginePower <= to);
    if (results.length === 0) {
        return res.status(404).json(generateError(404, 'No vehicles found in this range', req.path));
    }

    res.json(results);
});

// PATCH /shop/add-wheels/:vehicleId/:numberOfWheels
app.patch('/api/shop/add-wheels/:vehicleId/:numberOfWheels', (req, res) => {
    const vehicleId = parseInt(req.params.vehicleId);
    const numberOfWheels = parseInt(req.params.numberOfWheels);

    if (numberOfWheels < 1) {
        return res.status(400).json(generateError(400, 'Number of wheels must be positive', req.path));
    }

    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (!vehicle) {
        return res.status(404).json(generateError(404, 'Vehicle not found', req.path));
    }

    vehicle.numberOfWheels = (vehicle.numberOfWheels || 0) + numberOfWheels;
    res.json(vehicle);
});

// ========== REPORTS ENDPOINTS ==========

// GET /reports/maintenance/:vehicleId
app.get('/api/reports/maintenance/:vehicleId', (req, res) => {
    const vehicleId = parseInt(req.params.vehicleId);
    const { format = 'json', includeDetails = 'true', includeCosts = 'true' } = req.query;

    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (!vehicle) {
        return res.status(404).json(generateError(404, 'Vehicle not found', req.path));
    }

    const records = maintenanceRecords[vehicleId] || [];
    const totalCost = records.reduce((sum, record) => sum + record.cost, 0);

    const report = {
        vehicleId,
        vehicleInfo: vehicle,
        reportPeriod: {
            startDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
            endDate: new Date().toISOString()
        },
        totalMaintenanceCount: records.length,
        totalCost: includeCosts === 'true' ? totalCost : undefined,
        maintenanceRecords: includeDetails === 'true' ? records : undefined,
        statistics: {
            averageCostPerMaintenance: records.length > 0 ? totalCost / records.length : 0,
            totalDowntimeHours: records.reduce((sum, record) => sum + record.durationHours, 0)
        },
        generatedAt: new Date().toISOString()
    };

    // Handle different formats
    if (format === 'pdf') {
        // For demo purposes, return JSON with PDF info
        res.json({
            ...report,
            format: 'pdf',
            downloadUrl: `https://localhost:${PORT}/api/reports/maintenance/${vehicleId}/download.pdf`
        });
    } else if (format === 'csv') {
        // Simple CSV conversion for demo
        const csv = `Vehicle ID,Vehicle Name,Total Maintenance Count,Total Cost\n${vehicleId},${vehicle.name},${records.length},${totalCost}`;
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=maintenance-report-${vehicleId}.csv`);
        res.send(csv);
    } else if (format === 'html') {
        // Simple HTML report
        const html = `
      <html>
        <head><title>Maintenance Report for ${vehicle.name}</title></head>
        <body>
          <h1>Maintenance Report</h1>
          <h2>${vehicle.name}</h2>
          <p>Total Maintenance Records: ${records.length}</p>
          <p>Total Cost: $${totalCost}</p>
          <p>Generated: ${new Date().toLocaleString()}</p>
        </body>
      </html>
    `;
        res.setHeader('Content-Type', 'text/html');
        res.send(html);
    } else {
        res.json(report);
    }
});

// POST /reports/maintenance/:vehicleId/generate (async)
app.post('/api/reports/maintenance/:vehicleId/generate', (req, res) => {
    const vehicleId = parseInt(req.params.vehicleId);
    const { format = 'pdf' } = req.body;

    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (!vehicle) {
        return res.status(404).json(generateError(404, 'Vehicle not found', req.path));
    }

    const reportId = `report_${vehicleId}_${Date.now()}`;

    // Simulate async processing
    const reportStatus = {
        reportId,
        status: 'PROCESSING',
        estimatedCompletionTime: new Date(Date.now() + 30000).toISOString(), // 30 seconds from now
        progress: 0,
        downloadUrl: `https://localhost:${PORT}/api/reports/download/${reportId}`
    };

    // Simulate progress updates
    setTimeout(() => {
        reportStatus.progress = 50;
    }, 15000);

    setTimeout(() => {
        reportStatus.status = 'COMPLETED';
        reportStatus.progress = 100;
    }, 30000);

    res.status(202).json(reportStatus);
});

// GET /reports/status/:reportId
app.get('/api/reports/status/:reportId', (req, res) => {
    const { reportId } = req.params;

    // Mock status response
    const reportStatus = {
        reportId,
        status: Math.random() > 0.3 ? 'COMPLETED' : 'PROCESSING',
        estimatedCompletionTime: new Date(Date.now() + 15000).toISOString(),
        progress: Math.random() > 0.3 ? 100 : 75,
        downloadUrl: `https://localhost:${PORT}/api/reports/download/${reportId}`
    };

    res.json(reportStatus);
});

// ========== DEALERSHIPS ENDPOINTS ==========

// POST /dealerships/nearest/with-vehicle
app.post('/api/dealerships/nearest/with-vehicle', (req, res) => {
    console.log('Dealership search request:', req.body); // Добавьте лог

    const { currentLocation, vehicleCriteria, maxDistance = 100 } = req.body;

    if (!currentLocation || !currentLocation.x || !currentLocation.y) {
        return res.status(400).json(generateError(400, 'Missing or invalid currentLocation', req.path));
    }

    // Упрощенная логика поиска
    let nearestDealership = null;
    let minDistance = Infinity;

    dealerships.forEach(dealership => {
        const distance = Math.sqrt(
            Math.pow(dealership.location.x - currentLocation.x, 2) +
            Math.pow(dealership.location.y - currentLocation.y, 2)
        );

        console.log(`Dealership ${dealership.name} distance: ${distance}`); // Лог дистанций

        if (distance < minDistance && distance <= maxDistance) {
            minDistance = distance;
            nearestDealership = dealership;
        }
    });

    if (!nearestDealership) {
        console.log('No dealership found within max distance:', maxDistance);
        return res.status(404).json(generateError(404, 'No dealerships found within the specified distance', req.path));
    }

    console.log('Found dealership:', nearestDealership.name);

    // Всегда возвращаем какие-то транспортные средства для демо
    const availableVehicles = vehicles.slice(0, 3).map(vehicle => ({
        vehicle,
        price: calculateVehiclePrice(vehicle),
        availableCount: Math.floor(Math.random() * 3) + 1,
        discount: Math.random() > 0.8 ? 0.1 : 0,
        deliveryTime: '2-3 days'
    }));

    const result = {
        dealership: nearestDealership,
        distance: Math.round(minDistance * 10) / 10,
        availableVehicles: availableVehicles,
        estimatedTravelTime: `${Math.round(minDistance * 3)} minutes`,
        contactInfo: {
            phone: nearestDealership.phone,
            email: `info@${nearestDealership.name.toLowerCase().replace(/\s+/g, '')}.ru`,
            website: `https://${nearestDealership.name.toLowerCase().replace(/\s+/g, '')}.ru`
        },
        rating: nearestDealership.rating || 4.0
    };

    res.json(result);
});
// POST /dealerships/search/async (background search)
app.post('/api/dealerships/search/async', (req, res) => {
    const { currentLocation, vehicleCriteria, maxDistance = 100 } = req.body;

    const searchId = `search_${Date.now()}`;

    const searchStatus = {
        searchId,
        status: 'SEARCHING',
        resultsCount: 0,
        estimatedTimeRemaining: '30 seconds'
    };

    // Simulate background search
    setTimeout(() => {
        searchStatus.status = 'COMPLETED';
        searchStatus.resultsCount = Math.floor(Math.random() * 5) + 1;
    }, 30000);

    res.status(202).json(searchStatus);
});

// GET /dealerships/search/status/:searchId
app.get('/api/dealerships/search/status/:searchId', (req, res) => {
    const { searchId } = req.params;

    const searchStatus = {
        searchId,
        status: Math.random() > 0.5 ? 'COMPLETED' : 'SEARCHING',
        resultsCount: Math.random() > 0.5 ? Math.floor(Math.random() * 5) + 1 : 0,
        estimatedTimeRemaining: Math.random() > 0.5 ? '5 seconds' : '25 seconds'
    };

    res.json(searchStatus);
});

// GET /dealerships
app.get('/api/dealerships', (req, res) => {
    res.json(dealerships);
});

// ========== HELPER FUNCTIONS ==========

function calculateVehiclePrice(vehicle) {
    let basePrice = vehicle.enginePower * 100;
    if (vehicle.fuelType === 'ELECTRICITY') basePrice *= 1.2;
    if (vehicle.fuelType === 'NUCLEAR') basePrice *= 2.5;
    return Math.round(basePrice);
}

// ========== SSL CERTIFICATE LOADING ==========

const loadSSLCertificates = () => {
    try {
        // Путь к корневой директории проекта (на один уровень выше server)
        const rootDir = path.resolve(__dirname, '..');
        const keyPath = path.join(rootDir, 'localhost-key.pem');
        const certPath = path.join(rootDir, 'localhost.pem');

        console.log('Loading SSL certificates from:');
        console.log('Root directory:', rootDir);
        console.log('Key path:', keyPath);
        console.log('Cert path:', certPath);

        if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
            throw new Error('SSL certificates not found in root directory. Please generate them first.');
        }

        return {
            key: fs.readFileSync(keyPath),
            cert: fs.readFileSync(certPath)
        };
    } catch (error) {
        console.error('Failed to load SSL certificates:', error.message);
        console.log('\nPlease generate SSL certificates in the project root directory using:');
        console.log('openssl req -x509 -newkey rsa:4096 -keyout localhost-key.pem -out localhost.pem -days 365 -nodes -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"');
        console.log('\nOr run from project root: npm run generate-certs');
        process.exit(1);
    }
};

// ========== HEALTH CHECK ==========

app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        services: {
            vehicles: 'operational',
            shop: 'operational',
            reports: 'operational',
            dealerships: 'operational'
        }
    });
});

// Start HTTPS server
try {
    const sslOptions = loadSSLCertificates();

    https.createServer(sslOptions, app).listen(PORT, () => {
        console.log(`🚗 Vehicle Management API Server running on HTTPS://localhost:${PORT}`);
        console.log('📋 Available endpoints:');
        console.log('   BASIC VEHICLES:');
        console.log('     GET  /api/vehicles');
        console.log('     GET  /api/vehicles/:id');
        console.log('     POST /api/vehicles');
        console.log('     PATCH /api/vehicles/:id');
        console.log('     DELETE /api/vehicles/:id');
        console.log('     GET  /api/vehicles/stats/average-engine-power');
        console.log('     GET  /api/vehicles/stats/count-by-wheels/:wheels');
        console.log('     GET  /api/vehicles/search/name-starts-with/:prefix');
        console.log('');
        console.log('   SHOP:');
        console.log('     GET  /api/shop/search/by-engine-power/:from/:to');
        console.log('     PATCH /api/shop/add-wheels/:vehicleId/:numberOfWheels');
        console.log('');
        console.log('   REPORTS:');
        console.log('     GET  /api/reports/maintenance/:vehicleId');
        console.log('     POST /api/reports/maintenance/:vehicleId/generate');
        console.log('     GET  /api/reports/status/:reportId');
        console.log('');
        console.log('   DEALERSHIPS:');
        console.log('     POST /api/dealerships/nearest/with-vehicle');
        console.log('     POST /api/dealerships/search/async');
        console.log('     GET  /api/dealerships/search/status/:searchId');
        console.log('     GET  /api/dealerships');
        console.log('');
        console.log('   HEALTH:');
        console.log('     GET  /api/health');
    });
} catch (error) {
    console.error('Failed to start HTTPS server:', error.message);
    process.exit(1);
}