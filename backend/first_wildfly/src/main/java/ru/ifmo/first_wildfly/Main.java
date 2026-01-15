package ru.ifmo.first_wildfly;

import jakarta.xml.ws.Endpoint;
import ru.ifmo.first_wildfly.api.VehicleApiImpl;

public class Main {
    public static void main(String[] args) {
        Endpoint.publish(
                "http://localhost:8080/VehicleAPI",
                new VehicleApiImpl());
    }
}
