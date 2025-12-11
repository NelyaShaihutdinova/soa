package ru.ifmo.service;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.ifmo.external.api.VehiclesApi;
import ru.ifmo.external.model.VehiclesGet200Response;
import ru.ifmo.model.Coordinates;
import ru.ifmo.model.FuelType;
import ru.ifmo.model.Vehicle;

import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.stream.IntStream;

import static java.util.Collections.emptyList;
import static java.util.Objects.nonNull;
import static java.util.Optional.ofNullable;
import static java.util.stream.Collectors.toList;
import static java.util.stream.Stream.concat;

@Service
@RequiredArgsConstructor
public class VehiclesService {

    private final VehiclesApi vehiclesApi;

    public List<Vehicle> searchByCoordinates(Long x, Integer y, Long maxDistance) {
        var firstPage = getVehiclesPage(1);
        var totalPages = firstPage.getTotalPages();
        return getAllVehicles(totalPages, firstPage)
                .stream()
                .filter(vehicle -> filterByCoordinates(vehicle.getCoordinates(), x, y, maxDistance))
                .collect(toList());
    }

    private List<Vehicle> getAllVehicles(Integer totalPages, VehiclesGet200Response firstPage) {
        if (nonNull(totalPages) && totalPages > 1) {
            return mergeVehiclePages(totalPages, firstPage);
        }
        return ofNullable(firstPage.getContent()).map(content ->
                        content.stream().map(this::toResponseModel).collect(toList())
                )
                .orElse(emptyList());
    }

    private boolean filterByCoordinates(@NotNull @Valid Coordinates coordinates, Long x, Integer y, Long maxDistance) {
        long dx = coordinates.getX() - x;
        long dy = coordinates.getY().longValue() - y;
        long distanceSquared = dx * dx + dy * dy;
        long maxDistanceSquared = maxDistance * maxDistance;

        return distanceSquared <= maxDistanceSquared;
    }

    private List<Vehicle> mergeVehiclePages(Integer totalPages, VehiclesGet200Response firstPage) {
        var vehiclesStream = IntStream.range(2, totalPages - 1)
                .mapToObj(this::getVehiclesPage)
                .map(VehiclesGet200Response::getContent)
                .filter(Objects::nonNull)
                .flatMap(Collection::stream);
        if (nonNull(firstPage.getContent())) {
            return concat(vehiclesStream, firstPage.getContent().stream())
                    .map(this::toResponseModel)
                    .collect(toList());
        }
        return vehiclesStream.map(this::toResponseModel)
                .collect(toList());
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

    private VehiclesGet200Response getVehiclesPage(int page) {
        return vehiclesApi.vehiclesGet(
                page,
                20,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null
        );
    }
}
