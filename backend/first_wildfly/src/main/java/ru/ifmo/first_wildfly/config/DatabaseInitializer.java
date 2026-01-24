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
    }
}
