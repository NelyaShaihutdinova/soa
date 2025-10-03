package ru.ifmo.api;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import ru.ifmo.model.Vehicle;
import ru.ifmo.service.ShopService;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ShopApiImpl implements ShopApi {

    private final ShopService shopService;

    @Override
    public ResponseEntity<Vehicle> shopAddWheelsVehicleIdNumberOfWheelsPatch(Integer vehicleId, Integer numberOfWheels) {
        Vehicle vehicle = shopService.addVehicleWheels(vehicleId, numberOfWheels);
        return ResponseEntity.ok(vehicle);
    }

    @Override
    public ResponseEntity<List<Vehicle>> shopSearchByEnginePowerFromToGet(Integer from, Integer to) {
        return ShopApi.super.shopSearchByEnginePowerFromToGet(from, to);
    }
}
