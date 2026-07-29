package energiai.dto;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table (name = "analisis_energetico_request")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode (of = "id")
public class AnalisisEnergeticoRequest {
    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Long id;
    private String region;
    private double consumo_kwh;
    private boolean uso_horario_pico;
    private int cantidad_equipos;
    private String tipo_inmueble;
    private int horas_alto_consumo;
    @OneToOne (cascade = CascadeType.ALL)
    @JoinColumn(name = "analisis_respuesta_id", referencedColumnName = "id")
    private AnalisisEnergeticoResponse analisisRespuesta;

    // Constructor para el POST de AnalisisController
    public AnalisisEnergeticoRequest(AnalisisEnergeticoRequest request, AnalisisEnergeticoResponse response) {
        this.region = request.getRegion();
        this.consumo_kwh = request.getConsumo_kwh();
        this.uso_horario_pico = request.getUso_horario_pico();
        this.cantidad_equipos = request.getCantidad_equipos();
        this.tipo_inmueble = request.getTipo_inmueble();
        this.horas_alto_consumo = request.getHoras_alto_consumo();
        this.analisisRespuesta = response;
    }

    private boolean getUso_horario_pico() {
        return this.uso_horario_pico;
    }
}
