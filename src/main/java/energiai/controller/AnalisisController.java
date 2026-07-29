package energiai.controller;

import energiai.dto.AnalisisEnergeticoRequest;
import energiai.dto.AnalisisEnergeticoResponse;
import energiai.repository.AnalisisRepository;
import energiai.service.AiClientService;
import org.springframework.beans.factory.annotation.Autowired;
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

    @Autowired
    private AnalisisRepository analisisRepository;

    // Constructor para que Spring Boot enlace el servicio
    public AnalisisController(AiClientService aiClientService) {
        this.aiClientService = aiClientService;
    }

    // POST /api/analisis-energetico
    @PostMapping("/analisis-energetico")
    public ResponseEntity procesarAnalisis(@RequestBody AnalisisEnergeticoRequest request) {

        // El Controlador (Recepcionista) le pasa los datos al Servicio (El trabajador)
        AnalisisEnergeticoResponse response = aiClientService.obtenerAnalisis(request);

        AnalisisEnergeticoRequest analisisCompleto = new AnalisisEnergeticoRequest(request, response);
        analisisRepository.save(analisisCompleto);

        // Retornamos la respuesta al Frontend
        return ResponseEntity.ok(analisisCompleto);
    }
}
