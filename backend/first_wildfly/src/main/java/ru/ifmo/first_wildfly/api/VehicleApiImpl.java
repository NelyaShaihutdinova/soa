package ru.ifmo.first_wildfly.api;

import jakarta.ejb.EJB;
import jakarta.jws.WebMethod;
import jakarta.jws.WebParam;
import jakarta.jws.WebService;
import ru.ifmo.first_wildfly.dto.*;
import ru.ifmo.first_wildfly.exception.FirstException;
import ru.ifmo.first_wildfly.service.VehicleService;

import java.util.List;

@WebService(
        serviceName = "VehicleAPI"
)
public class VehicleApiImpl {

    @EJB
    private VehicleService vehicleService;

    @WebMethod
    public PagedVehicleResponseDto getVehicles(
            @WebParam(name = "page") Integer page,
            @WebParam(name = "size") Integer size,
            @WebParam(name = "sort") String sort,
            @WebParam(name = "order") String order,
            @WebParam(name = "name") String name,
            @WebParam(name = "minEnginePower") Integer minEnginePower,
            @WebParam(name = "maxEnginePower") Integer maxEnginePower,
            @WebParam(name = "minWheels") Integer minWheels,
            @WebParam(name = "maxWheels") Integer maxWheels,
            @WebParam(name = "minCapacity") Float minCapacity,
            @WebParam(name = "maxCapacity") Float maxCapacity,
            @WebParam(name = "fuelType") String fuelType) {

        var criteria = new ru.ifmo.first_wildfly.domain.VehicleSearchCriteria();
        criteria.setName(name);
        criteria.setMinEnginePower(minEnginePower);
        criteria.setMaxEnginePower(maxEnginePower);
        criteria.setMinWheels(minWheels);
        criteria.setMaxWheels(maxWheels);
        criteria.setMinCapacity(minCapacity != null ? java.math.BigDecimal.valueOf(minCapacity) : null);
        criteria.setMaxCapacity(maxCapacity != null ? java.math.BigDecimal.valueOf(maxCapacity) : null);
        criteria.setFuelType(fuelType);

        var pageParams = new ru.ifmo.first_wildfly.domain.VehiclePage();
        pageParams.setPage(page);
        pageParams.setSize(size);
        pageParams.setSort(sort);
        pageParams.setOrder(order);

        return vehicleService.getVehicles(criteria, pageParams);
    }

    @WebMethod
    public VehicleDto getVehicleById(@WebParam(name = "id") Integer id) {
        return vehicleService.getById(id)
                .orElseThrow(() -> new FirstException("Vehicle not found", 404));
    }

    @WebMethod
    public VehicleDto createVehicle(@WebParam(name = "vehicle") VehicleCreateDto vehicle) {
        return vehicleService.createVehicle(vehicle);
    }

    @WebMethod
    public VehicleDto updateVehicle(
            @WebParam(name = "id") Integer id,
            @WebParam(name = "vehicle") VehicleUpdateDto vehicle) {
        return vehicleService.update(id, vehicle);
    }

    @WebMethod
    public void deleteVehicle(@WebParam(name = "id") Integer id) {
        vehicleService.delete(id);
    }

    @WebMethod
    public List<VehicleDto> searchByNamePrefix(@WebParam(name = "prefix") String prefix) {
        return vehicleService.vehiclesSearchNameStartsWithPrefix(prefix);
    }

    @WebMethod
    public AverageEnginePowerResponseDto getAverageEnginePower() {
        return vehicleService.countAverageEnginePowerGet();
    }

    @WebMethod
    public CountByWheelsResponseDto getCountByWheels(@WebParam(name = "wheels") Integer wheels) {
        return vehicleService.getCountByWheelsWheels(wheels);
    }
}
