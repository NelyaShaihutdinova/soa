package ru.ifmo.model;

import ru.ifmo.external.model.Vehicle;

import java.time.LocalDateTime;
import java.util.List;

public class MaintenanceReport {
    private Integer vehicleId;
    private Vehicle vehicleInfo;
    private ReportPeriod reportPeriod;
    private Integer totalMaintenanceCount;
    private Double totalCost;
    private List<MaintenanceRecord> maintenanceRecords;
    private MaintenanceStatistics statistics;
    private LocalDateTime generatedAt;

    public static class ReportPeriod {
        private LocalDateTime startDate;
        private LocalDateTime endDate;

        public LocalDateTime getStartDate() { return startDate; }
        public void setStartDate(LocalDateTime startDate) { this.startDate = startDate; }

        public LocalDateTime getEndDate() { return endDate; }
        public void setEndDate(LocalDateTime endDate) { this.endDate = endDate; }
    }

    public Integer getVehicleId() { return vehicleId; }
    public void setVehicleId(Integer vehicleId) { this.vehicleId = vehicleId; }

    public Vehicle getVehicleInfo() { return vehicleInfo; }
    public void setVehicleInfo(Vehicle vehicleInfo) { this.vehicleInfo = vehicleInfo; }

    public ReportPeriod getReportPeriod() { return reportPeriod; }
    public void setReportPeriod(ReportPeriod reportPeriod) { this.reportPeriod = reportPeriod; }

    public Integer getTotalMaintenanceCount() { return totalMaintenanceCount; }
    public void setTotalMaintenanceCount(Integer totalMaintenanceCount) { this.totalMaintenanceCount = totalMaintenanceCount; }

    public Double getTotalCost() { return totalCost; }
    public void setTotalCost(Double totalCost) { this.totalCost = totalCost; }

    public List<MaintenanceRecord> getMaintenanceRecords() { return maintenanceRecords; }
    public void setMaintenanceRecords(List<MaintenanceRecord> maintenanceRecords) { this.maintenanceRecords = maintenanceRecords; }

    public MaintenanceStatistics getStatistics() { return statistics; }
    public void setStatistics(MaintenanceStatistics statistics) { this.statistics = statistics; }

    public LocalDateTime getGeneratedAt() { return generatedAt; }
    public void setGeneratedAt(LocalDateTime generatedAt) { this.generatedAt = generatedAt; }
}