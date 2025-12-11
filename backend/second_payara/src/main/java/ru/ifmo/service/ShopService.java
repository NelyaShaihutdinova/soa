package ru.ifmo.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.ifmo.external.api.VehiclesApi;
import ru.ifmo.external.model.VehicleUpdate;
import ru.ifmo.external.model.VehiclesGet200Response;
import ru.ifmo.model.Coordinates;
import ru.ifmo.model.FuelType;
import ru.ifmo.model.Vehicle;

import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import static java.util.Collections.emptyList;
import static java.util.Objects.nonNull;
import static java.util.Optional.ofNullable;
import static java.util.stream.Stream.concat;

@Service
@RequiredArgsConstructor
public class ShopService {

    private final VehiclesApi vehiclesApi;

    public Vehicle addVehicleWheels(Integer vehicleId, Integer numberOfWheels) {
        var response = vehiclesApi.vehiclesIdPatch(vehicleId, buildRequestBody(numberOfWheels));
        return toResponseModel(response);
    }

    public List<Vehicle> findByEnginePower(Integer from, Integer to) {
        var firstPage = getVehiclesPageByEnginePower(from, to, 1);
        var totalPages = firstPage.getTotalPages();
        if (nonNull(totalPages) && totalPages > 1) {
            return mergeVehiclePages(from, to, totalPages, firstPage);
        }
        return ofNullable(firstPage.getContent()).map(content ->
                        content.stream().map(this::toResponseModel).collect(Collectors.toList())
                )
                .orElse(emptyList());
    }

    private List<Vehicle> mergeVehiclePages(Integer from, Integer to, Integer totalPages, VehiclesGet200Response firstPage) {
        var vehiclesStream = IntStream.range(2, totalPages - 1)
                .mapToObj(i -> getVehiclesPageByEnginePower(from, to, i))
                .map(VehiclesGet200Response::getContent)
                .filter(Objects::nonNull)
                .flatMap(Collection::stream);
        if (nonNull(firstPage.getContent())) {
            return concat(vehiclesStream, firstPage.getContent().stream())
                    .map(this::toResponseModel)
                    .collect(Collectors.toList());
        }
        return vehiclesStream.map(this::toResponseModel)
                .collect(Collectors.toList());
    }

    private VehiclesGet200Response getVehiclesPageByEnginePower(Integer from, Integer to, int page) {
        return vehiclesApi.vehiclesGet(
                page,
                20,
                null,
                null,
                null,
                from,
                to,
                null,
                null,
                null,
                null,
                null
        );
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

    private VehicleUpdate buildRequestBody(Integer numberOfWheels) {
        return new VehicleUpdate().numberOfWheels(numberOfWheels);
    }
}
