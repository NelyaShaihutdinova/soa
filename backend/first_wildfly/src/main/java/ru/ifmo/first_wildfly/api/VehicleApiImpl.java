package ru.ifmo.first_wildfly.api;

import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.server.ResponseStatusException;
import ru.ifmo.first_wildfly.domain.VehiclePage;
import ru.ifmo.first_wildfly.domain.VehicleSearchCriteria;
import ru.ifmo.first_wildfly.exception.FirstException;
import ru.ifmo.first_wildfly.model.*;
import ru.ifmo.first_wildfly.service.VehicleService;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.springframework.http.ResponseEntity.ok;
import static org.springframework.http.ResponseEntity.status;

@RestController
@RequiredArgsConstructor
public class VehicleApiImpl implements VehiclesApi {

    private final VehicleService vehicleService;

    @Override
    public Optional<NativeWebRequest> getRequest() {
        return VehiclesApi.super.getRequest();
    }

    @Override
    public ResponseEntity<VehiclesGet200Response> vehiclesGet(Integer page,
                                                              Integer size,
                                                              String sort,
                                                              String order,
                                                              String name,
                                                              Integer minEnginePower,
                                                              Integer maxEnginePower,
                                                              Integer minWheels,
                                                              Integer maxWheels,
                                                              BigDecimal minCapacity,
                                                              BigDecimal maxCapacity,
                                                              String fuelType) {
        validateRangeParams(minEnginePower, maxEnginePower);
        validateRangeParams(minWheels, maxWheels);
        validateRangeParams(minCapacity, maxCapacity);

        var criteria = new VehicleSearchCriteria();
        criteria.setName(name);
        criteria.setMinEnginePower(minEnginePower);
        criteria.setMaxEnginePower(maxEnginePower);
        criteria.setMinWheels(minWheels);
        criteria.setMaxWheels(maxWheels);
        criteria.setMinCapacity(minCapacity);
        criteria.setMaxCapacity(maxCapacity);
        criteria.setFuelType(fuelType);

        VehiclePage vehiclePage = new VehiclePage();
        vehiclePage.setPage(page);
        vehiclePage.setSize(size);
        vehiclePage.setSort(sort);
        vehiclePage.setOrder(order);

        var result = vehicleService.getVehicles(criteria, vehiclePage);
        return ResponseEntity.ok(result);
    }

    private void validateRangeParams(Comparable min, Comparable max) {
        if (min != null && max != null && min.compareTo(max) > 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unbound filter parameters");
        }
    }

    @Override
    public ResponseEntity<Void> vehiclesIdDelete(Integer id) {
        vehicleService.delete(id);
        return status(204).build();
    }

    @Override
    public ResponseEntity<Vehicle> vehiclesIdGet(Integer id) {
        return vehicleService.getById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new FirstException(HttpStatus.NOT_FOUND, "Vehicle wasn't found"));
    }

    @Override
    public ResponseEntity<Vehicle> vehiclesIdPost(Integer id, VehicleUpdate vehicleUpdate) {
        return ok(vehicleService.update(id, vehicleUpdate));
    }

    @Override
    public ResponseEntity<Vehicle> vehiclesPost(VehicleCreate vehicleCreate) {
        return status(HttpStatusCode.valueOf(201))
                .body(vehicleService.createVehicle(vehicleCreate));
    }

    @Override
    public ResponseEntity<List<Vehicle>> vehiclesSearchNameStartsWithPrefixGet(String prefix) {
        return ok(vehicleService.vehiclesSearchNameStartsWithPrefix(prefix));
    }

    @Override
    public ResponseEntity<VehiclesStatsAverageEnginePowerGet200Response> vehiclesStatsAverageEnginePowerGet() {
        return ok(vehicleService.countAverageEnginePowerGet());
    }

    @Override
    public ResponseEntity<VehiclesStatsCountByWheelsWheelsGet200Response> vehiclesStatsCountByWheelsWheelsGet(Integer wheels) {
        return ok(vehicleService.getCountByWheelsWheels(wheels));
    }
}
