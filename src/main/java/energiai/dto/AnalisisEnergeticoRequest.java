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
}
