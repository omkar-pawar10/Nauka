-- Nauka: PostgreSQL Schema Definitions
-- Note: This is a frontend-only demo. These tables are mocked using idb-keyval.

CREATE TABLE vessels (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    class VARCHAR(50) NOT NULL, -- e.g., 'Capesize', 'Panamax', 'VLCC'
    capacity_teu INTEGER,
    baseline_speed_knots NUMERIC(5, 2),
    fuel_type VARCHAR(50) DEFAULT 'VLSFO',
    status VARCHAR(50) DEFAULT 'ACTIVE', -- ACTIVE, DELAYED, PRIORITY
    current_lat NUMERIC(9, 6),
    current_lon NUMERIC(9, 6)
);

CREATE TABLE routes (
    id SERIAL PRIMARY KEY,
    vessel_id VARCHAR(50) REFERENCES vessels(id),
    origin_port VARCHAR(100),
    destination_port VARCHAR(100),
    distance_nm NUMERIC(10, 2),
    eta TIMESTAMP,
    is_optimized BOOLEAN DEFAULT false
);

CREATE TABLE optimization_runs (
    id UUID PRIMARY KEY,
    scenario_config JSONB,
    status VARCHAR(50), -- QUEUED, RUNNING, COMPLETED, FAILED
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    total_fuel_saved_mt NUMERIC(10, 2),
    total_co2_avoided_mt NUMERIC(10, 2),
    solver_used VARCHAR(50) -- QPSO, PSO, GA
);

CREATE TABLE optimized_waypoints (
    id SERIAL PRIMARY KEY,
    run_id UUID REFERENCES optimization_runs(id),
    vessel_id VARCHAR(50) REFERENCES vessels(id),
    sequence_order INTEGER,
    lat NUMERIC(9, 6),
    lon NUMERIC(9, 6),
    instructed_speed_knots NUMERIC(5, 2),
    est_fuel_consumption_mt NUMERIC(10, 2),
    cii_rating VARCHAR(1) -- A, B, C, D, E
);

CREATE INDEX idx_opt_run_vessel ON optimized_waypoints(run_id, vessel_id);
