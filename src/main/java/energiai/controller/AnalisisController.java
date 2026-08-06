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

    @GetMapping("/analisis/{id}")
    public ResponseEntity<AnalisisEnergeticoResponse> obtenerPorId(@PathVariable Long id) {
        AnalisisEnergeticoResponse response = aiClientService.obtenerPorId(id);
        if (response == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(response);
    }
}
