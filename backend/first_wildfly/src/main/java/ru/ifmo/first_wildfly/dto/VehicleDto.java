package ru.ifmo.first_wildfly.dto;

import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;
import jakarta.xml.bind.annotation.XmlSchemaType;
import jakarta.xml.bind.annotation.adapters.XmlJavaTypeAdapter;
import java.io.Serializable;
import java.time.OffsetDateTime;

// ⚠️ OffsetDateTime требует XmlAdapter для надёжной работы
// Если не хотите писать адаптер — замените на String
@XmlRootElement(name = "vehicle")
@XmlAccessorType(XmlAccessType.FIELD)
public class VehicleDto implements Serializable {

    private static final long serialVersionUID = 1L;

    @XmlElement
    private Integer id;

    @XmlElement
    private String name;

    @XmlElement
    private CoordinatesDto coordinates;

    @XmlElement
    // @XmlJavaTypeAdapter(OffsetDateTimeAdapter.class) // ← раскомментируйте, если напишете адаптер
    private String creationDate;

    @XmlElement
    private Integer enginePower;

    @XmlElement
    private Integer numberOfWheels;

    @XmlElement
    private Float capacity;

    @XmlElement
    private FuelTypeDto fuelType;

    public VehicleDto() {}

    public VehicleDto(Integer id, String name, CoordinatesDto coordinates,
                      String creationDate, Integer enginePower,
                      Integer numberOfWheels, Float capacity, FuelTypeDto fuelType) {
        this.id = id;
        this.name = name;
        this.coordinates = coordinates;
        this.creationDate = creationDate;
        this.enginePower = enginePower;
        this.numberOfWheels = numberOfWheels;
        this.capacity = capacity;
        this.fuelType = fuelType;
    }

    // Getters & Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public CoordinatesDto getCoordinates() { return coordinates; }
    public void setCoordinates(CoordinatesDto coordinates) { this.coordinates = coordinates; }

    public String getCreationDate() { return creationDate; }
    public void setCreationDate(String creationDate) { this.creationDate = creationDate; }

    public Integer getEnginePower() { return enginePower; }
    public void setEnginePower(Integer enginePower) { this.enginePower = enginePower; }

    public Integer getNumberOfWheels() { return numberOfWheels; }
    public void setNumberOfWheels(Integer numberOfWheels) { this.numberOfWheels = numberOfWheels; }

    public Float getCapacity() { return capacity; }
    public void setCapacity(Float capacity) { this.capacity = capacity; }

    public FuelTypeDto getFuelType() { return fuelType; }
    public void setFuelType(FuelTypeDto fuelType) { this.fuelType = fuelType; }
}