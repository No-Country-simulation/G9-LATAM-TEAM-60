package energiai.service;

import energiai.dto.AnalisisEnergeticoRequest;
import energiai.dto.AnalisisEnergeticoResponse;
import energiai.model.AnalisisEnergeticoRequestEntity;
import energiai.model.AnalisisEnergeticoResponseEntity;
import energiai.model.Users;
import energiai.repository.AnalisisRequestRepository;
import energiai.repository.AnalisisResponseRepository;
import energiai.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Servicio orquestador del Análisis Energético:
 * Flujo estricto: Request (guardado en DB) -> Inferencia IA (Regresión Logística / Fallback) -> Response (guardado en DB vinculado por FK) -> Recomendaciones
 */
@Service
public class AiClientService {

    @Value("${ml.service.url:http://localhost:8000/predict}")
    private String mlServiceUrl;

    private final RestTemplate restTemplate;
    private final AnalisisRequestRepository analisisRequestRepository;
    private final AnalisisResponseRepository analisisResponseRepository;
    private final UserRepository userRepository;

    public AiClientService(RestTemplate restTemplate,
                           AnalisisRequestRepository analisisRequestRepository,
                           AnalisisResponseRepository analisisResponseRepository,
                           UserRepository userRepository) {
        this.restTemplate = restTemplate;
        this.analisisRequestRepository = analisisRequestRepository;
        this.analisisResponseRepository = analisisResponseRepository;
        this.userRepository = userRepository;
    }

    public AnalisisEnergeticoResponse obtenerAnalisis(AnalisisEnergeticoRequest request) {
        return obtenerAnalisis(request, null);
    }

    public AnalisisEnergeticoResponse obtenerAnalisis(AnalisisEnergeticoRequest request, String username) {
        // 1. Guardar la entrada en la tabla analisis_energetico_request
        AnalisisEnergeticoRequestEntity requestEntity = new AnalisisEnergeticoRequestEntity();
        if (username != null) {
            Users user = (Users) userRepository.findByUsername(username);
            requestEntity.setUser(user);
        }
        String identificador = "IA-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        requestEntity.setIdentificador(identificador);
        String regionBase = (request.getRegion() != null ? request.getRegion() : "Centro").split("\\(")[0].trim();
        if (!List.of("Norte", "Centro", "Sur").contains(regionBase)) {
            regionBase = "Centro";
        }
        request.setRegion(regionBase);
        requestEntity.setRegion(regionBase);
        requestEntity.setConsumoKwh(request.getConsumo_kwh());
        requestEntity.setUsoHorarioPico(request.isUso_horario_pico());
        requestEntity.setCantidadEquipos(request.getCantidad_equipos());
        requestEntity.setTipoInmueble(request.getTipo_inmueble() != null ? request.getTipo_inmueble() : "Casa");
        requestEntity.setHorasAltoConsumo(request.getHoras_alto_consumo());
        requestEntity.setFechaCreacion(LocalDateTime.now());

        AnalisisEnergeticoRequestEntity savedRequest = analisisRequestRepository.save(requestEntity);

        // 2. Comunicación con el microservicio ML (Modelo de Regresión Logística)
        AnalisisEnergeticoResponse responseDto;
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<AnalisisEnergeticoRequest> httpEntity = new HttpEntity<>(request, headers);

            org.springframework.core.ParameterizedTypeReference<Map<String, Object>> responseType = new org.springframework.core.ParameterizedTypeReference<>() {};
            @SuppressWarnings("null")
            ResponseEntity<Map<String, Object>> responseEntity = restTemplate.exchange(mlServiceUrl, HttpMethod.POST, httpEntity, responseType);
            Map<String, Object> body = responseEntity.getBody();

            if (body != null) {
                responseDto = new AnalisisEnergeticoResponse();
                responseDto.setCategoria((String) body.getOrDefault("categoria", "Moderado"));
                responseDto.setProbabilidad(((Number) body.getOrDefault("probabilidad", 0.80)).doubleValue());
                responseDto.setCosto_estimado_mensual(((Number) body.getOrDefault("costo_estimado_mensual", request.getConsumo_kwh() * 0.75)).doubleValue());
                @SuppressWarnings("unchecked")
                List<String> recsList = (List<String>) body.getOrDefault("recomendaciones", new ArrayList<String>());
                responseDto.setRecomendaciones(recsList);
                responseDto.setIdentificador(identificador);
                responseDto.setFecha(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            } else {
                responseDto = generarRespuestaResiliente(request, identificador);
            }
        } catch (Exception e) {
            System.err.println("[WARNING] Error comunicando con microservicio ML en " + mlServiceUrl + ": " + e.getMessage());
            responseDto = generarRespuestaResiliente(request, identificador);
        }

        // 3. Guardar el resultado en la tabla analisis_energetico_response con la FK de la request
        AnalisisEnergeticoResponseEntity responseEntity = new AnalisisEnergeticoResponseEntity();
        responseEntity.setRequest(savedRequest);
        responseEntity.setCategoria(responseDto.getCategoria());
        responseEntity.setProbabilidad(responseDto.getProbabilidad());
        responseEntity.setCostoEstimadoMensual(responseDto.getCosto_estimado_mensual());
        responseEntity.setRecomendacionesList(responseDto.getRecomendaciones());
        responseEntity.setFechaCreacion(LocalDateTime.now());

        AnalisisEnergeticoResponseEntity savedResponse = analisisResponseRepository.save(responseEntity);

        // 4. Poblar DTO final
        responseDto.setId(savedResponse.getId());
        responseDto.setConsumo_kwh(request.getConsumo_kwh());
        responseDto.setTipo_inmueble(request.getTipo_inmueble());
        responseDto.setCantidad_equipos(request.getCantidad_equipos());
        responseDto.setUso_horario_pico(request.isUso_horario_pico());
        responseDto.setHoras_alto_consumo(request.getHoras_alto_consumo());
        responseDto.setRegion(request.getRegion());
        responseDto.setRequest(request);

        return responseDto;
    }

