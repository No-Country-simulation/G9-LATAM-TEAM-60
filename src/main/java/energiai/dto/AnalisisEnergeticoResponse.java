package energiai.dto;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table (name = "analisis_energetico_response")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode (of = "id")
public class AnalisisEnergeticoResponse {
    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Long id;
    private String categoria;
    private double probabilidad;
    @ElementCollection
    @CollectionTable(
            name = "analisis_recomendaciones",
            joinColumns = @JoinColumn(name = "analisis_response_id")
    )
    @Column(name = "recomendacion")
    private List<String> recomendaciones;
    private double costo_estimado_mensual;
    @OneToOne(mappedBy = "analisisRespuesta")
    private AnalisisEnergeticoRequest analisisPeticion;
}
