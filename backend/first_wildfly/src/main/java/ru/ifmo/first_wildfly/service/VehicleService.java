package ru.ifmo.first_wildfly.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import ru.ifmo.first_wildfly.domain.VehiclePage;
import ru.ifmo.first_wildfly.domain.VehicleRepository;
import ru.ifmo.first_wildfly.domain.VehicleSearchCriteria;
import ru.ifmo.first_wildfly.domain.VehicleSpecification;
import ru.ifmo.first_wildfly.domain.entity.CoordinatesEntity;
import ru.ifmo.first_wildfly.domain.entity.FuelType;
import ru.ifmo.first_wildfly.domain.entity.VehicleEntity;
import ru.ifmo.first_wildfly.exception.FirstException;
import ru.ifmo.first_wildfly.model.*;

import java.time.ZonedDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static java.util.Objects.isNull;
import static java.util.Objects.nonNull;

@Service
@RequiredArgsConstructor
public class VehicleService {

    @PersistenceContext
    private EntityManager entityManager;

    private final VehicleRepository vehicleRepository;

    @Transactional
    public Vehicle createVehicle(VehicleCreate vehicleCreate) {
        var created = vehicleRepository.save(toEntity(vehicleCreate));
        return toModel(created);
    }

    public Optional<Vehicle> getById(Integer id) {
        return vehicleRepository.findById(id)
                .map(this::toModel);
    }

    @Transactional
    public void delete(Integer id) {
        if (!vehicleRepository.existsById(id)) {
            throw new FirstException(HttpStatus.NOT_FOUND, "Vehicle wasn't found");
        }
        vehicleRepository.deleteById(id);
    }

    public VehiclesGet200Response getVehicles(VehicleSearchCriteria criteria, VehiclePage vehiclePage) {
        var spec = VehicleSpecification.buildSpecification(criteria);
        var sort = buildSort(vehiclePage.getSort(), vehiclePage.getOrder());
        var pageable = PageRequest.of(
                vehiclePage.getPage() - 1,
                vehiclePage.getSize(),
                sort
        );
        var page = vehicleRepository.findAll(spec, pageable);
        return buildGetVehiclesResponse(page);
    }

    @Transactional
    public Vehicle update(Integer id, VehicleUpdate vehicleUpdate) {
        var optionalVehicle = vehicleRepository.findById(id);
        if (optionalVehicle.isEmpty()) {
            throw new FirstException(HttpStatus.NOT_FOUND, "Vehicle wasn't found");
        }
        var vehicle = optionalVehicle.get();
        if (nonNull(vehicleUpdate.getCapacity())) {
            vehicle.setCapacity(vehicleUpdate.getCapacity());
        }
        if (nonNull(vehicleUpdate.getName())) {
            vehicle.setName(vehicleUpdate.getName());
        }
        if (nonNull(vehicleUpdate.getEnginePower())) {
            vehicle.setEnginePower(vehicleUpdate.getEnginePower().longValue());
        }
        if (nonNull(vehicleUpdate.getFuelType())) {
            vehicle.setFuelType(resolveFuelType(vehicleUpdate));
        }
        if (nonNull(vehicleUpdate.getNumberOfWheels())) {
            vehicle.setNumberOfWheels(vehicleUpdate.getNumberOfWheels().longValue());
        }
        if (nonNull(vehicleUpdate.getCoordinates())) {
            var coordinates = vehicle.getCoordinates();
            if (nonNull(vehicleUpdate.getCoordinates().getX())) {
                coordinates.setX(vehicleUpdate.getCoordinates().getX());
            }
            if (nonNull(vehicleUpdate.getCoordinates().getY())) {
                coordinates.setX(vehicleUpdate.getCoordinates().getY());
            }
        }
        return toModel(vehicle);
    }

    public List<Vehicle> vehiclesSearchNameStartsWithPrefix(String prefix) {
        return vehicleRepository.findAll(buildPrefixSearchSpec(prefix))
                .stream()
                .map(this::toModel)
                .toList();
    }