    private AnalisisEnergeticoResponse generarRespuestaResiliente(AnalisisEnergeticoRequest req, String identificador) {
        AnalisisEnergeticoResponse dto = new AnalisisEnergeticoResponse();
        dto.setIdentificador(identificador != null ? identificador : "IA-R" + UUID.randomUUID().toString().substring(0, 7).toUpperCase());
        dto.setFecha(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));

        double costo = Math.round(req.getConsumo_kwh() * 0.75 * 100.0) / 100.0;
        dto.setCosto_estimado_mensual(costo);

        // Reglas de regresión/clasificación DataScience
        String regionBase = (req.getRegion() != null ? req.getRegion() : "Centro").split("\\(")[0].trim();
        String tipo = req.getTipo_inmueble() != null ? req.getTipo_inmueble() : "Casa";
        boolean usoPico = req.isUso_horario_pico();
        int horas = req.getHoras_alto_consumo();
        int equipos = req.getCantidad_equipos();
        double consumo = req.getConsumo_kwh();

        String categoria;
        double probabilidad;

        if (consumo > 400 || horas >= 7 || (consumo > 300 && usoPico) || equipos >= 15) {
            categoria = "Ineficiente";
            probabilidad = 0.89;
        } else if (consumo > 200 || horas >= 4 || equipos >= 7) {
            categoria = "Moderado";
            probabilidad = 0.82;
        } else {
            categoria = "Eficiente";
            probabilidad = 0.93;
        }

        dto.setCategoria(categoria);
        dto.setProbabilidad(probabilidad);

        List<String> recs = new ArrayList<>();
        if ("Ineficiente".equals(categoria)) {
            recs.add("Atención: Tu perfil de consumo energético se encuentra en la categoría Ineficiente.");
            if ("Departamento".equals(tipo) && "Centro".equals(regionBase)) {
                recs.add("Detectamos que vives en un departamento en la zona central. Revisa el aislamiento de puertas y ventanas.");
            }
            if (usoPico) {
                recs.add("Registras consumo durante el horario punta (18:00 - 22:00 hs). Desplazar el uso de electrodomésticos reducirá tu costo.");
            }
            if (horas >= 4) {
                recs.add("Registras un promedio elevado de horas en alto consumo. Te sugerimos utilizar temporizadores o enchufes inteligentes.");
            }
            if (equipos <= 5 && consumo > 250) {
                recs.add("Tienes pocos electrodomésticos pero un consumo elevado. Es probable que algún equipo antiguo opere con baja eficiencia.");
            }
        } else if ("Moderado".equals(categoria)) {
            recs.add("Tu consumo es Moderado. Estás en el promedio, pero tienes margen de mejora.");
            if (usoPico) recs.add("Evitar el horario punta es tu principal oportunidad para migrar a la categoría Eficiente.");
        } else {
            recs.add("¡Excelente trabajo! Tu perfil es Eficiente. Continúa con tus buenos hábitos de ahorro.");
        }

