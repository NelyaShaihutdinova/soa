package ru.ifmo.first_wildfly.dto;

import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;
import java.io.Serializable;

@XmlRootElement(name = "countByWheelsResponse")
@XmlAccessorType(XmlAccessType.FIELD)
public class CountByWheelsResponseDto implements Serializable {

    private static final long serialVersionUID = 1L;

    @XmlElement
    private int count;

    public CountByWheelsResponseDto() {}

    public CountByWheelsResponseDto(int count) {
        this.count = count;
    }

    public int getCount() { return count; }
    public void setCount(int count) { this.count = count; }
}