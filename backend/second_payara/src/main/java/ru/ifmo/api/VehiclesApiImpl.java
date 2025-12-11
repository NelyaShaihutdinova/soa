package ru.ifmo.api;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import ru.ifmo.model.Vehicle;
import ru.ifmo.service.VehiclesService;

import java.util.List;

import static org.springframework.http.ResponseEntity.ok;

@RestController
@RequiredArgsConstructor
public class VehiclesApiImpl implements VehiclesApi {

    private final VehiclesService vehiclesService;

    @Override
    public ResponseEntity<List<Vehicle>> vehiclesSearchByCoordinatesGet(Long x, Integer y, Long maxDistance) {
        return ok(vehiclesService.searchByCoordinates(x, y, maxDistance));
    }
}
