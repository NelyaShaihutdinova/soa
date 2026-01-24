package ru.ifmo.first_wildfly.dto;

import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;
import java.io.Serializable;

@XmlRootElement(name = "coordinates")
@XmlAccessorType(XmlAccessType.FIELD)
public class CoordinatesDto implements Serializable {

    private static final long serialVersionUID = 1L;

    @XmlElement
    private Long x;

    @XmlElement
    private Integer y;

    public CoordinatesDto() {}

    public CoordinatesDto(Long x, Integer y) {
        this.x = x;
        this.y = y;
    }

    public Long getX() { return x; }
    public void setX(Long x) { this.x = x; }

    public Integer getY() { return y; }
    public void setY(Integer y) { this.y = y; }
}