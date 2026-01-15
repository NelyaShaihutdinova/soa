package ru.ifmo.first_wildfly.service;

import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.*;
import jakarta.transaction.Transactional;
import ru.ifmo.first_wildfly.domain.VehiclePage;
import ru.ifmo.first_wildfly.domain.VehicleSearchCriteria;
import ru.ifmo.first_wildfly.domain.entity.CoordinatesEntity;
import ru.ifmo.first_wildfly.domain.entity.FuelType;
import ru.ifmo.first_wildfly.domain.entity.VehicleEntity;
import ru.ifmo.first_wildfly.dto.*;
import ru.ifmo.first_wildfly.exception.FirstException;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static java.time.format.DateTimeFormatter.ISO_OFFSET_DATE_TIME;
import static java.util.Objects.isNull;
import static java.util.Objects.nonNull;

@Stateless
public class VehicleService {

    @PersistenceContext
    private EntityManager entityManager;

    // --- CREATE ---
    @Transactional
    public VehicleDto createVehicle(VehicleCreateDto dto) {
        var entity = toEntity(dto);
        entityManager.persist(entity);
        return toDto(entity);
    }

    // --- READ by ID ---
    public Optional<VehicleDto> getById(Integer id) {
        VehicleEntity entity = entityManager.find(VehicleEntity.class, id);
        return entity != null ? Optional.of(toDto(entity)) : Optional.empty();
    }

    // --- DELETE ---
    @Transactional
    public void delete(Integer id) {
        VehicleEntity entity = entityManager.find(VehicleEntity.class, id);
        if (entity == null) {
            throw new FirstException("Vehicle wasn't found");
        }
        entityManager.remove(entity);
    }

    // --- GET LIST with filtering, sorting, pagination ---
    public PagedVehicleResponseDto getVehicles(VehicleSearchCriteria criteria, VehiclePage pageParams) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();

        // Count total
        CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
        Root<VehicleEntity> countRoot = countQuery.from(VehicleEntity.class);
        countQuery.select(cb.count(countRoot));
        applyFilters(countRoot, countQuery, cb, criteria);
        Long total = entityManager.createQuery(countQuery).getSingleResult();

        if (total == 0) {
            return emptyPagedResponse(pageParams.getPage(), total.intValue());
        }

        // Main query
        CriteriaQuery<VehicleEntity> query = cb.createQuery(VehicleEntity.class);
        Root<VehicleEntity> root = query.from(VehicleEntity.class);
        applyFilters(root, query, cb, criteria);

        // Sorting
        String sortField = pageParams.getSort();
        if (sortField == null || !isValidSortField(sortField)) {
            sortField = "id";
        }
        Order order = "desc".equalsIgnoreCase(pageParams.getOrder())
                ? cb.desc(root.get(sortField))
                : cb.asc(root.get(sortField));
        query.orderBy(order);

        TypedQuery<VehicleEntity> typedQuery = entityManager.createQuery(query);

        // Pagination
        int page = pageParams.getPage() != null ? pageParams.getPage() : 1;
        int size = pageParams.getSize() != null ? pageParams.getSize() : 20;
        if (page < 1) page = 1;
        if (size < 1) size = 20;
        if (size > 100) size = 100;

        typedQuery.setFirstResult((page - 1) * size);
        typedQuery.setMaxResults(size);

        List<VehicleEntity> content = typedQuery.getResultList();

