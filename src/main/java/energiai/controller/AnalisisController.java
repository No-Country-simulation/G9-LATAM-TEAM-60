package energiai.controller;

import energiai.dto.AnalisisEnergeticoRequest;
import energiai.dto.AnalisisEnergeticoResponse;
import energiai.service.AiClientService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST principal para gestionar los análisis energéticos y el historial de auditorías.
 * Expone endpoints HTTP consumidos por la aplicación Frontend en React.
 */
@RestController
@RequestMapping("/api")
public class AnalisisController {

    // Servicio inyectado que maneja la comunicación con el modelo ML (Python) y la persistencia en Base de Datos
    private final AiClientService aiClientService;

    // Inyección de dependencias mediante constructor (Buenas prácticas Spring Boot)
    public AnalisisController(AiClientService aiClientService) {
        this.aiClientService = aiClientService;
    }

    /**
     * Endpoint POST para procesar una nueva simulación de consumo energético.
     * Recibe los datos del inmueble en el cuerpo (JSON) y los envía al servicio de IA.
     */
    @PostMapping("/analisis-energetico")
    public ResponseEntity<AnalisisEnergeticoResponse> procesarAnalisis(@RequestBody AnalisisEnergeticoRequest request) {
        // Extrae la información de autenticación del usuario actual desde el Token JWT (si existe sesión activa)
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) ? auth.getName() : null;

        // Procesa el análisis a través del servicio de IA y vincula el resultado al usuario si está autenticado
        AnalisisEnergeticoResponse response = aiClientService.obtenerAnalisis(request, username);
        
        // Retorna la respuesta HTTP 200 OK con el resultado del diagnóstico en formato JSON
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint GET para consultar el historial de auditorías del usuario autenticado.
     */
    @GetMapping("/analisis/historial")
    public ResponseEntity<List<AnalisisEnergeticoResponse>> obtenerHistorial() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) ? auth.getName() : null;

        List<AnalisisEnergeticoResponse> historial = (username != null) 
                ? aiClientService.obtenerHistorialUsuario(username) 
                : aiClientService.obtenerHistorialGlobal();

        return ResponseEntity.ok(historial);
    }

    /**
     * Endpoint GET para obtener un análisis específico por su ID.
     */
    @GetMapping("/analisis/{id}")
    public ResponseEntity<AnalisisEnergeticoResponse> obtenerPorId(@PathVariable Long id) {
        AnalisisEnergeticoResponse response = aiClientService.obtenerPorId(id);
        if (response == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(response);
    }
}
