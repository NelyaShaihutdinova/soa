package ru.ifmo.first_wildfly.domain.entity;

import java.util.Arrays;
import java.util.Optional;

import static java.util.Objects.nonNull;

public enum FuelType {

    KEROSENE,
    ELECTRICITY,
    DIESEL,
    ALCOHOL,
    NUCLEAR;

    public static Optional<FuelType> getByName(String name) {
        return Arrays.stream(values())
                .filter(it -> nonNull(name) && it.name().equals(name))
                .findFirst();
    }
}