        dto.setRecomendaciones(recs);
        return dto;
    }

    public List<AnalisisEnergeticoResponse> obtenerHistorialUsuario(String username) {
        if (username == null) return new ArrayList<>();
        Users user = (Users) userRepository.findByUsername(username);
        if (user == null) return new ArrayList<>();
        return analisisResponseRepository.findByUserIdWithRequestOrderByFechaCreacionDesc(user.getId())
                .stream().map(this::convertirADto).collect(Collectors.toList());
    }

    public List<AnalisisEnergeticoResponse> obtenerHistorialGlobal() {
        return analisisResponseRepository.findAllWithRequestOrderByFechaCreacionDesc()
                .stream().map(this::convertirADto).collect(Collectors.toList());
    }

    public AnalisisEnergeticoResponse obtenerPorId(Long id) {
        if (id == null) return null;
        return analisisResponseRepository.findByIdWithRequest(id).map(this::convertirADto).orElse(null);
    }

    public energiai.dto.DashboardResponseDTO obtenerStatsDashboard(String username) {
        List<AnalisisEnergeticoResponse> historial = (username != null) 
                ? obtenerHistorialUsuario(username) 
                : obtenerHistorialGlobal();

        long totalConsultas = historial.size();
        double consumoPromedio = totalConsultas > 0 
                ? historial.stream().mapToDouble(a -> a.getConsumo_kwh() != null ? a.getConsumo_kwh() : 0.0).average().orElse(0.0) 
                : 0.0;
        double costoTotal = historial.stream().mapToDouble(a -> a.getCosto_estimado_mensual()).sum();

        Map<String, Long> distribucion = Map.of(
                "Eficiente", historial.stream().filter(h -> "Eficiente".equalsIgnoreCase(h.getCategoria())).count(),
                "Moderado", historial.stream().filter(h -> "Moderado".equalsIgnoreCase(h.getCategoria())).count(),
                "Ineficiente", historial.stream().filter(h -> "Ineficiente".equalsIgnoreCase(h.getCategoria())).count()
        );

        return new energiai.dto.DashboardResponseDTO(
                totalConsultas,
                Math.round(consumoPromedio * 10.0) / 10.0,
                Math.round(costoTotal * 100.0) / 100.0,
                distribucion,
                historial
        );
    }

    private AnalisisEnergeticoResponse convertirADto(AnalisisEnergeticoResponseEntity resp) {
        AnalisisEnergeticoResponse dto = new AnalisisEnergeticoResponse();
        dto.setId(resp.getId());
        dto.setCategoria(resp.getCategoria());
        dto.setProbabilidad(resp.getProbabilidad());
        dto.setCosto_estimado_mensual(resp.getCostoEstimadoMensual());
        dto.setRecomendaciones(resp.getRecomendacionesList());
        dto.setFecha(resp.getFechaCreacion() != null ? resp.getFechaCreacion().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null);

        AnalisisEnergeticoRequestEntity req = resp.getRequest();
        if (req != null) {
            dto.setIdentificador(req.getIdentificador());
            dto.setConsumo_kwh(req.getConsumoKwh());
            dto.setTipo_inmueble(req.getTipoInmueble());
            dto.setCantidad_equipos(req.getCantidadEquipos());
            dto.setUso_horario_pico(Boolean.TRUE.equals(req.isUsoHorarioPico()));
            dto.setHoras_alto_consumo(req.getHorasAltoConsumo());
            dto.setRegion(req.getRegion());

            AnalisisEnergeticoRequest reqDto = new AnalisisEnergeticoRequest();
            reqDto.setConsumo_kwh(req.getConsumoKwh());
            reqDto.setTipo_inmueble(req.getTipoInmueble());
            reqDto.setCantidad_equipos(req.getCantidadEquipos());
            reqDto.setUso_horario_pico(Boolean.TRUE.equals(req.isUsoHorarioPico()));
            reqDto.setHoras_alto_consumo(req.getHorasAltoConsumo());
            reqDto.setRegion(req.getRegion());
            dto.setRequest(reqDto);
        }

        return dto;
    }
}
