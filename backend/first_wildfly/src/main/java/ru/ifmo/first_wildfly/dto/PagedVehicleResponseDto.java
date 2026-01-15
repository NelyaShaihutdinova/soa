package ru.ifmo.first_wildfly.dto;

import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;
import java.io.Serializable;
import java.util.List;

@XmlRootElement(name = "pagedVehicleResponse")
@XmlAccessorType(XmlAccessType.FIELD)
public class PagedVehicleResponseDto implements Serializable {

    private static final long serialVersionUID = 1L;

    @XmlElement(name = "vehicle")
    private List<VehicleDto> content;

    @XmlElement
    private int totalElements;

    @XmlElement
    private int totalPages;

    @XmlElement
    private int currentPage;

    public PagedVehicleResponseDto() {}

    public PagedVehicleResponseDto(List<VehicleDto> content, int totalElements, int totalPages, int currentPage) {
        this.content = content;
        this.totalElements = totalElements;
        this.totalPages = totalPages;
        this.currentPage = currentPage;
    }

    public List<VehicleDto> getContent() { return content; }
    public void setContent(List<VehicleDto> content) { this.content = content; }

    public int getTotalElements() { return totalElements; }
    public void setTotalElements(int totalElements) { this.totalElements = totalElements; }

    public int getTotalPages() { return totalPages; }
    public void setTotalPages(int totalPages) { this.totalPages = totalPages; }

    public int getCurrentPage() { return currentPage; }
    public void setCurrentPage(int currentPage) { this.currentPage = currentPage; }
}