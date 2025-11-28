package ru.ifmo.model;

import java.time.LocalDateTime;

public class ReportStatus {
    private String reportId;
    private ReportStatusEnum status;
    private LocalDateTime estimatedCompletionTime;
    private Integer progress;
    private String downloadUrl;

    public enum ReportStatusEnum {
        PENDING, PROCESSING, COMPLETED, FAILED
    }

    public String getReportId() { return reportId; }
    public void setReportId(String reportId) { this.reportId = reportId; }

    public ReportStatusEnum getStatus() { return status; }
    public void setStatus(ReportStatusEnum status) { this.status = status; }

    public LocalDateTime getEstimatedCompletionTime() { return estimatedCompletionTime; }
    public void setEstimatedCompletionTime(LocalDateTime estimatedCompletionTime) { this.estimatedCompletionTime = estimatedCompletionTime; }

    public Integer getProgress() { return progress; }
    public void setProgress(Integer progress) { this.progress = progress; }

    public String getDownloadUrl() { return downloadUrl; }
    public void setDownloadUrl(String downloadUrl) { this.downloadUrl = downloadUrl; }
}