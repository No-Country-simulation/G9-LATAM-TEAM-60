package energiai.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// Configuración global de CORS para toda la API.
// Reemplaza al uso de @CrossOrigin en cada controlador por separado.
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    // TODO: reemplazar "*" por el/los dominio(s) reales del frontend antes de producción
    // (por ejemplo: https://energiai-frontend.vercel.app)
    private static final String[] ALLOWED_ORIGINS = { "*" };

    @Override
    public void addCorsMappings(@org.checkerframework.checker.nullness.qual.NonNull CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(ALLOWED_ORIGINS)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(false);
    }
}