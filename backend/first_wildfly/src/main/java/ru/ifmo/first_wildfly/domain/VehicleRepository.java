package ru.ifmo.first_wildfly.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import ru.ifmo.first_wildfly.domain.entity.VehicleEntity;

@Repository
public interface VehicleRepository
        extends JpaRepository<VehicleEntity, Integer>, JpaSpecificationExecutor<VehicleEntity> {

}
