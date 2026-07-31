package energiai.service;

import energiai.dto.AnalisisEnergeticoRequest;
import energiai.dto.AnalisisEnergeticoResponse;
import energiai.model.Analisis;
import energiai.model.Users;
import energiai.repository.AnalisisRepository;
import energiai.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Servicio encargado de la orquestación del análisis energético:
 * 1. Comunicación HTTP con el microservicio de IA (Python FastAPI / Scikit-Learn).
 * 2. Fallback resiliente en caso de fallo del microservicio de IA.
 * 3. Persistencia de diagnósticos vinculados a usuarios en la base de datos H2.
 */
@Service
public class AiClientService {

    @Value("${ml.service.url:http://localhost:8000/predict}")
    private String mlServiceUrl;

    private final RestTemplate restTemplate;
    private final AnalisisRepository analisisRepository;
    private final UserRepository userRepository;

    public AiClientService(RestTemplate restTemplate, AnalisisRepository analisisRepository, UserRepository userRepository) {
        this.restTemplate = restTemplate;
        this.analisisRepository = analisisRepository;
        this.userRepository = userRepository;
    }

    public AnalisisEnergeticoResponse obtenerAnalisis(AnalisisEnergeticoRequest request) {
        return obtenerAnalisis(request, null);
    }

    public AnalisisEnergeticoResponse obtenerAnalisis(AnalisisEnergeticoRequest request, String username) {
        AnalisisEnergeticoResponse responseDto;

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<AnalisisEnergeticoRequest> httpEntity = new HttpEntity<>(request, headers);

            @SuppressWarnings({"unchecked", "null"})
            ResponseEntity<Map<String, Object>> responseEntity = (ResponseEntity<Map<String, Object>>) (ResponseEntity<?>) restTemplate.postForEntity(mlServiceUrl, httpEntity, Map.class);
            Map<String, Object> body = responseEntity.getBody();

            if (body != null) {
                responseDto = new AnalisisEnergeticoResponse();
                responseDto.setCategoria((String) body.getOrDefault("categoria", "Moderado"));
                responseDto.setProbabilidad(((Number) body.getOrDefault("probabilidad", 0.80)).doubleValue());
                responseDto.setCosto_estimado_mensual(((Number) body.getOrDefault("costo_estimado_mensual", request.getConsumo_kwh() * 0.75)).doubleValue());
                @SuppressWarnings("unchecked")
                List<String> recsList = (List<String>) body.getOrDefault("recomendaciones", new ArrayList<String>());
                responseDto.setRecomendaciones(recsList);
                responseDto.setIdentificador((String) body.getOrDefault("identificador", "IA-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase()));
                responseDto.setFecha((String) body.getOrDefault("fecha", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)));
            } else {
                responseDto = generarRespuestaResiliente(request);
            }
        } catch (Exception e) {
            System.err.println("[WARNING] Error comunicando con microservicio ML en " + mlServiceUrl + ": " + e.getMessage());
            responseDto = generarRespuestaResiliente(request);
        }

        responseDto.setConsumo_kwh(request.getConsumo_kwh());
        responseDto.setTipo_inmueble(request.getTipo_inmueble());
        responseDto.setCantidad_equipos(request.getCantidad_equipos());
        responseDto.setUso_horario_pico(request.isUso_horario_pico());
        responseDto.setHoras_alto_consumo(request.getHoras_alto_consumo());
        responseDto.setRegion(request.getRegion());
        responseDto.setRequest(request);

        Analisis entity = new Analisis();
        if (username != null) {
            Users user = (Users) userRepository.findByUsername(username);
            entity.setUser(user);
        }
        entity.setIdentificador(responseDto.getIdentificador() != null ? responseDto.getIdentificador() : "IA-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        entity.setRegion(request.getRegion() != null ? request.getRegion() : "Centro");
        entity.setConsumoKwh(request.getConsumo_kwh());
        entity.setUsoHorarioPico(request.isUso_horario_pico());
        entity.setCantidadEquipos(request.getCantidad_equipos());
        entity.setTipoInmueble(request.getTipo_inmueble() != null ? request.getTipo_inmueble() : "Casa");
        entity.setHorasAltoConsumo(request.getHoras_alto_consumo());
        entity.setCategoria(responseDto.getCategoria());
        entity.setProbabilidad(responseDto.getProbabilidad());
        entity.setCostoEstimadoMensual(responseDto.getCosto_estimado_mensual());
        entity.setFechaCreacion(LocalDateTime.now());
        entity.setRecomendaciones(responseDto.getRecomendaciones());

        Analisis saved = analisisRepository.save(entity);
        responseDto.setId(saved.getId());

        return responseDto;
    }

    private AnalisisEnergeticoResponse generarRespuestaResiliente(AnalisisEnergeticoRequest req) {
        AnalisisEnergeticoResponse dto = new AnalisisEnergeticoResponse();
        dto.setIdentificador("IA-R" + UUID.randomUUID().toString().substring(0, 7).toUpperCase());
        dto.setFecha(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));

        double costo = Math.round(req.getConsumo_kwh() * 0.75 * 100.0) / 100.0;
        dto.setCosto_estimado_mensual(costo);

        List<String> recs = new ArrayList<>();
        if (req.getConsumo_kwh() > 400 || req.getHoras_alto_consumo() > 7) {
            dto.setCategoria("Ineficiente");
            dto.setProbabilidad(0.89);
            recs.add("Alerta de consumo crítico: Desconecta electrodomésticos en modo espera y revisa la instalación eléctrica.");
            if (req.isUso_horario_pico()) {
                recs.add("Desplazar el uso de electrodomésticos fuera del horario pico (18:00 - 22:00).");
            }
        } else if (req.getConsumo_kwh() > 200) {
            dto.setCategoria("Moderado");
            dto.setProbabilidad(0.81);
            recs.add("Optimiza la iluminación cambiando bombillas tradicionales a tecnología LED.");
            recs.add("Aprovecha la luz natural y programa termostatos o sistemas de climatización.");
        } else {
            dto.setCategoria("Eficiente");
            dto.setProbabilidad(0.93);
            recs.add("¡Felicidades! Mantienes un consumo sostenible. Sigue con tus buenos hábitos de ahorro.");
        }
        dto.setRecomendaciones(recs);
        return dto;
    }

