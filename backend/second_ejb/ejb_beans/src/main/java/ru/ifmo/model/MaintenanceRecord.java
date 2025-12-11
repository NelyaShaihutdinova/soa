package ru.ifmo.model;

import java.time.LocalDateTime;
import java.util.List;

public class MaintenanceRecord {
    private Integer id;
    private LocalDateTime date;
    private Integer mileage;
    private String description;
    private Double cost;
    private List<String> partsReplaced;
    private String technician;
    private Float durationHours;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public Integer getMileage() {
        return mileage;
    }

    public void setMileage(Integer mileage) {
        this.mileage = mileage;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getCost() {
        return cost;
    }

    public void setCost(Double cost) {
        this.cost = cost;
    }

    public List<String> getPartsReplaced() {
        return partsReplaced;
    }

    public void setPartsReplaced(List<String> partsReplaced) {
        this.partsReplaced = partsReplaced;
    }

    public String getTechnician() {
        return technician;
    }

    public void setTechnician(String technician) {
        this.technician = technician;
    }

    public Float getDurationHours() {
        return durationHours;
    }

    public void setDurationHours(Float durationHours) {
        this.durationHours = durationHours;
    }
}