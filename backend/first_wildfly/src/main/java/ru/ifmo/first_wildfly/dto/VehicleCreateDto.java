package ru.ifmo.first_wildfly.dto;

import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;
import java.io.Serializable;

@XmlRootElement(name = "vehicleCreate")
@XmlAccessorType(XmlAccessType.FIELD)
public class VehicleCreateDto implements Serializable {

    private static final long serialVersionUID = 1L;

    @XmlElement
    private String name;

    @XmlElement
    private CoordinatesDto coordinates;

    @XmlElement
    private Integer enginePower;

    @XmlElement
    private Integer numberOfWheels;

    @XmlElement
    private Float capacity;

    @XmlElement
    private FuelTypeDto fuelType;

    public VehicleCreateDto() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public CoordinatesDto getCoordinates() { return coordinates; }
    public void setCoordinates(CoordinatesDto coordinates) { this.coordinates = coordinates; }

    public Integer getEnginePower() { return enginePower; }
    public void setEnginePower(Integer enginePower) { this.enginePower = enginePower; }

    public Integer getNumberOfWheels() { return numberOfWheels; }
    public void setNumberOfWheels(Integer numberOfWheels) { this.numberOfWheels = numberOfWheels; }

    public Float getCapacity() { return capacity; }
    public void setCapacity(Float capacity) { this.capacity = capacity; }

    public FuelTypeDto getFuelType() { return fuelType; }
    public void setFuelType(FuelTypeDto fuelType) { this.fuelType = fuelType; }
}