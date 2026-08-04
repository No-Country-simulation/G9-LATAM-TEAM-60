package energiai.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AnalisisEnergeticoResponse {
    private Long id;
    private String identificador;
    private String categoria;
    private double probabilidad;
    private double costo_estimado_mensual;
    private List<String> recomendaciones;
    private String fecha;

    // Campos del requerimiento de evaluación (solicitud original)
    private Double consumo_kwh;
    private String tipo_inmueble;
    private Integer cantidad_equipos;
    private Boolean uso_horario_pico;
    private Integer horas_alto_consumo;
    private String region;
    private AnalisisEnergeticoRequest request;
}
