package ru.ifmo.model;

public class MaintenanceStatistics {
    private Double averageCostPerMaintenance;
    private Double totalDowntimeHours;

    // Геттеры и сеттеры
    public Double getAverageCostPerMaintenance() { return averageCostPerMaintenance; }
    public void setAverageCostPerMaintenance(Double averageCostPerMaintenance) { this.averageCostPerMaintenance = averageCostPerMaintenance; }

    public Double getTotalDowntimeHours() { return totalDowntimeHours; }
    public void setTotalDowntimeHours(Double totalDowntimeHours) { this.totalDowntimeHours = totalDowntimeHours; }
}