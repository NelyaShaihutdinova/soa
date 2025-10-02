package ru.ifmo.first_wildfly.domain;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class VehicleSearchCriteria {

    private String name;
    private Integer minEnginePower;
    private Integer maxEnginePower;
    private Integer minWheels;
    private Integer maxWheels;
    private BigDecimal minCapacity;
    private BigDecimal maxCapacity;
    private String fuelType;
}