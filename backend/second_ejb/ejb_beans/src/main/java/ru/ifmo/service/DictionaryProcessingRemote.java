package ru.ifmo.service;

import jakarta.ejb.Remote;
import jakarta.validation.constraints.Min;
import ru.ifmo.external.model.Vehicle;
import ru.ifmo.model.MaintenanceReport;

import java.util.List;

@Remote
public interface DictionaryProcessingRemote {

    List<Vehicle> searchVehiclesByEnginePower(@Min(1) Integer from, @Min(1) Integer to);

    Vehicle addWheelsToVehicle(@Min(1) Integer vehicleId, @Min(1) Integer numberOfWheels);

    MaintenanceReport generateMaintenanceReport(@Min(1) Integer vehicleId, String format, Boolean includeDetails, Boolean includeCosts);

    List<Vehicle> searchVehiclesByCoordinates(Long x, Integer y, @Min(0) Integer maxDistance);
}