    public VehiclesStatsAverageEnginePowerGet200Response countAverageEnginePowerGet() {
        var criteriaBuilder = entityManager.getCriteriaBuilder();
        var query = criteriaBuilder.createQuery(Double.class);
        var root = query.from(VehicleEntity.class);

        query.select(criteriaBuilder.avg(root.get("enginePower")));

        var averageEnginePower = entityManager.createQuery(query)
                .getSingleResult();
        if (isNull(averageEnginePower)) {
            throw new FirstException(HttpStatus.NOT_FOUND, "No vehicles in collection");
        }
        return new VehiclesStatsAverageEnginePowerGet200Response()
                .averageEnginePower(averageEnginePower.floatValue());
    }

    public VehiclesStatsCountByWheelsWheelsGet200Response getCountByWheelsWheels(Integer wheels) {
        var count = (int) vehicleRepository.count((r, q, c) -> c.equal(r.get("numberOfWheels"), wheels));
        return new VehiclesStatsCountByWheelsWheelsGet200Response()
                .count(count);
    }

    private Specification<VehicleEntity> buildPrefixSearchSpec(String prefix) {
        return (Root<VehicleEntity> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) -> {
            return criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("name")),
                    prefix.toLowerCase() + "%"
            );
        };
    }

    private FuelType resolveFuelType(VehicleUpdate vehicleUpdate) {
        return FuelType.getByName(vehicleUpdate.getFuelType().name())
                .orElseThrow(() -> new FirstException(HttpStatus.BAD_REQUEST, "Wrong fuel type"));
    }

    private VehiclesGet200Response buildGetVehiclesResponse(Page<VehicleEntity> page) {
        var response = new VehiclesGet200Response();
        response.setTotalPages(page.getTotalPages());
        response.setCurrentPage(page.getNumber() + 1);
        response.setTotalElements((int) page.getTotalElements());
        var content = page.getContent().stream()
                .map(this::toModel)
                .collect(Collectors.toList());
        response.setContent(content);
        return response;
    }

    private Sort buildSort(String sortField, String order) {
        if (sortField == null) {
            return Sort.by("id").ascending();
        }

        var allowedSortFields = Arrays.asList("name", "enginePower", "numberOfWheels", "capacity", "fuelType");
        var actualSortField = allowedSortFields.contains(sortField) ? sortField : "id";

        return order.equalsIgnoreCase("desc")
                ? Sort.by(actualSortField).descending()
                : Sort.by(actualSortField).ascending();
    }

    private Vehicle toModel(VehicleEntity entity) {
        var model = new Vehicle(
                entity.getId(),
                entity.getName(),
                toModel(entity.getCoordinates()),
                nonNull(entity.getCreationDate()) ? entity.getCreationDate().toOffsetDateTime() : null,
                entity.getCapacity(),
                toModel(entity.getFuelType())
        );
        if (nonNull(entity.getEnginePower())) {
            model.setEnginePower(entity.getEnginePower().intValue());
        }
        if (nonNull(entity.getNumberOfWheels())) {
            model.setNumberOfWheels(entity.getNumberOfWheels().intValue());
        }
        return model;
    }

    private ru.ifmo.first_wildfly.model.FuelType toModel(FuelType fuelType) {
        return ru.ifmo.first_wildfly.model.FuelType.fromValue(fuelType.name());
    }

    private Coordinates toModel(CoordinatesEntity coordinates) {
        return new Coordinates(
                coordinates.getX(),
                coordinates.getY()
        );
    }

    private VehicleEntity toEntity(VehicleCreate vehicleCreate) {
        var coordinates = CoordinatesEntity.builder()
                .x(vehicleCreate.getCoordinates().getX())
                .y(vehicleCreate.getCoordinates().getY())
                .build();
        return VehicleEntity.builder()
                .name(vehicleCreate.getName())
                .fuelType(resolveFuelType(vehicleCreate))
                .enginePower(nonNull(vehicleCreate.getEnginePower()) ? vehicleCreate.getEnginePower().longValue() : null)
                .capacity(vehicleCreate.getCapacity())
                .numberOfWheels(nonNull(vehicleCreate.getNumberOfWheels()) ? vehicleCreate.getNumberOfWheels().longValue() : null)
                .coordinates(coordinates)
                .creationDate(ZonedDateTime.now())
                .build();
    }

    private FuelType resolveFuelType(VehicleCreate vehicleCreate) {
        return FuelType.getByName(vehicleCreate.getFuelType().name())
                .orElseThrow(() -> new FirstException(HttpStatus.BAD_REQUEST, "Wrong fuel type"));
    }
}