    public List<AnalisisEnergeticoResponse> obtenerHistorialUsuario(String username) {
        if (username == null) return new ArrayList<>();
        Users user = (Users) userRepository.findByUsername(username);
        if (user == null) return new ArrayList<>();
        return analisisRepository.findByUserIdOrderByFechaCreacionDesc(user.getId())
                .stream().map(this::convertirADto).collect(Collectors.toList());
    }

    public List<AnalisisEnergeticoResponse> obtenerHistorialGlobal() {
        return analisisRepository.findAllByOrderByFechaCreacionDesc()
                .stream().map(this::convertirADto).collect(Collectors.toList());
    }

    public AnalisisEnergeticoResponse obtenerPorId(Long id) {
        if (id == null) return null;
        return analisisRepository.findById(id).map(this::convertirADto).orElse(null);
    }

    private AnalisisEnergeticoResponse convertirADto(Analisis a) {
        AnalisisEnergeticoResponse dto = new AnalisisEnergeticoResponse();
        dto.setId(a.getId());
        dto.setIdentificador(a.getIdentificador());
        dto.setCategoria(a.getCategoria());
        dto.setProbabilidad(a.getProbabilidad());
        dto.setCosto_estimado_mensual(a.getCostoEstimadoMensual());
        dto.setRecomendaciones(a.getRecomendaciones());
        dto.setFecha(a.getFechaCreacion() != null ? a.getFechaCreacion().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null);
        
        dto.setConsumo_kwh(a.getConsumoKwh());
        dto.setTipo_inmueble(a.getTipoInmueble());
        dto.setCantidad_equipos(a.getCantidadEquipos());
        dto.setUso_horario_pico(a.isUsoHorarioPico());
        dto.setHoras_alto_consumo(a.getHorasAltoConsumo());
        dto.setRegion(a.getRegion());

        AnalisisEnergeticoRequest req = new AnalisisEnergeticoRequest();
        req.setConsumo_kwh(a.getConsumoKwh());
        req.setTipo_inmueble(a.getTipoInmueble());
        req.setCantidad_equipos(a.getCantidadEquipos());
        req.setUso_horario_pico(a.isUsoHorarioPico());
        req.setHoras_alto_consumo(a.getHorasAltoConsumo());
        req.setRegion(a.getRegion());
        dto.setRequest(req);

        return dto;
    }
}
