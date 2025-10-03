package ru.ifmo.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.ifmo.external.api.VehiclesApi;
import ru.ifmo.external.model.VehicleUpdate;
import ru.ifmo.model.Coordinates;
import ru.ifmo.model.FuelType;
import ru.ifmo.model.Vehicle;

@Service
@RequiredArgsConstructor
public class ShopService {

    private final VehiclesApi vehiclesApi;

    public Vehicle addVehicleWheels(Integer vehicleId, Integer numberOfWheels) {
        var response = vehiclesApi.vehiclesIdPatch(vehicleId, buildRequestBody(numberOfWheels));
        return toResponseModel(response);
    }

    private Vehicle toResponseModel(ru.ifmo.external.model.Vehicle response) {
        return new Vehicle(
                response.getId(),
                response.getName(),
                toResponseModel(response.getCoordinates()),
                response.getCreationDate(),
                response.getCapacity(),
                toResponseModel(response.getFuelType())
        );
    }

    private FuelType toResponseModel(ru.ifmo.external.model.FuelType fuelType) {
        return FuelType.valueOf(fuelType.getValue());
    }

    private Coordinates toResponseModel(ru.ifmo.external.model.Coordinates coordinates) {
        return new Coordinates(coordinates.getX(), coordinates.getY());
    }

    private VehicleUpdate buildRequestBody(Integer numberOfWheels) {
        return new VehicleUpdate().numberOfWheels(numberOfWheels);
    }
}
