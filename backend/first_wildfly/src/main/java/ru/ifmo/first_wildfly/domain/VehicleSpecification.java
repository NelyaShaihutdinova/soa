package ru.ifmo.first_wildfly.domain;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import ru.ifmo.first_wildfly.domain.entity.VehicleEntity;

import java.math.BigDecimal;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class VehicleSpecification {

    public static Specification<VehicleEntity> withName(String name) {
        return (root, query, criteriaBuilder) -> {
            if (name == null || name.isBlank()) {
                return null;
            }
            String pattern = "%" + name.toLowerCase() + "%";
            return criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), pattern);
        };
    }

    public static Specification<VehicleEntity> withEnginePowerBetween(Integer min, Integer max) {
        return (root, query, criteriaBuilder) -> {
            if (min == null && max == null) return null;

            if (min != null && max != null) {
                return criteriaBuilder.between(root.get("enginePower"), min, max);
            } else if (min != null) {
                return criteriaBuilder.greaterThanOrEqualTo(root.get("enginePower"), min);
            } else {
                return criteriaBuilder.lessThanOrEqualTo(root.get("enginePower"), max);
            }
        };
    }

    public static Specification<VehicleEntity> withNumberOfWheelsBetween(Integer min, Integer max) {
        return (root, query, criteriaBuilder) -> {
            if (min == null && max == null) return null;

            if (min != null && max != null) {
                return criteriaBuilder.between(root.get("numberOfWheels"), min, max);
            } else if (min != null) {
                return criteriaBuilder.greaterThanOrEqualTo(root.get("numberOfWheels"), min);
            } else {
                return criteriaBuilder.lessThanOrEqualTo(root.get("numberOfWheels"), max);
            }
        };
    }

    public static Specification<VehicleEntity> withCapacityBetween(BigDecimal min, BigDecimal max) {
        return (root, query, criteriaBuilder) -> {
            if (min == null && max == null) return null;

            if (min != null && max != null) {
                return criteriaBuilder.between(root.get("capacity"), min, max);
            } else if (min != null) {
                return criteriaBuilder.greaterThanOrEqualTo(root.get("capacity"), min);
            } else {
                return criteriaBuilder.lessThanOrEqualTo(root.get("capacity"), max);
            }
        };
    }

    public static Specification<VehicleEntity> withFuelType(String fuelType) {
        return (root, query, criteriaBuilder) ->
                fuelType == null ? null : criteriaBuilder.equal(root.get("fuelType"), fuelType);
    }

    public static Specification<VehicleEntity> buildSpecification(VehicleSearchCriteria criteria) {
        return Specification.where(withName(criteria.getName()))
                .and(withEnginePowerBetween(criteria.getMinEnginePower(), criteria.getMaxEnginePower()))
                .and(withNumberOfWheelsBetween(criteria.getMinWheels(), criteria.getMaxWheels()))
                .and(withCapacityBetween(criteria.getMinCapacity(), criteria.getMaxCapacity()))
                .and(withFuelType(criteria.getFuelType()));
    }
}