-- Migración Flyway V3: Eliminar tablas legacy innecesarias de la base de datos

DROP TABLE IF EXISTS analisis_recomendaciones CASCADE;
DROP TABLE IF EXISTS analisis_energetico CASCADE;
