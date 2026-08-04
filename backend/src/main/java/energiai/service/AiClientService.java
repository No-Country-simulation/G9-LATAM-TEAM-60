package energiai.service;

import energiai.dto.AnalisisEnergeticoRequest;
import energiai.dto.AnalisisEnergeticoResponse;
import energiai.model.Analisis;
import energiai.model.Users;
import energiai.repository.AnalisisRepository;
import energiai.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AiClientService {

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private AnalisisRepository analisisRepository;

    @Autowired
    private UserRepository userRepository;

    @Value("${ml.service.url:http://localhost:8000/predict}")
    private String mlServiceUrl;

    /**
     * Procesa la solicitud de diagnóstico enviándola al microservicio de Machine Learning en Python (FastAPI).
     * Si la conexión con Python falla, ejecuta la inferencia de respaldo (resiliencia) y guarda el resultado en H2.
     */
    public AnalisisEnergeticoResponse obtenerAnalisis(AnalisisEnergeticoRequest request, String username) {
        AnalisisEnergeticoResponse responseDto;

        try {
            // 1. Prepara las cabeceras HTTP en formato JSON
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<AnalisisEnergeticoRequest> httpEntity = new HttpEntity<>(request, headers);

            // 2. Realiza la petición POST HTTP al microservicio de Python FastAPI (http://localhost:8000/predict)
            @SuppressWarnings({"unchecked", "null"})
            ResponseEntity<Map<String, Object>> responseEntity = (ResponseEntity<Map<String, Object>>) (ResponseEntity<?>) restTemplate.postForEntity(mlServiceUrl, httpEntity, Map.class);
            Map<String, Object> body = responseEntity.getBody();

            if (body != null) {
                // Mapea la respuesta generada por el modelo Scikit-Learn (Random Forest)
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
            // 3. Mecanismo de Resiliencia: Si Python no responde, no rompe la app sino que usa reglas de respaldo
            System.err.println("[WARNING] Error comunicando con microservicio ML en " + mlServiceUrl + ": " + e.getMessage());
            System.out.println("-> Ejecutando lógica resiliente de respaldo para no interrumpir el servicio.");
            responseDto = generarRespuestaResiliente(request);
        }

        responseDto.setConsumo_kwh(request.getConsumo_kwh());
        responseDto.setTipo_inmueble(request.getTipo_inmueble());
        responseDto.setCantidad_equipos(request.getCantidad_equipos());
        responseDto.setUso_horario_pico(request.isUso_horario_pico());
        responseDto.setHoras_alto_consumo(request.getHoras_alto_consumo());
        responseDto.setRegion(request.getRegion());
        responseDto.setRequest(request);

        // 4. Persistencia en Base de Datos H2: Guarda el diagnóstico y lo asocia al usuario correspondiente
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

        // Guarda la entidad en la tabla ANALISIS_ENERGETICO
        Analisis saved = analisisRepository.save(entity);
        responseDto.setId(saved.getId());
        responseDto.setFecha(saved.getFechaCreacion().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));

        return responseDto;
    }

    /**
     * Algoritmo de resiliencia local en Java en caso de caída de la red o del servicio ML de Python.
     */
    private AnalisisEnergeticoResponse generarRespuestaResiliente(AnalisisEnergeticoRequest request) {
        AnalisisEnergeticoResponse resp = new AnalisisEnergeticoResponse();
        double consumo = request.getConsumo_kwh();
        double costo = Math.round(consumo * 0.75 * 100.0) / 100.0;
        resp.setCosto_estimado_mensual(costo);
        resp.setIdentificador("IA-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        resp.setFecha(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));

        List<String> recs = new ArrayList<>();
        if (consumo > 400 || request.getHoras_alto_consumo() > 7) {
            resp.setCategoria("Ineficiente");
            resp.setProbabilidad(0.88);
            recs.add("Alerta de alto consumo: Desconecta electrodomésticos en modo espera y revisa la instalación eléctrica.");
            recs.add("Evita utilizar línea blanca durante el horario pico (18:00 - 22:00).");
        } else if (consumo > 200) {
            resp.setCategoria("Moderado");
            resp.setProbabilidad(0.82);
            recs.add("Optimiza la iluminación cambiando bombillas tradicionales a tecnología LED.");
            recs.add("Aprovecha la luz natural y programa termostatos o sistemas de climatización.");
        } else {
            resp.setCategoria("Eficiente");
            resp.setProbabilidad(0.93);
            recs.add("¡Felicidades! Mantienes un consumo sostenible. Sigue con tus buenos hábitos de ahorro.");
        }
        resp.setRecomendaciones(recs);
        return resp;
    }

    public List<AnalisisEnergeticoResponse> obtenerHistorialUsuario(String username) {
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
