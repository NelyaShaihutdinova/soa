package ru.ifmo.first_wildfly.config;

import jakarta.annotation.PostConstruct;
import jakarta.ejb.Singleton;
import jakarta.ejb.Startup;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Singleton
@Startup
public class DatabaseInitializer {

    @PersistenceContext
    private EntityManager entityManager;

    @PostConstruct
    public void init() {
        try {
            entityManager.createNativeQuery("CREATE TABLE IF NOT EXISTS coordinate (" +
                    "id SERIAL PRIMARY KEY, " +
                    "x BIGINT NOT NULL, " +
                    "y INTEGER NOT NULL)").executeUpdate();

            entityManager.createNativeQuery("CREATE TABLE IF NOT EXISTS vehicle (" +
                    "id SERIAL PRIMARY KEY, " +
                    "name VARCHAR NOT NULL CHECK (name <> ''), " +
                    "coordinate_id BIGINT NOT NULL, " +
                    "creation_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), " +
                    "engine_power BIGINT CHECK (engine_power > 0), " +
                    "number_of_wheels BIGINT CHECK (number_of_wheels > 0), " +
                    "capacity REAL NOT NULL CHECK (capacity > 0), " +
                    "fuel_type VARCHAR(31) NOT NULL, " +
                    "CONSTRAINT fk_vehicle_coordinates FOREIGN KEY (coordinate_id) REFERENCES coordinate(id) ON DELETE CASCADE)"
            ).executeUpdate();
            System.out.println("EXECUTED successfully!");
        } catch (Exception e) {
            System.out.println("Tables may already exist: " + e.getMessage());
        }
    }
}