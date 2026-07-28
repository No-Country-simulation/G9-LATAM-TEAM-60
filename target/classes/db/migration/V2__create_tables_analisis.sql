CREATE TABLE analisis_energetico_response (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    categoria VARCHAR(255),
    probabilidad DOUBLE PRECISION NOT NULL,
    costo_estimado_mensual DOUBLE PRECISION NOT NULL
);

CREATE TABLE analisis_energetico_request (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    region VARCHAR(255),
    consumo_kwh DOUBLE PRECISION NOT NULL,
    uso_horario_pico BOOLEAN NOT NULL,
    cantidad_equipos INT NOT NULL,
    tipo_inmueble VARCHAR(255),
    horas_alto_consumo INT NOT NULL,
    analisis_respuesta_id BIGINT,
    CONSTRAINT fk_analisis_respuesta
        FOREIGN KEY (analisis_respuesta_id)
        REFERENCES analisis_energetico_response(id)
);

CREATE TABLE analisis_recomendaciones (
    analisis_response_id BIGINT NOT NULL,
    recomendacion VARCHAR(500),
    CONSTRAINT fk_analisis_response
        FOREIGN KEY (analisis_response_id)
        REFERENCES analisis_energetico_response(id)
);