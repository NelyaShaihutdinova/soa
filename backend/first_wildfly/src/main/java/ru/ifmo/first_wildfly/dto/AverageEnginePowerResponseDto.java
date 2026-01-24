package ru.ifmo.first_wildfly.dto;

import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;
import java.io.Serializable;

@XmlRootElement(name = "averageEnginePowerResponse")
@XmlAccessorType(XmlAccessType.FIELD)
public class AverageEnginePowerResponseDto implements Serializable {

    private static final long serialVersionUID = 1L;

    @XmlElement
    private Float averageEnginePower;

    public AverageEnginePowerResponseDto() {}

    public AverageEnginePowerResponseDto(Float averageEnginePower) {
        this.averageEnginePower = averageEnginePower;
    }

    public Float getAverageEnginePower() { return averageEnginePower; }
    public void setAverageEnginePower(Float averageEnginePower) { this.averageEnginePower = averageEnginePower; }
}