package ru.ifmo.api;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import ru.ifmo.external.api.VehiclesApi;
import ru.ifmo.model.*;

import java.time.OffsetDateTime;
import java.util.Arrays;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class ReportsApiImpl implements ReportsApi {

    private final VehiclesApi vehiclesApi;

    @Override
    public ResponseEntity<MaintenanceReport> reportsMaintenanceVehicleIdGet(
            Integer vehicleId,
            String format,
            Boolean includeDetails,
            Boolean includeCosts) {

        Vehicle vehicle;
        try {
            vehicle = toResponseModel(vehiclesApi.vehiclesIdGet(vehicleId));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }

        MaintenanceReport report = new MaintenanceReport();

        report.setVehicleId(vehicleId);
        report.setVehicleInfo(vehicle);
        report.setGeneratedAt(OffsetDateTime.now());

        MaintenanceReportReportPeriod reportPeriod = new MaintenanceReportReportPeriod();
        reportPeriod.setStartDate(vehicle.getCreationDate());
        reportPeriod.setEndDate(OffsetDateTime.now());
        report.setReportPeriod(reportPeriod);

        report.setTotalMaintenanceCount(5);

        if (Boolean.TRUE.equals(includeCosts)) {
            report.setTotalCost(15000.0);
        }

        if (Boolean.TRUE.equals(includeDetails)) {
            List<MaintenanceRecord> records = createMaintenanceRecords(vehicleId);
            report.setMaintenanceRecords(records);
        }

        MaintenanceStatistics statistics = new MaintenanceStatistics();
        statistics.setAverageCostPerMaintenance(3000.0);
        statistics.setTotalDowntimeHours(48.5);
        report.setStatistics(statistics);

        return ResponseEntity.ok(report);
    }

    private List<MaintenanceRecord> createMaintenanceRecords(Integer vehicleId) {
        MaintenanceRecord record1 = new MaintenanceRecord();
        record1.setId(1);
        record1.setDate(OffsetDateTime.now().minusMonths(3));
        record1.setMileage(10000);
        record1.setDescription("Регулярное техническое обслуживание");
        record1.setCost(5000.0);
        record1.setPartsReplaced(Arrays.asList("Масло двигателя", "Фильтр масляный", "Фильтр воздушный"));
        record1.setTechnician("Иванов А.С.");
        record1.setDurationHours(2.5F);

        MaintenanceRecord record2 = new MaintenanceRecord();
        record2.setId(2);
        record2.setDate(OffsetDateTime.now().minusMonths(6));
        record2.setMileage(20000);
        record2.setDescription("Замена тормозных колодок");
        record2.setCost(8000.0);
        record2.setPartsReplaced(Arrays.asList("Тормозные колодки", "Тормозная жидкость"));
        record2.setTechnician("Петров В.И.");
        record2.setDurationHours(3.0F);

        MaintenanceRecord record3 = new MaintenanceRecord();
        record3.setId(3);
        record3.setDate(OffsetDateTime.now().minusMonths(1));
        record3.setMileage(15000);
        record3.setDescription("Замена свечей зажигания");
        record3.setCost(2000.0);
        record3.setPartsReplaced(Arrays.asList("Свечи зажигания"));
        record3.setTechnician("Сидоров П.М.");
        record3.setDurationHours(1.5F);

        return Arrays.asList(record1, record2, record3);
    }

    private Vehicle toResponseModel(ru.ifmo.external.model.Vehicle response) {
        var vehicle = new Vehicle(
                response.getId(),
                response.getName(),
                toResponseModel(response.getCoordinates()),
                response.getCreationDate(),
                response.getCapacity(),
                toResponseModel(response.getFuelType())
        );
        return vehicle.enginePower(response.getEnginePower())
                .numberOfWheels(response.getNumberOfWheels());
    }

    private FuelType toResponseModel(ru.ifmo.external.model.FuelType fuelType) {
        return FuelType.valueOf(fuelType.getValue());
    }

    private Coordinates toResponseModel(ru.ifmo.external.model.Coordinates coordinates) {
        return new Coordinates(coordinates.getX(), coordinates.getY());
    }
}
