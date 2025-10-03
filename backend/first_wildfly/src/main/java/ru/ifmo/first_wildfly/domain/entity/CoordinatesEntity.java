package ru.ifmo.first_wildfly.domain.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@Entity
@Table(name = "coordinate")
@NoArgsConstructor
@AllArgsConstructor
public class CoordinatesEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private long x;

    private Integer y;
}
