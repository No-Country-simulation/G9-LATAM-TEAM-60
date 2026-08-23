package energiai.controller;

import energiai.dto.DashboardResponseDTO;
import energiai.service.AiClientService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controlador de Dashboard para servir las métricas consolidadas de consumo y estadísticas.
 */
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final AiClientService aiClientService;

    // Inyección de dependencias del servicio de análisis
    public DashboardController(AiClientService aiClientService) {
        this.aiClientService = aiClientService;
    }

    /**
     * Endpoint GET para consultar las métricas generales del Dashboard (total consultas, promedio kWh, etc.).
     */
    @GetMapping
    public ResponseEntity<DashboardResponseDTO> obtenerDashboard() {
        // Identifica si el usuario está autenticado para filtrar sus métricas personales o mostrar las generales
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) ? auth.getName() : null;

        // Obtiene las estadísticas acumuladas desde la Base de Datos H2
        DashboardResponseDTO dto = aiClientService.obtenerStatsDashboard(username);
        return ResponseEntity.ok(dto);
    }
}
