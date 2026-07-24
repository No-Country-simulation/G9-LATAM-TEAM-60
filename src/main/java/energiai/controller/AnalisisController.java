package energiai.controller;

import energiai.dto.AnalisisEnergeticoRequest;
import energiai.dto.AnalisisEnergeticoResponse;
import energiai.service.AiClientService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class AnalisisController {

    // Inyectamos el servicio
    private final AiClientService aiClientService;

    // Constructor para que Spring Boot enlace el servicio
    public AnalisisController(AiClientService aiClientService) {
        this.aiClientService = aiClientService;
    }

    // POST /api/analisis-energetico
    @PostMapping("/analisis-energetico")
    public ResponseEntity<AnalisisEnergeticoResponse> procesarAnalisis(@RequestBody AnalisisEnergeticoRequest request) {

        // El Controlador (Recepcionista) le pasa los datos al Servicio (El trabajador)
        AnalisisEnergeticoResponse response = aiClientService.obtenerAnalisis(request);

        // Retornamos la respuesta al Frontend
        return ResponseEntity.ok(response);
    }
}
