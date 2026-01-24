package ru.ifmo.first_wildfly.dto;

import jakarta.xml.bind.annotation.XmlEnum;
import jakarta.xml.bind.annotation.XmlEnumValue;
import jakarta.xml.bind.annotation.XmlType;

@XmlType(name = "fuelType")
@XmlEnum
public enum FuelTypeDto {
    @XmlEnumValue("KEROSENE")
    KEROSENE,
    @XmlEnumValue("ELECTRICITY")
    ELECTRICITY,
    @XmlEnumValue("DIESEL")
    DIESEL,
    @XmlEnumValue("ALCOHOL")
    ALCOHOL,
    @XmlEnumValue("NUCLEAR")
    NUCLEAR
}