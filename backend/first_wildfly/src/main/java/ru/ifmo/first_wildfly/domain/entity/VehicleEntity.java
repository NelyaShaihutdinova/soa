package ru.ifmo.first_wildfly.domain.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import static jakarta.persistence.CascadeType.ALL;
import static jakarta.persistence.EnumType.STRING;

@Data
@Builder
@Entity
@Table(name = "vehicle")
@NoArgsConstructor
@AllArgsConstructor
public class VehicleEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;

    @ManyToOne(cascade = ALL)
    @JoinColumn(name = "coordinate_id")
    private CoordinatesEntity coordinates;

    @Column(name = "creation_date")
    private java.time.ZonedDateTime creationDate;

    @Column(name = "engine_power")
    private Long enginePower;

    @Column(name = "number_of_wheels")
    private Long numberOfWheels;

    private float capacity;

    @Enumerated(STRING)
    private FuelType fuelType;
}
