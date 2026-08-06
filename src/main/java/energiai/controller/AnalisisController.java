package energiai.controller;

import energiai.dto.AnalisisEnergeticoRequest;
import energiai.dto.AnalisisEnergeticoResponse;
import energiai.service.AiClientService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Controlador REST principal para gestionar los análisis energéticos, el dashboard y el historial.
 */
@RestController
@RequestMapping("/api")
public class AnalisisController {

    private final AiClientService aiClientService;

    public AnalisisController(AiClientService aiClientService) {
        this.aiClientService = aiClientService;
    }

    @PostMapping("/analisis-energetico")
    public ResponseEntity<AnalisisEnergeticoResponse> procesarAnalisis(@RequestBody AnalisisEnergeticoRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) ? auth.getName() : null;

        AnalisisEnergeticoResponse response = aiClientService.obtenerAnalisis(request, username);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/analisis/historial")
    public ResponseEntity<List<AnalisisEnergeticoResponse>> obtenerHistorial() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) ? auth.getName() : null;

        List<AnalisisEnergeticoResponse> historial = (username != null) 
                ? aiClientService.obtenerHistorialUsuario(username) 
                : aiClientService.obtenerHistorialGlobal();

        return ResponseEntity.ok(historial);
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> obtenerDashboardStats() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) ? auth.getName() : null;

        List<AnalisisEnergeticoResponse> historial = (username != null)
                ? aiClientService.obtenerHistorialUsuario(username)
                : aiClientService.obtenerHistorialGlobal();

        long total = historial.size();
        double consumoPromedio = total > 0 ? historial.stream().mapToDouble(a -> a != null && a.getConsumo_kwh() != null ? a.getConsumo_kwh() : 0.0).average().orElse(0.0) : 0.0;
        double costoTotal = historial.stream().mapToDouble(a -> a != null ? a.getCosto_estimado_mensual() : 0.0).sum();

        Map<String, Long> distribucion = historial.stream()
                .collect(Collectors.groupingBy(a -> a.getCategoria() != null ? a.getCategoria() : "Moderado", Collectors.counting()));

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalConsultas", total);
        stats.put("consumoPromedioKwh", Math.round(consumoPromedio * 10.0) / 10.0);
        stats.put("costoTotalEstimado", Math.round(costoTotal * 100.0) / 100.0);
        stats.put("distribucionCategorias", distribucion);
        stats.put("analisisRecientes", historial);

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/analisis/{id}")
    public ResponseEntity<AnalisisEnergeticoResponse> obtenerPorId(@PathVariable Long id) {
        AnalisisEnergeticoResponse response = aiClientService.obtenerPorId(id);
        if (response == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(response);
    }
}
