package ru.ifmo.first_wildfly.domain;

import lombok.Data;

@Data
public class VehiclePage {

    private Integer page = 1;
    private Integer size = 20;
    private String sort = "id";
    private String order = "asc";
}