        return buildPagedResponse(content, total.intValue(), page, size);
    }

    // --- UPDATE ---
    @Transactional
    public VehicleDto update(Integer id, VehicleUpdateDto dto) {
        VehicleEntity entity = entityManager.find(VehicleEntity.class, id);
        if (entity == null) {
            throw new FirstException("Vehicle wasn't found");
        }

        if (nonNull(dto.getName())) entity.setName(dto.getName());
        if (nonNull(dto.getCapacity())) entity.setCapacity(dto.getCapacity());
        if (nonNull(dto.getEnginePower())) entity.setEnginePower(dto.getEnginePower().longValue());
        if (nonNull(dto.getNumberOfWheels())) entity.setNumberOfWheels(dto.getNumberOfWheels().longValue());
        if (nonNull(dto.getFuelType())) entity.setFuelType(toEntityFuelType(dto.getFuelType()));

        if (nonNull(dto.getCoordinates())) {
            CoordinatesEntity coords = entity.getCoordinates();
            if (nonNull(dto.getCoordinates().getX())) coords.setX(dto.getCoordinates().getX());
            if (nonNull(dto.getCoordinates().getY())) coords.setY(dto.getCoordinates().getY());
        }

        // No need to call persist/merge — entity is managed
        return toDto(entity);
    }

    // --- SEARCH by prefix ---
    public List<VehicleDto> vehiclesSearchNameStartsWithPrefix(String prefix) {
        String jpql = "SELECT v FROM VehicleEntity v WHERE LOWER(v.name) LIKE :prefix";
        TypedQuery<VehicleEntity> query = entityManager.createQuery(jpql, VehicleEntity.class);
        query.setParameter("prefix", prefix.toLowerCase() + "%");
        return query.getResultList().stream().map(this::toDto).collect(Collectors.toList());
    }

    // --- STAT: average engine power ---
    public AverageEnginePowerResponseDto countAverageEnginePowerGet() {
        Double avg = entityManager.createQuery(
                        "SELECT AVG(v.enginePower) FROM VehicleEntity v", Double.class)
                .getSingleResult();
        if (isNull(avg)) {
            throw new FirstException("No vehicles in collection");
        }
        return new AverageEnginePowerResponseDto(avg.floatValue());
    }

    // --- STAT: count by wheels ---
    public CountByWheelsResponseDto getCountByWheelsWheels(Integer wheels) {
        Long count = entityManager.createQuery(
                        "SELECT COUNT(v) FROM VehicleEntity v WHERE v.numberOfWheels = :wheels", Long.class)
                .setParameter("wheels", wheels.longValue())
                .getSingleResult();
        return new CountByWheelsResponseDto(count.intValue());
    }

    // --- HELPERS ---

    private void applyFilters(Root<VehicleEntity> root, CriteriaQuery<?> query, CriteriaBuilder cb, VehicleSearchCriteria c) {
        Predicate predicate = cb.conjunction();

        if (c.getName() != null && !c.getName().isEmpty()) {
            predicate = cb.and(predicate, cb.equal(root.get("name"), c.getName()));
        }

        if (c.getMinEnginePower() != null) {
            predicate = cb.and(predicate, cb.ge(root.get("enginePower"), c.getMinEnginePower().longValue()));
        }
        if (c.getMaxEnginePower() != null) {
            predicate = cb.and(predicate, cb.le(root.get("enginePower"), c.getMaxEnginePower().longValue()));
        }

        if (c.getMinWheels() != null) {
            predicate = cb.and(predicate, cb.ge(root.get("numberOfWheels"), c.getMinWheels().longValue()));
        }
        if (c.getMaxWheels() != null) {
            predicate = cb.and(predicate, cb.le(root.get("numberOfWheels"), c.getMaxWheels().longValue()));
        }

        if (c.getMinCapacity() != null) {
            predicate = cb.and(predicate, cb.gt(root.get("capacity"), c.getMinCapacity().floatValue()));
        }
        if (c.getMaxCapacity() != null) {
            predicate = cb.and(predicate, cb.le(root.get("capacity"), c.getMaxCapacity().floatValue()));
        }

        if (c.getFuelType() != null && !c.getFuelType().isEmpty()) {
            try {
                FuelType fuel = FuelType.valueOf(c.getFuelType());
                predicate = cb.and(predicate, cb.equal(root.get("fuelType"), fuel));
            } catch (IllegalArgumentException ignored) {
                // invalid fuel → no match
                predicate = cb.and(predicate, cb.disjunction()); // always false
            }
        }

        query.where(predicate);
    }

    private boolean isValidSortField(String field) {
        return List.of("id", "name", "enginePower", "numberOfWheels", "capacity", "fuelType").contains(field);
    }

    private PagedVehicleResponseDto buildPagedResponse(List<VehicleEntity> content, int totalElements, int currentPage, int size) {
        int totalPages = (int) Math.ceil((double) totalElements / size);
        return new PagedVehicleResponseDto(
                content.stream().map(this::toDto).collect(Collectors.toList()),
                totalElements,
                totalPages,
                currentPage
        );
    }

    private PagedVehicleResponseDto emptyPagedResponse(int requestedPage, int totalElements) {
        return new PagedVehicleResponseDto(
                List.of(),
                totalElements,
                0,
                requestedPage
        );
    }

    // --- MAPPING ---

    private VehicleDto toDto(VehicleEntity e) {
        return new VehicleDto(
                e.getId(),
                e.getName(),
                new CoordinatesDto(e.getCoordinates().getX(), e.getCoordinates().getY()),
                e.getCreationDate() != null ? e.getCreationDate().format(ISO_OFFSET_DATE_TIME) : null,
                e.getEnginePower() != null ? e.getEnginePower().intValue() : null,
                e.getNumberOfWheels() != null ? e.getNumberOfWheels().intValue() : null,
                e.getCapacity(),
                toDtoFuelType(e.getFuelType())
        );
    }

    private FuelTypeDto toDtoFuelType(FuelType entity) {
        return FuelTypeDto.valueOf(entity.name());
    }

    private FuelType toEntityFuelType(FuelTypeDto dto) {
        return FuelType.valueOf(dto.name());
    }

    private VehicleEntity toEntity(VehicleCreateDto dto) {
        var coords = new CoordinatesEntity();
        coords.setX(dto.getCoordinates().getX());
        coords.setY(dto.getCoordinates().getY());

        var entity = new VehicleEntity();
        entity.setName(dto.getName());
        entity.setCoordinates(coords);
        entity.setCapacity(dto.getCapacity());
        entity.setEnginePower(dto.getEnginePower() != null ? dto.getEnginePower().longValue() : null);
        entity.setNumberOfWheels(dto.getNumberOfWheels() != null ? dto.getNumberOfWheels().longValue() : null);
        entity.setFuelType(toEntityFuelType(dto.getFuelType()));
        entity.setCreationDate(ZonedDateTime.now());
        return entity;
    }
}
