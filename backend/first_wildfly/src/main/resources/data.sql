CREATE TABLE IF NOT EXISTS coordinate (
    id SERIAL PRIMARY KEY,
    x BIGINT NOT NULL,
    y INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS vehicle (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL CHECK (name <> ''),
    coordinate_id BIGINT NOT NULL,
    creation_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    engine_power BIGINT CHECK (engine_power > 0),
    number_of_wheels BIGINT CHECK (number_of_wheels > 0),
    capacity REAL NOT NULL CHECK (capacity > 0),
    fuel_type VARCHAR(31) NOT NULL,
    CONSTRAINT fk_vehicle_coordinates FOREIGN KEY (coordinate_id) REFERENCES coordinate(id) ON DELETE CASCADE
);